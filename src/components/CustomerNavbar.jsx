import React from 'react';
import { Search, MessageCircle, Lock, ShieldCheck, HelpCircle } from 'lucide-react';

export default function CustomerNavbar({ onOpenAdminLogin, settings = {} }) {
  const lineUrl = settings.lineUrl || 'https://line.me';
  const shopName = settings.shopName || 'KOI Japan Shop';
  const shopTagline = settings.shopTagline || 'บริการติดตามสินค้าพรีออเดอร์จากญี่ปุ่น ชั่งน้ำหนักจริง ส่งตรงถึงบ้าน';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      {/* Customer Header Top Bar */}
      <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs py-1 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>🇯🇵 {shopName} — ตรวจสอบสถานะพัสดุและค่าน้ำหนักญี่ปุ่น-ไทย</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Shop Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 ring-2 ring-red-100">
              <span className="text-xl sm:text-2xl font-black tracking-tight">KOI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  {shopName}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-50 text-red-600 rounded-full border border-red-200">
                  ระบบเช็คสถานะพัสดุ
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                {shopTagline}
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* LINE Contact button */}
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-[#06C755] hover:bg-[#05b34c] rounded-xl shadow-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>LINE ร้าน</span>
            </a>

            {/* Switch to Admin (with PIN prompt) */}
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors border border-gray-200"
              title="เข้าสู่ระบบจัดการหลังบ้าน"
            >
              <Lock className="w-3.5 h-3.5 text-gray-600 shrink-0" />
              <span>หลังบ้าน</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
