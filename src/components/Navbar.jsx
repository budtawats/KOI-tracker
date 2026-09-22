import React from 'react';
import { 
  Package, 
  Calendar, 
  Calculator, 
  PlusCircle, 
  Download, 
  Search, 
  ExternalLink,
  ShieldCheck,
  Eye,
  LogOut,
  Settings
} from 'lucide-react';

export default function Navbar({ 
  onOpenNewOrder = () => {}, 
  onOpenTripManager = () => {}, 
  onOpenCalculator = () => {}, 
  onOpenExportImport = () => {}, 
  onOpenSettings = () => {}, 
  onSwitchToCustomer = () => {}, 
  orderCount = 0, 
  totalWeight = 0, 
  lastSavedTime = '' 
}) {
  const handleOpenCustomerNewTab = () => {
    const customerUrl = `${window.location.origin}${window.location.pathname}?mode=customer`;
    window.open(customerUrl, '_blank');
  };

  const safeCount = typeof orderCount === 'number' ? orderCount : 0;
  const safeWeight = (parseFloat(totalWeight) || 0).toFixed(1);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white shadow-md border-b-2 border-red-600 transition-all">
        {/* Admin Top Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-red-950 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 font-medium tracking-wide flex items-center justify-between border-b border-red-900/50">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" /> ADMIN PORTAL
            </span>
            <span className="text-gray-300 truncate max-w-[120px] sm:max-w-none">ระบบจัดการหลังบ้าน KOI Japan Shop</span>
            {lastSavedTime && (
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ซิงค์ข้อมูลล่าสุด: {lastSavedTime}</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-gray-300">
            <span><strong>{safeCount}</strong> รายการ (<strong>{safeWeight}</strong> กก.)</span>
            <button
              onClick={onSwitchToCustomer}
              className="text-red-300 hover:text-white flex items-center gap-1 underline font-semibold cursor-pointer"
            >
              <span>หน้าลูกค้า (เช็คพัสดุ)</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 ring-2 ring-red-100 shrink-0">
                <span className="text-lg sm:text-2xl font-black tracking-tight">KOI</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
                    KOI Japan Shop
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold bg-gray-900 text-white rounded-md shadow-sm">
                    หลังบ้าน
                  </span>
                </div>
                <p className="text-xs text-gray-500 hidden sm:block">
                  จัดการพัสดุ • คำนวณค่าน้ำหนัก • จัดการรอบวันกลับ • ออกใบเสร็จยอดเงิน
                </p>
              </div>
            </div>

            {/* Desktop & Mobile Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* Open Customer View in New Window/Tab */}
              <button
                onClick={handleOpenCustomerNewTab}
                title="เปิดหน้าต่างเช็คพัสดุสำหรับลูกค้าในแท็บใหม่"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>หน้าต่างลูกค้า (แท็บใหม่)</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </button>

              {/* Quick Calculator (Desktop) */}
              <button
                onClick={onOpenCalculator}
                title="เครื่องคิดเลขค่าน้ำหนัก"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors shadow-sm cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-red-600" />
                <span>คำนวณค่าน้ำหนัก</span>
              </button>

              {/* Trip Manager (Desktop) */}
              <button
                onClick={onOpenTripManager}
                title="จัดการรอบวันกลับ"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors shadow-sm cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>รอบวันกลับ</span>
              </button>

              {/* Export / Backup (Desktop) */}
              <button
                onClick={onOpenExportImport}
                title="สำรอง & ส่งออกข้อมูล"
                className="hidden sm:flex p-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Store Settings & Password */}
              <button
                onClick={onOpenSettings}
                title="ตั้งค่าร้านค้า, ช่องทางติดต่อ, บัญชีธนาคาร และรหัสผ่าน"
                className="p-2 text-gray-700 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200 transition-colors shadow-sm cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Add New Order Button */}
              <button
                onClick={onOpenNewOrder}
                className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>เพิ่มสินค้า</span>
              </button>

              {/* Exit / Switch to Customer View */}
              <button
                onClick={onSwitchToCustomer}
                title="ออกจากหน้าหลังบ้านไปหน้าลูกค้า"
                className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM FLOATING ACTION BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t-2 border-red-600 shadow-2xl py-2 px-3 flex items-center justify-around text-[10px] text-gray-600 font-bold no-print">
        <button
          onClick={onOpenNewOrder}
          className="flex flex-col items-center gap-0.5 text-red-600 active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/30">
            <PlusCircle className="w-4 h-4" />
          </div>
          <span>เพิ่มพัสดุ</span>
        </button>

        <button
          onClick={onOpenCalculator}
          className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-red-600 active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <span>คิดค่าน้ำหนัก</span>
        </button>

        <button
          onClick={onOpenTripManager}
          className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-blue-600 active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <span>รอบวันกลับ</span>
        </button>

        <button
          onClick={onOpenExportImport}
          className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-purple-600 active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <span>สำรองข้อมูล</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-gray-900 active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <span>ตั้งค่า</span>
        </button>
      </div>
    </>
  );
}
