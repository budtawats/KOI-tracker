import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Scale, 
  Coins, 
  Calendar, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  Sparkles, 
  Check, 
  PlusCircle,
  Truck,
  DollarSign
} from 'lucide-react';
import { CATEGORIES, ORDER_STATUSES } from '../types/data';
import { generateTrackingCode, calculateWeightCost } from '../utils/formatters';

export default function OrderModal({
  isOpen,
  onClose,
  onSave,
  orderToEdit,
  trips,
  onOpenTripManager
}) {
  const [formData, setFormData] = useState({
    id: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    productName: '',
    categoryId: 'snacks',
    quantity: 1,
    weightKg: 0.5,
    weightRate: 250,
    tripId: trips[0]?.id || '',
    status: 'ordered',
    itemPriceThb: '',
    depositPaid: '',
    localShippingFee: 50,
    otherFee: 0,
    localTrackingNo: '',
    localCarrier: 'Flash Express',
    imageUrl: '',
    notes: ''
  });

  const [weightUnit, setWeightUnit] = useState('kg'); // 'kg' or 'g'
  const [weightInputValue, setWeightInputValue] = useState(0.5);

  // Initialize or reset form when modal opens
  useEffect(() => {
    if (orderToEdit) {
      setFormData({
        ...orderToEdit,
        itemPriceThb: orderToEdit.itemPriceThb || '',
        depositPaid: orderToEdit.depositPaid || '',
        localShippingFee: orderToEdit.localShippingFee !== undefined ? orderToEdit.localShippingFee : 50
      });
      setWeightInputValue(orderToEdit.weightKg || 0);
      setWeightUnit('kg');
    } else {
      // New Order
      const newId = generateTrackingCode();
      const defaultCat = CATEGORIES[0];
      const defaultTrip = trips[0]?.id || '';
      const defaultRate = trips[0]?.defaultRate || defaultCat.defaultRate || 250;

      setFormData({
        id: newId,
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        productName: '',
        categoryId: defaultCat.id,
        quantity: 1,
        weightKg: 0.5,
        weightRate: defaultRate,
        tripId: defaultTrip,
        status: 'ordered',
        itemPriceThb: '',
        depositPaid: '',
        localShippingFee: 50,
        otherFee: 0,
        localTrackingNo: '',
        localCarrier: 'Flash Express',
        imageUrl: '',
        notes: ''
      });
      setWeightInputValue(0.5);
      setWeightUnit('kg');
    }
  }, [orderToEdit, isOpen, trips]);

  if (!isOpen) return null;

  // Handle Weight Input & Unit switch
  const handleWeightChange = (val, unit) => {
    setWeightInputValue(val);
    const num = parseFloat(val) || 0;
    const kg = unit === 'g' ? num / 1000 : num;
    setFormData(prev => ({ ...prev, weightKg: kg }));
  };

  const handleUnitToggle = (unit) => {
    setWeightUnit(unit);
    if (unit === 'g') {
      setWeightInputValue(Math.round((formData.weightKg || 0) * 1000));
    } else {
      setWeightInputValue(formData.weightKg || 0);
    }
  };

  // Handle category change (auto update default rate if not custom)
  const handleCategoryChange = (catId) => {
    const cat = CATEGORIES.find(c => c.id === catId);
    setFormData(prev => ({
      ...prev,
      categoryId: catId,
      weightRate: cat ? cat.defaultRate : prev.weightRate
    }));
  };

  // Handle trip change
  const handleTripChange = (tripId) => {
    const trip = trips.find(t => t.id === tripId);
    setFormData(prev => ({
      ...prev,
      tripId,
      weightRate: trip ? trip.defaultRate : prev.weightRate
    }));
  };

  // Real-time calculated weight cost
  const calculatedWeightCost = calculateWeightCost(formData.weightKg, formData.weightRate);

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      alert('กรุณากรอกชื่อลูกค้า');
      return;
    }
    if (!formData.productName.trim()) {
      alert('กรุณากรอกชื่อสินค้า');
      return;
    }

    const payload = {
      ...formData,
      quantity: parseInt(formData.quantity) || 1,
      weightKg: parseFloat(formData.weightKg) || 0,
      weightRate: parseFloat(formData.weightRate) || 0,
      itemPriceThb: parseFloat(formData.itemPriceThb) || 0,
      depositPaid: parseFloat(formData.depositPaid) || 0,
      localShippingFee: parseFloat(formData.localShippingFee) || 0,
      otherFee: parseFloat(formData.otherFee) || 0,
      updatedAt: new Date().toISOString()
    };

    if (!orderToEdit) {
      payload.createdAt = new Date().toISOString();
      payload.statusLogs = [
        {
          status: payload.status,
          timestamp: new Date().toISOString(),
          note: 'สร้างรายการพัสดุใหม่ในระบบ'
        }
      ];
    }

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {orderToEdit ? 'แก้ไขรายการพัสดุ' : 'เพิ่มรายการพัสดุใหม่'}
              </h3>
              <p className="text-xs text-red-100 font-mono">
                รหัสติดตาม: {formData.id}
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

        {/* Modal Body: Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* SECTION 1: Customer Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>ข้อมูลลูกค้า (Customer Info)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  ชื่อลูกค้า <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คุณธนภัทร สุขสมบูรณ์"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  placeholder="เช่น 081-234-5678"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                ที่อยู่จัดส่งในไทย (ถ้ามี)
              </label>
              <textarea
                rows={2}
                placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                value={formData.customerAddress}
                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 2: Product & Category Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
              <Package className="w-4 h-4" />
              <span>รายละเอียดสินค้า (Product Details)</span>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                ชื่อสินค้า <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น ขนมโตเกียวบานาน่า, ฟิกเกอร์กันดั้ม, ครีมกันแดด Anessa"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>

            {/* Category Selection Pills */}
            <div>
              <label className="block text-gray-700 font-medium mb-1.5">
                ประเภทสินค้า <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = formData.categoryId === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-red-50 border-red-400 ring-2 ring-red-400/20 text-red-700 font-bold shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                      }`}
                    >
                      <span className="text-xs truncate">{cat.name}</span>
                      <span className="text-[10px] text-gray-400 font-normal">เรท ~{cat.defaultRate}฿</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity (ชิ้น) */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                จำนวน (ชิ้น) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-32 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-center focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
                <div className="flex gap-1.5">
                  {[1, 2, 3, 5, 10].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setFormData({ ...formData, quantity: qty })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        formData.quantity === qty 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 3: Weight & Weight Price Calculation */}
          <div className="space-y-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Scale className="w-4 h-4 text-amber-700" />
                <span>จำนวนน้ำหนัก & การคำนวณค่าน้ำหนัก</span>
              </div>

              {/* Unit Toggle: kg vs g */}
              <div className="flex bg-white rounded-lg p-0.5 border border-amber-300 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('kg')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    weightUnit === 'kg' ? 'bg-amber-600 text-white' : 'text-gray-600'
                  }`}
                >
                  กก. (kg)
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('g')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    weightUnit === 'g' ? 'bg-amber-600 text-white' : 'text-gray-600'
                  }`}
                >
                  กรัม (g)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Weight Input */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-xs">
                  น้ำหนัก ({weightUnit === 'kg' ? 'กิโลกรัม' : 'กรัม'}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step={weightUnit === 'kg' ? '0.01' : '10'}
                  min="0"
                  required
                  value={weightInputValue}
                  onChange={(e) => handleWeightChange(e.target.value, weightUnit)}
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-base font-black text-blue-700 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  = <strong>{formData.weightKg.toFixed(2)} กก.</strong> ({Math.round(formData.weightKg * 1000)} กรัม)
                </p>
              </div>

              {/* Rate per kg */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-xs">
                  เรทค่าน้ำหนัก (บาท/กก.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.weightRate}
                  onChange={(e) => setFormData({ ...formData, weightRate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-base font-bold text-gray-800 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
                />
                <div className="flex gap-1 mt-1.5">
                  {[150, 200, 250, 280, 300].map(rate => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setFormData({ ...formData, weightRate: rate })}
                      className="px-2 py-0.5 bg-white border border-amber-300 rounded text-[10px] font-semibold text-gray-700 hover:bg-amber-100"
                    >
                      {rate}฿
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Weight Summary Box */}
            <div className="bg-white p-3.5 rounded-xl border border-amber-300/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">สูตรคำนวณค่าน้ำหนัก:</span>
                <p className="text-xs text-gray-700 font-medium">
                  {formData.weightKg.toFixed(2)} กก. × {formData.weightRate} ฿/กก.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 font-semibold">ราคาค่าน้ำหนักสุทธิ</span>
                <p className="text-xl font-black text-amber-600">
                  {calculatedWeightCost.toLocaleString('th-TH')} ฿
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 4: Return Trip (รอบวันกลับ) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>รอบวันกลับ (Return Trip)</span>
              </div>
              <button
                type="button"
                onClick={onOpenTripManager}
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>จัดการรอบ</span>
              </button>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                เลือกรอบวันกลับ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tripId}
                onChange={(e) => handleTripChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                {trips.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} (กลับ: {t.returnDate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* SECTION 5: Status & Tracking */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              <span>สถานะ & การจัดส่งในไทย</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  สถานะสินค้า
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  {ORDER_STATUSES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  เลขพัสดุในไทย (Flash/Kerry/EMS)
                </label>
                <input
                  type="text"
                  placeholder="เช่น TH0123456789 หรือ ED123456789TH"
                  value={formData.localTrackingNo}
                  onChange={(e) => setFormData({ ...formData, localTrackingNo: e.target.value })}
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Optional Additional Financials */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <label className="block text-gray-500 font-medium mb-1 text-[11px]">
                  ราคาสินค้า (บาท)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.itemPriceThb}
                  onChange={(e) => setFormData({ ...formData, itemPriceThb: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-1 text-[11px]">
                  มัดจำแล้ว (บาท)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.depositPaid}
                  onChange={(e) => setFormData({ ...formData, depositPaid: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-gray-500 font-medium mb-1 text-[11px]">
                  ค่าส่งในไทย (บาท)
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={formData.localShippingFee}
                  onChange={(e) => setFormData({ ...formData, localShippingFee: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Image URL & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-xs">
                  ลิงก์รูปสินค้า (URL หรือปล่อยว่าง)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-xs">
                  บันทึกเพิ่มเติม
                </label>
                <input
                  type="text"
                  placeholder="เช่น ระวังแตก, กล่องคม"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium text-xs transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {orderToEdit ? 'บันทึกการแก้ไข' : 'บันทึกรายการสินค้า'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
