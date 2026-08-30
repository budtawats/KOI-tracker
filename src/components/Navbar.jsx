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
  onOpenNewOrder, 
  onOpenTripManager, 
  onOpenCalculator, 
  onOpenExportImport,
  onOpenSettings,
  onSwitchToCustomer,
  orderCount,
  totalWeight,
  lastSavedTime
}) {
  const handleOpenCustomerNewTab = () => {
    const customerUrl = `${window.location.origin}${window.location.pathname}?mode=customer`;
    window.open(customerUrl, '_blank');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-red-900 text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600/80 text-[10px] font-bold uppercase">
            <ShieldCheck className="w-3 h-3" /> Admin Portal
          </span>
          <span className="hidden sm:inline text-gray-300">ระบบจัดการหลังบ้าน KOI Japan Shop</span>
          {lastSavedTime && (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>บันทึกอัตโนมัติ: {lastSavedTime}</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-[11px] text-gray-300">
          <span>รวม <strong>{orderCount}</strong> ออเดอร์ (<strong>{totalWeight.toFixed(2)}</strong> กก.)</span>
          <button
            onClick={onSwitchToCustomer}
            className="text-red-300 hover:text-white flex items-center gap-1 underline"
          >
            <span>สลับไปหน้าลูกค้า</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 ring-2 ring-red-100">
              <span className="text-xl sm:text-2xl font-black tracking-tight">KOI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  KOI Japan Shop
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-900 text-white rounded-full">
                  ระบบหลังบ้าน
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                จัดการพัสดุ • คำนวณค่าน้ำหนัก • จัดการรอบวันกลับ • ออกใบแจ้งยอด
              </p>
            </div>
          </div>

          {/* Action Tools & Switch View Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Open Customer View in New Window/Tab */}
            <button
              onClick={handleOpenCustomerNewTab}
              title="เปิดหน้าต่างเช็คพัสดุสำหรับลูกค้าในแท็บใหม่"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl transition-all shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>หน้าต่างลูกค้า (แท็บใหม่)</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </button>

            {/* Quick Calculator */}
            <button
              onClick={onOpenCalculator}
              title="เครื่องคิดเลขค่าน้ำหนัก"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5 text-amber-600" />
              <span>คำนวณค่าน้ำหนัก</span>
            </button>

            {/* Trip Manager */}
            <button
              onClick={onOpenTripManager}
              title="จัดการรอบวันกลับ"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>รอบวันกลับ</span>
            </button>

            {/* Export / Backup */}
            <button
              onClick={onOpenExportImport}
              title="สำรอง & ส่งออกข้อมูล"
              className="p-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Store Settings & Password */}
            <button
              onClick={onOpenSettings}
              title="ตั้งค่าร้านค้า, ช่องทางติดต่อ, บัญชีธนาคาร และรหัสผ่าน"
              className="p-2 text-gray-700 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200 transition-colors shadow-sm"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Add New Order Button */}
            <button
              onClick={onOpenNewOrder}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>เพิ่มสินค้า</span>
            </button>

            {/* Exit / Switch to Customer View */}
            <button
              onClick={onSwitchToCustomer}
              title="ออกจากหน้าหลังบ้านไปหน้าลูกค้า"
              className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
