import axios from "axios";

export const registerUser = async (data: any) => {
  const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/auth/register", data);
  return res.data;
};

// YENİ: Login artıq yalnız Mail və Şifrə alır, OTP_SENT cavabı verir
export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/auth/login", { email, password });
  return res.data;
};

// YENİ: Gələn kodu yoxlayan API
export const verifyOtp = async (email: string, otp: string) => {
  const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/auth/verify-otp", { email, otp });
  return res.data;
};

// --- YENİ ƏLAVƏ OLUNAN ŞİFRƏ SIFIRLAMA FUNKSİYALARI ---

// Şifrəni yeniləmək üçün e-poçta kod göndərmə
export const forgotPassword = async (email: string) => {
  const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/auth/forgot-password", { email });
  return res.data;
};

// Təsdiq kodu ilə yeni şifrəni təyin etmə
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/auth/reset-password", { email, otp, newPassword });
  return res.data;
};