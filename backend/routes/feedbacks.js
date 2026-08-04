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

// 1. BÜTÜN RƏYLƏRİ ÇƏKMƏK
router.get('/', async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: { replies: true },
      orderBy: { createdAt: 'desc' }
    });
    
    // Frontend MongoDB tipli "_id" gözlədiyinə görə, Prisma-nın "id"-sini "_id" kimi kopyalayırıq
    const formattedFeedbacks = feedbacks.map(fb => ({
      ...fb,
      _id: fb.id,
      replies: fb.replies.map(r => ({ ...r, _id: r.id }))
    }));

    res.json(formattedFeedbacks);
  } catch (error) {
    console.error("Rəyləri çəkərkən xəta:", error);
    res.status(500).json({ error: "Rəylər çəkilə bilmədi" });
  }
});

// 2. YENİ RƏY YAZMAQ
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { rating, text } = req.body;
    
    const newFeedback = await prisma.feedback.create({
      data: {
        rating: Number(rating),
        text: text,
        authorId: req.user.id,
        authorName: req.user.firstName || req.user.name || 'İstifadəçi',
        role: req.user.role || 'USER'
      }
    });
    
    res.status(201).json({ ...newFeedback, _id: newFeedback.id });
  } catch (error) {
    console.error("Rəy yazarkən xəta:", error);
    res.status(500).json({ error: "Rəy yaradılarkən xəta baş verdi" });
  }
});

// 3. RƏYƏ CAVAB YAZMAQ
router.post('/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const feedbackId = req.params.id;

    const newReply = await prisma.feedbackReply.create({
      data: {
        text: text,
        feedbackId: feedbackId,
        authorId: req.user.id,
        authorName: req.user.firstName || req.user.name || 'İstifadəçi',
        role: req.user.role || 'USER'
      }
    });
    
    res.status(201).json({ ...newReply, _id: newReply.id });
  } catch (error) {
    console.error("Cavab yazarkən xəta:", error);
    res.status(500).json({ error: "Cavab yazılarkən xəta baş verdi" });
  }
});

module.exports = router;