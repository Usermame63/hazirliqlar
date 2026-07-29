const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db'); 
const router = express.Router();

const otpStore = new Map();

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

// 2. GİRİŞ (BİRBAŞA GİRİŞƏ KЕÇİLDİ - OTP LƏĞV EDİLDİ)
router.post('/login', async (req, res) => {
  try {
    console.log("---- YENİ BİRBAŞA LOGİN İSTƏYİ GƏLDİ ----");
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Bu e-poçt qeydiyyatdan keçməyib!" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Şifrə yanlışdır!" });
    }

    /* MÜVƏQQƏTİ OLARAQ LƏĞV EDİLƏN OTP KODLARI 
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(email, otpCode);
    fetch('https://hazirliqlar.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, otp: otpCode })
    }).catch(err => console.log(err));
    return res.json({ message: "OTP_SENT", email: user.email });
    */

    // --- BİRBAŞA GİRİŞ İCAZƏSİ ---
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log("Şifrə düzgündür! OTP olmadan birbaşa giriş icazəsi verildi.");
    
    res.json({ message: "Uğurlu", token, user });

  } catch (error) {
    console.error("!!! GİRİŞ ZAMANI XƏTA BAŞ VERDİ !!!", error);
    res.status(500).json({ message: "Giriş xətası baş verdi." });
  }
});

// 3. KODU TƏSDİQLƏ (Hələlik istifadə olunmayacaq, amma silmirik)
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