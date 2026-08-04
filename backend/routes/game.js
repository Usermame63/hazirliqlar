const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// API açarını .env faylından oxuyuruq
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Süni İntellektdən Canlı Sual Almaq Üçün Route
router.post('/generate-question', async (req, res) => {
  try {
    const { category, difficulty } = req.body;
    
    // Kateqoriyaları AI-nin başa düşəcəyi dilə çeviririk
    const categoryMap = {
      math: "Riyaziyyat və məntiqi hesablamalar",
      logic: "Düşündürücü məntiq və zəka",
      tech: "İnformasiya texnologiyaları, proqramlaşdırma və elm"
    };
    
    const topic = categoryMap[category] || "Ümumi dünyagörüşü";
    const level = difficulty || "orta";

    // Süni intellektə göndərilən gizli əmr (Prompt)
    const prompt = `Sən bir bilik yarışması üçün sual hazırlayan peşəkar mütəxəssissən. 
    Mövzu: ${topic}. 
    Çətinlik dərəcəsi: ${level}.
    Səndən istəyim: Azərbaycan dilində, əvvəllər heç yerdə istifadə olunmamış, tamamilə unikal və düşündürücü 1 ədəd sual yarat. 
    Sualın mütləq 4 ədəd fərqli variantı olmalıdır. Variantların qarşısında A, B, C, D hərfləri YAZILMAMALIDIR (sadəcə cavabın özünü yaz).
    
    Cavabı YALNIZ VƏ YALNIZ aşağıdakı JSON formatında qaytar, başqa heç bir əlavə mətn, izah və ya formatlama işarəsi (məsələn, \`\`\`json) yazma:
    {
      "question": "Sualın tam mətni",
      "options": ["Variant 1", "Variant 2", "Variant 3", "Variant 4"],
      "answer": "Doğru variantın tam mətni"
    }`;

    // Ən sürətli və ağıllı modeli seçirik
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // AI-dən cavabı gözləyirik
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Əgər AI səhvən JSON blokları (```json) içində qaytararsa, onu təmizləyirik
    const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // JSON-u JavaScript obyektinə çeviririk
    const questionData = JSON.parse(cleanJsonString);

    // Əgər fırıldaqçılığın qarşısını tam almaq istəyiriksə, variantların yerini backend-də də qarışdıra bilərik
    questionData.options = questionData.options.sort(() => Math.random() - 0.5);

    // Hazır sualı tətbiqə (frontend-ə) göndəririk
    res.json(questionData);

  } catch (error) {
    console.error("AI Sual Yaratma Xətası:", error);
    res.status(500).json({ 
      message: "Sual yaradılarkən serverdə xəta baş verdi.",
      error: error.message 
    });
  }
});

module.exports = router;