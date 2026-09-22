import React from 'react';
import { Search, MessageCircle, Lock, ShieldCheck, Phone, HelpCircle, Send, Globe, Mail } from 'lucide-react';

export default function CustomerNavbar({ onOpenAdminLogin, settings = {} }) {
  const lineUrl = settings.lineUrl || 'https://line.me';
  const shopName = settings.shopName || 'KOI Japan Shop';
  const phone = settings.phone || '081-234-5678';
  const shopTagline = settings.shopTagline || 'บริการติดตามพัสดุนำเข้าจากญี่ปุ่น ชั่งน้ำหนักจริง ส่งตรงถึงบ้าน';

  return (
    <header className="sticky top-0 z-30 bg-white shadow-md border-b-2 border-[#ED1C24] transition-all">
      {/* 1. Official Top Red Postal Banner */}
      <div className="bg-[#ED1C24] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 font-medium tracking-wide flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            🇯🇵 JAPAN • THAILAND
          </span>
          <span className="hidden sm:inline text-red-100 font-normal">
            ระบบติดตามสถานะสิ่งของและพัสดุพรีออเดอร์ (Track & Trace)
          </span>
        </div>

        <div className="flex items-center gap-4 text-red-100 text-[11px]">
          {phone && (
            <a href={`tel:${phone.replace(/[^0-9]/g, '')}`} className="hover:text-white flex items-center gap-1 font-semibold">
              <Phone className="w-3 h-3" />
              <span>{phone}</span>
            </a>
          )}
          <span className="hidden md:inline text-red-200">|</span>
          <span className="hidden md:inline text-red-100">บริการทุกวัน 24 ชม.</span>
        </div>
      </div>

      {/* 2. Main Postal Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Official Postal Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#ED1C24] to-[#C81018] flex items-center justify-center text-white shadow-lg shadow-red-500/30 ring-2 ring-red-100 shrink-0">
              <Send className="w-5 h-5 sm:w-6 sm:h-6 -rotate-12 translate-x-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight font-sans">
                  {shopName}
                </span>
                <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold bg-[#ED1C24] text-white rounded-md tracking-wider shadow-sm uppercase">
                  POST
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] sm:text-xs font-bold text-[#ED1C24] tracking-wide">
                  TRACK & TRACE
                </span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="text-xs text-gray-500 hidden sm:inline truncate max-w-[320px]">
                  {shopTagline}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* LINE Contact button */}
            <a
              href={lineUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold text-white bg-[#06C755] hover:bg-[#05b34c] rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>LINE ร้าน</span>
            </a>

            {/* Switch to Admin (with PIN prompt) */}
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors border border-gray-200 shadow-sm"
              title="เข้าสู่ระบบจัดการหลังบ้านสำหรับเจ้าหน้าที่"
            >
              <Lock className="w-3.5 h-3.5 text-[#ED1C24] shrink-0" />
              <span>เจ้าหน้าที่</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
