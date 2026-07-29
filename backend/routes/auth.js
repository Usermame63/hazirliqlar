const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const prisma = require('../db'); 
const router = express.Router();

// OTP Yaddaşı (Müvəqqəti olaraq kodları burda saxlayırıq)
const otpStore = new Map();

// E-poçt göndərən sistem (Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 1. QEYDİYYAT SİSTEMİ
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

// 2. GİRİŞ (TEST ÜÇÜN DƏYİŞDİRİLDİ - MAİL GÖNDƏRMİR, KOD: 1111)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Bu e-poçt qeydiyyatdan keçməyib!" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Şifrə yanlışdır!" });

    // TEST ÜÇÜN: Təsadüfi kod əvəzinə sabit "1111" qoyuruq
    const otpCode = "1111";
    
    // Kodu yaddaşa yazırıq
    otpStore.set(email, otpCode);

    // TEST ÜÇÜN: E-poçt göndərmə sistemini (Nodemailer) bağladıq!
    /* 
    const mailOptions = {
      from: \`"Hazırlıqlar Platforması" <\${process.env.EMAIL_USER}>\`,
      to: email,
      subject: '🔐 Təhlükəsizlik Kodunuz',
      html: \`...\`
    };
    await transporter.sendMail(mailOptions);
    */

    console.log("TEST: Sistem e-poçt göndərmədi, birbaşa cavab verdi.");

    // Server donmadan dərhal frontend-ə xəbər verir
    res.json({ message: "OTP_SENT", email: user.email });
  } catch (error) {
    console.error("Giriş xətası:", error);
    res.status(500).json({ message: "Giriş zamanı xəta baş verdi." });
  }
});

// 3. KODU TƏSDİQLƏ VƏ İÇƏRİ BURAX
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Yaddaşdakı kodla gələn kodu yoxlayırıq
    if (otpStore.get(email) !== otp) {
      return res.status(400).json({ message: "Daxil etdiyiniz kod yanlışdır!" });
    }

    // Kod düzdürsə, bir daha istifadə olunmasın deyə silirik
    otpStore.delete(email);

    // İstifadəçini tapıb əsl icazəni (Token) veririk
    const user = await prisma.user.findUnique({ where: { email } });
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: "Uğurlu", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server xətası" });
  }
});

module.exports = router;