const express = require('express');
const router = express.Router();
const prisma = require('../db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Təhlükəsizlik
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "İcazə yoxdur" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Token səhvdir" });
  }
};

// 🚨 YENİ: Şəkillər üçün qovluq yoxdursa, avtomatik yarat!
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer ayarı
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });

// 1. Söhbətlər
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, role: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, role: true } }
      }
    });

    const conversationsMap = new Map();
    messages.forEach(msg => {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg.content,
          time: msg.createdAt,
          isRead: msg.isRead,
          senderId: msg.senderId
        });
      }
    });

    res.json(Array.from(conversationsMap.values()));
  } catch (error) {
    res.status(500).json({ message: "Söhbətlər yüklənmədi" });
  }
});

// 2. Keçmiş mesajları gətir
router.get('/:otherUserId', authenticate, async (req, res) => {
  try {
    const myId = req.user.userId;
    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: myId }
        ]
      },
      orderBy: { createdAt: 'asc' } 
    });

    await prisma.message.updateMany({
      where: { senderId: otherUserId, receiverId: myId, isRead: false },
      data: { isRead: true }
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Mesajlar yüklənmədi" });
  }
});

// 3. Fayl (Şəkil və ya Səs) göndərmək üçün API
router.post('/upload', authenticate, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Fayl tapılmadı" });
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  } catch (error) {
    res.status(500).json({ message: "Fayl yüklənmədi" });
  }
});

module.exports = router;