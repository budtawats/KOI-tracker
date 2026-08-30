import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Store, 
  Phone, 
  MessageCircle, 
  Lock, 
  KeyRound, 
  CreditCard, 
  Save, 
  Check, 
  ShieldCheck,
  Building,
  Globe,
  Share2,
  AlertCircle
} from 'lucide-react';

export default function StoreSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}) {
  const [formData, setFormData] = useState({
    shopName: 'KOI Japan Shop',
    shopTagline: 'บริการพรีออเดอร์ & ขนส่งสินค้าจากญี่ปุ่น ชั่งน้ำหนักจริง ส่งตรงถึงบ้าน',
    phone: '081-234-5678',
    lineId: '@koijapanshop',
    lineUrl: 'https://line.me',
    facebook: 'KOI Japan Shop',
    instagram: '@koijapan.shop',
    address: 'กรุงเทพมหานคร ประเทศไทย',
    bankName: 'กสิกรไทย (KBANK)',
    bankAccountNo: '123-4-56789-0',
    bankAccountName: 'KOI Japan Shop',
    promptpay: '081-234-5678',
    adminPin: '1234',
    requirePin: true
  });

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('contact'); // 'contact', 'payment', 'security'

  useEffect(() => {
    if (isOpen && settings) {
      setFormData({
        shopName: settings.shopName || 'KOI Japan Shop',
        shopTagline: settings.shopTagline || 'บริการพรีออเดอร์ & ขนส่งสินค้าจากญี่ปุ่น ชั่งน้ำหนักจริง ส่งตรงถึงบ้าน',
        phone: settings.phone || '081-234-5678',
        lineId: settings.lineId || '@koijapanshop',
        lineUrl: settings.lineUrl || 'https://line.me',
        facebook: settings.facebook || 'KOI Japan Shop',
        instagram: settings.instagram || '@koijapan.shop',
        address: settings.address || 'กรุงเทพมหานคร ประเทศไทย',
        bankName: settings.bankName || 'กสิกรไทย (KBANK)',
        bankAccountNo: settings.bankAccountNo || '123-4-56789-0',
        bankAccountName: settings.bankAccountName || 'KOI Japan Shop',
        promptpay: settings.promptpay || '081-234-5678',
        adminPin: settings.adminPin || '1234',
        requirePin: settings.requirePin !== false
      });
      setNewPin(settings.adminPin || '1234');
      setConfirmPin(settings.adminPin || '1234');
      setPinError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPin !== confirmPin) {
      setPinError('รหัสผ่าน PIN ทั้งสองช่องไม่ตรงกัน');
      setActiveTab('security');
      return;
    }

    setPinError('');

    // Preserve custom PIN if not explicitly changed
    const targetPin = (newPin && newPin.trim()) ? newPin.trim() : (formData.adminPin || settings?.adminPin || '1234');

    const updated = {
      ...formData,
      adminPin: targetPin
    };

    onSaveSettings(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-red-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">ตั้งค่าร้านค้า & ช่องทางติดต่อ & รหัสผ่าน</h3>
              <p className="text-xs text-gray-300">
                ปรับปรุงข้อมูลร้านค้า, เบอร์โทร, LINE, เลขที่บัญชี และรหัสผ่านเข้าหลังบ้าน
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-6 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'contact'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>ข้อมูลร้าน & ช่องทางติดต่อ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'payment'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>บัญชีธนาคาร & การชำระเงิน</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-red-600 text-red-600 font-bold'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>รหัสผ่านเข้าหลังบ้าน (PIN)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          
          {/* TAB 1: CONTACT & SHOP INFO */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    ชื่อร้านค้า <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    เบอร์โทรศัพท์ติดต่อร้าน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 081-234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  คำอธิบายร้านค้า / สโลแกน
                </label>
                <input
                  type="text"
                  value={formData.shopTagline}
                  onChange={(e) => setFormData({ ...formData, shopTagline: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>ข้อมูล LINE สำหรับติดต่อลูกค้า</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">
                      LINE ID ร้านค้า
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น @koijapanshop"
                      value={formData.lineId}
                      onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-xs">
                      ลิงก์เปิดแชท LINE (URL)
                    </label>
                    <input
                      type="text"
                      placeholder="https://line.me/R/ti/p/@koijapanshop"
                      value={formData.lineUrl}
                      onChange={(e) => setFormData({ ...formData, lineUrl: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-emerald-700">
                  💡 ลิงก์นี้จะถูกนำไปใช้ในปุ่ม "ติดต่อร้านค้าทาง LINE" บนหน้าต่างลูกค้า และในใบแจ้งยอดสลิปอัตโนมัติ
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-xs">
                    Facebook Page
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น KOI Japan Shop"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-xs">
                    Instagram
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น @koijapan.shop"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-xs">
                  ที่อยู่ร้านค้า / จุดรับพัสดุ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>

            </div>
          )}

          {/* TAB 2: PAYMENT & BANK INFO */}
          {activeTab === 'payment' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>บัญชีธนาคารสำหรับรับโอนเงินค่าสินค้า & ค่าน้ำหนัก</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-xs">
                      ชื่อธนาคาร
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น กสิกรไทย (KBANK), ไทยพาณิชย์ (SCB)"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-xs">
                      เลขที่บัญชี
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น 123-4-56789-0"
                      value={formData.bankAccountNo}
                      onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-xs">
                      ชื่อบัญชี
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น KOI Japan Shop / บจก. เจแปน พรีออเดอร์"
                      value={formData.bankAccountName}
                      onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-xs">
                      พร้อมเพย์ (PromptPay)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น 081-234-5678"
                      value={formData.promptpay}
                      onChange={(e) => setFormData({ ...formData, promptpay: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-blue-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-blue-700">
                  💡 ข้อมูลบัญชีนี้จะถูกนำไปแสดงในใบแจ้งยอด / สลิปค่าน้ำหนัก ให้ลูกค้าโอนเงินได้สะดวก
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: ADMIN PIN & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>ความปลอดภัย & รหัสผ่านเข้าหลังบ้าน (Admin PIN)</span>
                </div>

                <p className="text-xs text-gray-600">
                  รหัส PIN นี้ใช้สำหรับยืนยันตัวตนเมื่อสลับจากหน้าลูกค้าเข้าสู่ระบบจัดการหลังบ้าน ป้องกันไม่ให้บุคคลภายนอกแก้ไขข้อมูล
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-xs">
                      รหัส PIN ใหม่ (ตัวเลขหรือตัวอักษร)
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="กรอกรหัส PIN ใหม่ (เช่น 1234)"
                        value={newPin}
                        onChange={(e) => {
                          setNewPin(e.target.value);
                          setPinError('');
                        }}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1 text-xs">
                      ยืนยันรหัส PIN อีกครั้ง
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="ยืนยันรหัส PIN"
                        value={confirmPin}
                        onChange={(e) => {
                          setConfirmPin(e.target.value);
                          setPinError('');
                        }}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>
                  </div>
                </div>

                {pinError && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{pinError}</span>
                  </p>
                )}

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
                    <input
                      type="checkbox"
                      checked={formData.requirePin}
                      onChange={(e) => setFormData({ ...formData, requirePin: e.target.checked })}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span>เปิดใช้งานระบบถามรหัส PIN เมื่อสลับจากหน้าลูกค้าเข้าหลังบ้าน</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold text-xs"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
