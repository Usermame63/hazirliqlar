const API_URL = 'https://hazirliqlar-backend.onrender.com';

export const register = async (userData: any) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Qeydiyyat zamanı xəta baş verdi');
  return data;
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Giriş zamanı xəta baş verdi');
  return data;
};

export const verifyOTP = async (email: string, otp: string) => {
  const response = await fetch(`${API_URL}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Kod yanlışdır');
  return data;
};

// YENİ ƏLAVƏ OLUNANLAR:
export const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Xəta baş verdi');
  return data;
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Xəta baş verdi');
  return data;
};