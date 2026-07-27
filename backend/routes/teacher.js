const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

const router = express.Router();

// 1. Ana səhifə üçün bütün müəllimləri çəkən API
router.get('/', async (req, res) => {
  try {
    const teachers = await prisma.teacherProfile.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, phone: true }
        }
      }
    });
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server xətası baş verdi.' });
  }
});

// 2. Müəllim profilinə girəndə onun ŞƏXSİ məlumatlarını gətirən API
router.get('/my-profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'İcazə yoxdur' });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'menim_cox_gizli_acaram_123');

    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: decoded.userId }
    });
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Xəta baş verdi' });
  }
});

// 3. Məlumatları ƏSL BAZADA yeniləyən API
router.put('/update', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'İcazə yoxdur' });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'menim_cox_gizli_acaram_123');

    const { subjects, experience, pricePerMonth, mode, address } = req.body;
    
    // Fənləri vergülə görə ayırıb siyahıya (array) çeviririk
    const subjectsArray = typeof subjects === 'string' ? subjects.split(',').map(s => s.trim()) : subjects;

    const updated = await prisma.teacherProfile.update({
      where: { userId: decoded.userId },
      data: {
        subjects: subjectsArray,
        experience: Number(experience),
        pricePerMonth: Number(pricePerMonth),
        mode: mode,
        address: address
      }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Yenilənmə xətası' });
  }
});

// 4. Tək bir müəllimin detalları (Gələcəkdə lazım olacaq)
router.get('/:id', async (req, res) => {
  try {
    const teacher = await prisma.teacherProfile.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        reviews: true
      }
    });
    if (!teacher) return res.status(404).json({ message: 'Tapılmadı' });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Xəta' });
  }
});

module.exports = router;