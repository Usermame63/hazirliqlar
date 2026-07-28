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

// YENİ: Şifrəni unutdum - Emailə kod göndərmək üçün
export const forgotPassword = async (email: string) => {
  const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/auth/forgot-password", { email });
  return res.data;
};

// YENİ: Yeni şifrəni və kodu təsdiqləmək üçün
export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const res = await axios.post("https://hazirliqlar-backend.onrender.com/api/auth/reset-password", { email, otp, newPassword });
  return res.data;
};