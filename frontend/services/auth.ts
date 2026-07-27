import axios from "axios";

export const registerUser = async (data: any) => {
  const res = await axios.post("http://localhost:5000/api/auth/register", data);
  return res.data;
};

// YENİ: Login artıq yalnız Mail və Şifrə alır, OTP_SENT cavabı verir
export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
  return res.data;
};

// YENİ: Gələn kodu yoxlayan API
export const verifyOtp = async (email: string, otp: string) => {
  const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
  return res.data;
};