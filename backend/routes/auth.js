const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const prisma = require('../db'); 
const router = express.Router();

const otpStore = new Map();

// --- 587 NÖMRƏLİ PORTLA (TLS) YENİ GİRİŞ SİSTEMİ ---
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,             // 465 əvəzinə 587 qoyduq
  secure: false,         // 587 portu üçün bu mütləq false olmalıdır
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// 1. QEYDİYYAT
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, fatherName, motherName, subject, price, experience } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Bu e-poçt artıq qeydiyyatdan keçib!" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName, lastName, email, passwordHash, phone, role,
        ...(role === 'TEACHER' && {
          teacherProfile: {
            create: {
              fatherName,
              subjects: subject ? [subject] : [],
              experience: Number(experience || 0),
              pricePerMonth: Number(price || 0),
              teachingLang: ["Azərbaycan dili"],
              mode: "Əyani (Offline)"
            }
          }
        })
      }
    });
    res.status(201).json({ message: "Uğurla yaradıldı", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xətası baş verdi" });
  }
});

// 2. GİRİŞ 
router.post('/login', async (req, res) => {
  try {
    console.log("---- YENİ LOGİN İSTƏYİ GƏLDİ ----");
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("XƏTA: Bu e-poçt bazada tapılmadı!");
      return res.status(400).json({ message: "Bu e-poçt qeydiyyatdan keçməyib!" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log("XƏTA: Şifrə yanlışdır!");
      return res.status(400).json({ message: "Şifrə yanlışdır!" });
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(email, otpCode);

    console.log(`ADIM 4: ${process.env.EMAIL_USER} ünvanından ${email} ünvanına Port 587 ilə e-poçt göndərilir...`);
    
    const mailOptions = {
      from: `"Hazırlıqlar Platforması" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Təhlükəsizlik Kodunuz',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #2563eb;">Hazırlıqlar Platformasına Giriş</h2>
          <p style="font-size: 16px; color: #475569;">Hesabınıza daxil olmaq üçün təsdiq kodunuz:</p>
          <div style="font-size: 32px; font-weight: bold; background: #f1f5f9; padding: 15px; border-radius: 10px; letter-spacing: 5px; color: #0f172a; width: fit-content; margin: 0 auto;">
            ${otpCode}
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("ADIM 5: ƏLA! E-poçt uğurla göndərildi!");

    res.json({ message: "OTP_SENT", email: user.email });
  } catch (error) {
    console.error("!!! GİRİŞ ZAMANI XƏTA BAŞ VERDİ !!!", error);
    res.status(500).json({ message: "Kod göndərilərkən xəta baş verdi. Gmail ayarlarını yoxlayın." });
  }
});

// 3. KODU TƏSDİQLƏ
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (otpStore.get(email) !== otp) return res.status(400).json({ message: "Daxil etdiyiniz kod yanlışdır!" });

    otpStore.delete(email);
    const user = await prisma.user.findUnique({ where: { email } });
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: "Uğurlu", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
});

module.exports = router;