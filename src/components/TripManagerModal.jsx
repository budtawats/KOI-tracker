import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Calendar, 
  Plane, 
  Ship, 
  Edit3, 
  Trash2, 
  Check, 
  Clock, 
  Scale, 
  Package,
  Layers
} from 'lucide-react';
import { formatWeight, formatThaiDate, getDaysLeftText } from '../utils/formatters';
import { SHIPPING_CHANNELS } from '../types/data';

export default function TripManagerModal({
  isOpen,
  onClose,
  trips,
  orders,
  onSaveTrip,
  onDeleteTrip
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    returnDate: '',
    channel: 'air_express',
    defaultRate: 250,
    status: 'open',
    note: ''
  });

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setFormData({
      name: '',
      returnDate: new Date().toISOString().split('T')[0],
      channel: 'air_express',
      defaultRate: 250,
      status: 'open',
      note: ''
    });
    setEditingTripId(null);
    setIsAddingNew(true);
  };

  const handleStartEdit = (trip) => {
    setFormData({
      name: trip.name,
      returnDate: trip.returnDate,
      channel: trip.channel || 'air_express',
      defaultRate: trip.defaultRate || 250,
      status: trip.status || 'open',
      note: trip.note || ''
    });
    setEditingTripId(trip.id);
    setIsAddingNew(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.returnDate) {
      alert('กรุณาระบุชื่อรอบและวันที่เดินทางกลับ');
      return;
    }

    const tripData = {
      id: editingTripId || `trip-${Date.now()}`,
      ...formData,
      defaultRate: parseFloat(formData.defaultRate) || 250
    };

    onSaveTrip(tripData);
    setIsAddingNew(false);
    setEditingTripId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">จัดการรอบวันกลับ (Return Trips)</h3>
              <p className="text-xs text-blue-100">
                กำหนดรอบบิน/รอบเรือ และเรทค่าน้ำหนักมาตรฐาน
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Add New Trip Form */}
          {isAddingNew ? (
            <form onSubmit={handleSubmit} className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 space-y-4 animate-fadeIn text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-blue-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{editingTripId ? 'แก้ไขรอบวันกลับ' : 'สร้างรอบวันกลับใหม่'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-gray-500 hover:text-gray-700 font-semibold"
                >
                  ✕ ยกเลิก
                </button>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  ชื่อรอบการเดินทาง <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น รอบบิน 15 ต.ค. 2026 (บินด่วน ✈️)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    วันที่เดินทางกลับถึงไทย <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    ช่องทางการขนส่ง
                  </label>
                  <select
                    value={formData.channel}
                    onChange={(e) => {
                      const ch = SHIPPING_CHANNELS.find(c => c.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        channel: e.target.value,
                        defaultRate: ch ? ch.defaultRate : formData.defaultRate
                      });
                    }}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    {SHIPPING_CHANNELS.map(ch => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.rateNote})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    เรทค่าน้ำหนักเริ่มต้น (บาท/กก.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.defaultRate}
                    onChange={(e) => setFormData({ ...formData, defaultRate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    หมายเหตุ / รายละเอียดรอบ
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ปิดรับออเดอร์ 12 ต.ค."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  {editingTripId ? 'บันทึกการแก้ไข' : 'เพิ่มรอบนี้'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                รอบการเดินทางทั้งหมด ({trips.length} รอบ)
              </span>
              <button
                onClick={handleStartAdd}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มรอบวันกลับใหม่</span>
              </button>
            </div>
          )}

          {/* List of Trips */}
          <div className="space-y-3">
            {trips.map((trip) => {
              const tripOrders = orders.filter(o => o.tripId === trip.id);
              const tripWeight = tripOrders.reduce((sum, o) => sum + (parseFloat(o.weightKg) || 0), 0);
              const tripPieces = tripOrders.reduce((sum, o) => sum + (parseInt(o.quantity) || 0), 0);
              const daysLeft = getDaysLeftText(trip.returnDate);

              return (
                <div
                  key={trip.id}
                  className="p-4 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        {trip.channel === 'sea_cargo' ? <Ship className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base">{trip.name}</h4>
                        <p className="text-xs text-gray-500">
                          เดินทางกลับ: <strong className="text-gray-800">{formatThaiDate(trip.returnDate)}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {daysLeft && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          daysLeft.type === 'today' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {daysLeft.text}
                        </span>
                      )}

                      <button
                        onClick={() => handleStartEdit(trip)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="แก้ไขรอบ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (tripOrders.length > 0) {
                            alert(`ไม่สามารถลบรอบนี้ได้เนื่องจากมีสินค้า ${tripOrders.length} รายการผูกอยู่ กรุณาย้ายสินค้าไปรอบอื่นก่อน`);
                            return;
                          }
                          if (confirm(`คุณต้องการลบ "${trip.name}" ใช่หรือไม่?`)) {
                            onDeleteTrip(trip.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบรอบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Trip Stats Pill Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-xl text-xs text-center border border-gray-100">
                    <div>
                      <span className="text-gray-500 text-[11px]">จำนวนสินค้า</span>
                      <p className="font-bold text-gray-900">{tripOrders.length} ออเดอร์ ({tripPieces} ชิ้น)</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[11px]">น้ำหนักสินค้ารวม</span>
                      <p className="font-bold text-blue-700">{formatWeight(tripWeight)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-[11px]">เรทเริ่มต้น</span>
                      <p className="font-bold text-amber-600">{trip.defaultRate} ฿/กก.</p>
                    </div>
                  </div>

                  {trip.note && (
                    <p className="text-[11px] text-gray-500 bg-blue-50/50 px-3 py-1.5 rounded-lg">
                      💡 {trip.note}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
}
