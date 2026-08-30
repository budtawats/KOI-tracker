import React, { useState } from 'react';
import { Lock, KeyRound, X, Check, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess, settings = {} }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Read set PIN from settings, then from localStorage, fallback to 1234 only if never set
  const getStoredPin = () => {
    if (settings && settings.adminPin) return settings.adminPin;
    try {
      const saved = localStorage.getItem('koi_japan_shop_settings_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.adminPin) return parsed.adminPin;
      }
    } catch {}
    return '1234';
  };

  const validPin = getStoredPin();

  const handleVerify = (e) => {
    e.preventDefault();
    if (pin === validPin) {
      setError('');
      setPin('');
      onLoginSuccess();
      onClose();
    } else {
      setError('รหัสผ่าน PIN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-900">เข้าสู่ระบบจัดการหลังบ้าน</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              สำหรับเจ้าของร้านและแอดมิน KOI Japan Shop
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4 pt-2 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                รหัสผ่าน / PIN เข้าหลังบ้าน
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  autoFocus
                  placeholder="กรอกรหัส PIN เข้าหลังบ้าน"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono tracking-widest text-center focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none transition-all"
                />
              </div>
              {error && (
                <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white text-xs font-bold shadow-md shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
