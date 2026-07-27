// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Gələn sorğunun başlığından (header) tokeni alırıq
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: "İcazə rədd edildi. Token yoxdur." });

  try {
    // Tokenin bizə aid olub-olmadığını və etibarlılığını yoxlayırıq
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // İstifadəçi məlumatlarını req.user içinə qoyuruq ki, API-da istifadə edək
    next(); // Növbəti mərhələyə keçidə icazə veririk
  } catch (err) {
    res.status(400).json({ error: "Etibarsız token." });
  }
};