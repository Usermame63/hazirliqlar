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

// 1. Şagirdin son baxdığı müəllimləri çəkmək
router.get('/recent-views', authenticateToken, async (req, res) => {
  try {
    const views = await prisma.viewedTeacher.findMany({
      where: { studentId: req.user.userId },
      orderBy: { viewedAt: 'desc' },
      take: 5,
      include: {
        teacher: {
          select: {
            id: true, firstName: true, lastName: true, subjects: true, pricePerMonth: true,
            user: { select: { email: true } }
          }
        }
      }
    });
    res.json(views);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Baxışlar çəkilə bilmədi' });
  }
});

// 2. Təhsil məlumatlarını yeniləmək
router.put('/education', authenticateToken, async (req, res) => {
  try {
    const { educationLevel, educationInstitution } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { educationLevel, educationInstitution }
    });
    res.json({ message: 'Təhsil məlumatları yeniləndi', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Yenilənərkən xəta baş verdi' });
  }
});

// 3. Favoritləri (Bəyəndiklərimi) çəkmək
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { studentId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        teacher: {
          select: {
            id: true, firstName: true, lastName: true, subjects: true, pricePerMonth: true
          }
        }
      }
    });
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Favoritlər çəkilə bilmədi' });
  }
});

// 4. Favorit əlavə etmək və ya silmək (Toggle)
router.post('/favorites/toggle', authenticateToken, async (req, res) => {
  try {
    const { teacherId } = req.body;
    if (!teacherId) return res.status(400).json({ message: 'Müəllim ID-si tələb olunur' });

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        studentId_teacherId: {
          studentId: req.user.userId,
          teacherId: teacherId
        }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      return res.json({ message: 'Favoritdən çıxarıldı', isFavorite: false });
    } else {
      await prisma.favorite.create({
        data: {
          studentId: req.user.userId,
          teacherId: teacherId
        }
      });
      return res.json({ message: 'Favoritə əlavə edildi', isFavorite: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Favorit yenilənərkən xəta baş verdi' });
  }
});

module.exports = router;