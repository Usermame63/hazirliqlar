const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const prisma = require('./db');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(helmet({ crossOriginResourcePolicy: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 500, 
});
app.use(limiter);

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/feedbacks', require('./routes/feedbacks'));
app.use('/api/student', require('./routes/student'));

// API Marşrutları
app.use('/api/auth', require('./routes/auth'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/message', require('./routes/message'));
app.use('/api/admin', require('./routes/admin')); // Admin rotasını buraya bağladık!

// YENİ: Oyun və Süni İntellekt (AI) API-si
app.use('/api/game', require('./routes/game')); 

// Socket.io Canlı Bağlantı Protokolü
const io = new Server(server, {
  cors: { origin: "*" }
});

const activeUsers = new Map();

io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    activeUsers.set(userId, socket.id);
    io.emit('user_online', userId); 
  });

  socket.on('send_message', async (data) => {
    const { senderId, receiverId, content } = data;
    try {
      const savedMessage = await prisma.message.create({
        data: { senderId, receiverId, content, isRead: false }
      });
      const receiverSocketId = activeUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', savedMessage);
      }
      socket.emit('message_sent_success', savedMessage);
    } catch (error) {
      console.error("Hata:", error);
    }
  });

  socket.on('typing', (data) => {
    const { senderId, receiverId } = data;
    const receiverSocketId = activeUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', { senderId });
    }
  });

  socket.on('mark_as_read', async (data) => {
    const { senderId, receiverId } = data;
    await prisma.message.updateMany({
      where: { senderId: senderId, receiverId: receiverId, isRead: false },
      data: { isRead: true }
    });
    const originalSenderSocket = activeUsers.get(senderId);
    if (originalSenderSocket) {
      io.to(originalSenderSocket).emit('messages_read_by_user', { readerId: receiverId });
    }
  });

  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    for (let [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        activeUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUserId) {
      io.emit('user_offline', disconnectedUserId);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda işə düşdü... 🚀`);
});