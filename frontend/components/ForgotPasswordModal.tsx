import { useState } from 'react';
import { forgotPassword, resetPassword } from '../services/auth';

export default function ForgotPasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendCode = async () => {
    try {
      setError('');
      await forgotPassword(email);
      setMessage('Təsdiq kodu email ünvanınıza göndərildi!');
      setStep(2);
    } catch (err) {
      setError('Email tapılmadı və ya xəta baş verdi.');
    }
  };

  const handleResetPassword = async () => {
    try {
      setError('');
      await resetPassword(email, otp, newPassword);
      setMessage('Şifrəniz uğurla yeniləndi! İndi giriş edə bilərsiniz.');
      setStep(3);
    } catch (err) {
      setError('Kod yanlışdır və ya xəta baş verdi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative transform transition-all">
        {/* Bağlamaq düyməsi */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Şifrənin Bərpası</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg text-sm text-center">{message}</div>}

        {/* Addım 1: Email daxil etmək */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Hesabınıza bağlı email ünvanını daxil edin. Sizə 6 rəqəmli təsdiq kodu göndərəcəyik.</p>
            <input 
              type="email" 
              placeholder="Email ünvanınız" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <button 
              onClick={handleSendCode} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Kodu Göndər
            </button>
          </div>
        )}

        {/* Addım 2: Kod və Yeni Şifrə daxil etmək */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Emailə gələn kodu və yeni şifrənizi daxil edin.</p>
            <input 
              type="text" 
              placeholder="6 rəqəmli kod" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest text-lg"
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Yeni Şifrə" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
            <button 
              onClick={handleResetPassword} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Şifrəni Yenilə
            </button>
          </div>
        )}

        {/* Addım 3: Uğurlu Sonluq */}
        {step === 3 && (
          <div className="space-y-4 text-center">
            <div className="text-5xl mb-4">✅</div>
            <button 
              onClick={onClose} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors">
              Giriş Səhifəsinə Qayıt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}