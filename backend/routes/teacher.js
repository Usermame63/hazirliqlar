const express = require('express');
const router = express.Router();
const prisma = require('../db');
const jwt = require('jsonwebtoken');

// Token yoxlanışı (Middleware)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token yoxdur' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Sessiyanız bitib' });
    req.user = user;
    next();
  });
};

// 1. Müəllimin öz profili ilə bağlı məlumatlarını çəkmək
router.get('/my-profile', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: req.user.userId },
      include: { user: true }
    });
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Profil çəkilə bilmədi' });
  }
});

// 2. Bütün müəllimlərin siyahısını çəkmək
router.get('/', async (req, res) => {
  try {
    const teachers = await prisma.teacherProfile.findMany({
      include: {
        user: {
          select: {
            id: true, firstName: true, lastName: true, email: true, photoUrl: true, role: true
          }
        }
      }
    });
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Müəllimlər çəkilə bilmədi' });
  }
});

// 3. Tək bir müəllimin profilini çəkmək (DÜZƏLDİLDİ: userId ilə axtar)
router.get('/:id', async (req, res) => {
  try {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { userId: req.params.id }, // BURASI DÜZƏLDİLDİ!
      include: {
        user: {
          select: {
            id: true, firstName: true, lastName: true, email: true, photoUrl: true, role: true
          }
        }
      }
    });
    if (!teacher) return res.status(404).json({ message: 'Müəllim tapılmadı' });
    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Müəllim profili çəkilə bilmədi' });
  }
});

// 4. Müəllim profilini yeniləmək
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { subjects, experience, pricePerMonth, mode, address } = req.body;
    const updated = await prisma.teacherProfile.update({
      where: { userId: req.user.userId },
      data: {
        subjects: subjects ? subjects.split(',').map(s => s.trim()) : [],
        experience: Number(experience) || 0,
        pricePerMonth: Number(pricePerMonth) || 0,
        mode: mode || "Əyani (Offline)",
        address: address || ""
      }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Profil yenilənə bilmədi' });
  }
});

// 5. Müəllim profil şəklini (Portfolyo) yeniləmək
router.put('/photo', authenticateToken, async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const updatedProfile = await prisma.teacherProfile.update({
      where: { userId: req.user.userId },
      data: { photoUrl: photoUrl }
    });
    res.json({ message: 'Şəkil uğurla yeniləndi', profile: updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Şəkil yüklənərkən xəta baş verdi' });
  }
});

module.exports = router;