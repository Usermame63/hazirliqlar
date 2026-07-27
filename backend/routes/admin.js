const express = require('express');
const router = express.Router();
const prisma = require('../db');
const jwt = require('jsonwebtoken');

// Admin Doğrulama Middleware (İleride korumayı artırmak için hazır)
const authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Giriş izni yok" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Geçersiz token" });
  }
};

// 1. Canlı İstatistikleri Getir (Kullanıcı, Öğretmen, Öğrenci Sayıları)
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTeachers = await prisma.user.count({ where: { role: 'TEACHER' } });
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

    res.json({
      totalUsers,
      totalTeachers,
      totalStudents,
      revenueSimulated: totalTeachers * 25 // Örnek startap simüle kazancı
    });
  } catch (error) {
    res.status(500).json({ message: "İstatistikler alınamadı" });
  }
});

// 2. Tüm Kullanıcıları Listele
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Kullanıcılar alınamadı" });
  }
});

// 3. Şüpheli/Sahte Kullanıcıyı Sistemden Tamamen Sil
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinirken hata oluştu" });
  }
});

module.exports = router;