import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Scale, 
  Coins, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Phone, 
  MapPin, 
  Plane, 
  Warehouse, 
  Receipt, 
  Truck, 
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Share2
} from 'lucide-react';
import { ORDER_STATUSES, CATEGORIES } from '../types/data';
import { 
  formatCurrency, 
  formatWeight, 
  formatThaiDate, 
  calculateWeightCost, 
  calculateOrderTotal, 
  getDaysLeftText 
} from '../utils/formatters';

export default function CustomerTrackingView({ orders, trips, initialTrackCode = '', settings = {} }) {
  const [searchCode, setSearchCode] = useState(initialTrackCode);
  const [searched, setSearched] = useState(!!initialTrackCode);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const shopName = settings.shopName || 'KOI Japan Shop';
  const lineUrl = settings.lineUrl || 'https://line.me';
  const lineId = settings.lineId || '@koijapanshop';
  const phone = settings.phone || '081-234-5678';

  // Sync with initial track code from URL if provided
  useEffect(() => {
    if (initialTrackCode) {
      setSearchCode(initialTrackCode);
      setSearched(true);
    }
  }, [initialTrackCode]);

  // Filter orders matching search
  const foundOrders = orders.filter(order => {
    if (!searchCode.trim()) return false;
    const q = searchCode.toLowerCase().trim();
    return (
      order.id.toLowerCase().includes(q) ||
      order.customerPhone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) ||
      order.customerName.toLowerCase().includes(q) ||
      (order.localTrackingNo && order.localTrackingNo.toLowerCase().includes(q))
    );
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCode.trim()) {
      setSearched(true);
      // Update URL query string without reloading page
      const newUrl = `${window.location.pathname}?mode=customer&track=${encodeURIComponent(searchCode.trim())}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleShareLink = (orderId) => {
    const trackingUrl = `${window.location.origin}${window.location.pathname}?mode=customer&track=${encodeURIComponent(orderId)}`;
    navigator.clipboard.writeText(trackingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getTripInfo = (tripId) => {
    return trips.find(t => t.id === tripId) || { name: 'รอบมาตรฐาน', returnDate: '-' };
  };

  const getCategoryInfo = (catId) => {
    return CATEGORIES.find(c => c.id === catId) || { name: catId, badgeBg: 'bg-gray-100' };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Customer Hero Banner */}
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-red-500/20 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-amber-500/20 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>หน้าต่างเช็คพัสดุสำหรับลูกค้า (Customer Portal)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            ติดตามสถานะสินค้าจากญี่ปุ่น
          </h2>
          
          <p className="text-xs sm:text-sm text-red-100">
            ตรวจสอบความคืบหน้า น้ำหนักจริง ค่าน้ำหนัก และวันเดินทางกลับถึงไทย
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-white p-1.5 sm:p-2 rounded-2xl shadow-2xl">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="กรอกรหัสพัสดุ (เช่น KOI-JP26-1082) หรือเบอร์โทรศัพท์..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 shrink-0"
              >
                ตรวจสอบสถานะ
              </button>
            </div>
          </form>

          {/* Quick Demo Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-red-100 pt-2">
            <span className="opacity-80 text-[11px]">ตัวอย่างรหัสพัสดุ:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchCode(o.id);
                  setSearched(true);
                  const newUrl = `${window.location.pathname}?mode=customer&track=${encodeURIComponent(o.id)}`;
                  window.history.pushState({ path: newUrl }, '', newUrl);
                }}
                className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg font-mono text-[11px] transition-colors border border-white/20"
              >
                {o.id}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Tracking Results Area */}
      {searched && (
        <div className="space-y-6 animate-fadeIn">
          {foundOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200 shadow-soft">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">ไม่พบข้อมูลพัสดุจากคำค้นหานี้</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                กรุณาตรวจสอบรหัสพัสดุหรือเบอร์โทรศัพท์ที่ใช้สั่งซื้ออีกครั้ง หรือสอบถามแอดมินทาง LINE ได้เลยครับ
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setSearchCode('')}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  ลองค้นหาใหม่
                </button>
              </div>
            </div>
          ) : (
            foundOrders.map((order) => {
              const trip = getTripInfo(order.tripId);
              const cat = getCategoryInfo(order.categoryId);
              const weightCost = calculateWeightCost(order.weightKg, order.weightRate);
              const totalCalc = calculateOrderTotal(order);
              const daysLeft = getDaysLeftText(trip.returnDate);

              const currentStatusObj = ORDER_STATUSES.find(s => s.id === order.status) || ORDER_STATUSES[0];
              const currentStep = currentStatusObj.step;

              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-200 shadow-card overflow-hidden"
                >
                  {/* Result Header */}
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-red-50/30 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm sm:text-base font-black text-red-600 bg-red-100/80 px-3 py-1 rounded-xl border border-red-200">
                          {order.id}
                        </span>
                        <button
                          onClick={() => handleShareLink(order.id)}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200 flex items-center gap-1 transition-colors"
                          title="คัดลอกลิงก์ติดตามสำหรับบันทึกไว้"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-gray-500" />}
                          <span>{copiedLink ? 'คัดลอกลิงก์แล้ว!' : 'แชร์ลิงก์นี้'}</span>
                        </button>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-2">
                        ผู้รับ: {order.customerName}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{order.customerPhone}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right bg-white p-3.5 rounded-2xl border border-gray-200 shadow-sm">
                      <span className="text-[11px] text-gray-500 uppercase font-semibold">รอบวันกลับถึงไทย</span>
                      <p className="text-xs sm:text-sm font-bold text-blue-700 mt-0.5">{trip.name}</p>
                      {daysLeft && (
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          daysLeft.type === 'today' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {daysLeft.text}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 5-Step Timeline Tracker */}
                  <div className="p-6 sm:p-8 bg-white border-b border-gray-100">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                      สถานะความคืบหน้า (Tracking Timeline)
                    </h4>

                    {/* Desktop Step Bar */}
                    <div className="hidden sm:grid grid-cols-5 gap-2 relative">
                      <div className="absolute top-5 left-8 right-8 h-1 bg-gray-200 -z-0">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-700"
                          style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                        ></div>
                      </div>

                      {ORDER_STATUSES.map((st) => {
                        const isDone = st.step <= currentStep;
                        const isCurrent = st.step === currentStep;

                        return (
                          <div key={st.id} className="relative z-10 flex flex-col items-center text-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-md ${
                              isCurrent
                                ? 'bg-red-600 text-white ring-4 ring-red-100 scale-110'
                                : isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                            }`}>
                              {isDone ? <Check className="w-5 h-5" /> : st.step}
                            </div>
                            <span className={`mt-3 text-xs font-bold ${
                              isCurrent ? 'text-red-600 font-extrabold' : isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {st.labelShort}
                            </span>
                            <span className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 max-w-[120px]">
                              {st.description}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile Timeline Steps */}
                    <div className="sm:hidden space-y-4">
                      {ORDER_STATUSES.map((st) => {
                        const isDone = st.step <= currentStep;
                        const isCurrent = st.step === currentStep;

                        return (
                          <div key={st.id} className="flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isCurrent
                                ? 'bg-red-600 text-white ring-2 ring-red-200'
                                : isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-400'
                            }`}>
                              {isDone ? <Check className="w-4 h-4" /> : st.step}
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isCurrent ? 'text-red-600' : isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                                {st.label}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                {st.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Local Tracking Number Banner if Delivered */}
                    {order.localTrackingNo && (
                      <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                              จัดส่งในไทยโดย: {order.localCarrier || 'ขนส่งเอกชน'}
                            </span>
                            <div className="font-mono text-base font-black text-gray-900 tracking-wider">
                              {order.localTrackingNo}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCopy(order.localTrackingNo)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                        >
                          {copiedTracking ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedTracking ? 'คัดลอกแล้ว!' : 'คัดลอกเลขพัสดุ'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Product & Weight Calculation Card */}
                  <div className="p-6 sm:p-8 bg-gray-50/50 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        รายการสินค้าที่พรีออเดอร์
                      </h4>
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-3">
                          {order.imageUrl ? (
                            <img
                              src={order.imageUrl}
                              alt=""
                              className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold">
                              <Package className="w-8 h-8" />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-gray-900 text-sm sm:text-base">
                              {order.productName}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${cat.badgeBg}`}>
                                {cat.name}
                              </span>
                              <span className="text-xs text-gray-600 font-medium">
                                จำนวน: <strong>{order.quantity} ชิ้น</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 max-w-xs">
                            <span className="font-semibold text-gray-700">โน้ต: </span>{order.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Weight & Cost Summary Table */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <span className="text-xs text-gray-500 font-medium">น้ำหนักสินค้าชั่งจริง</span>
                        <p className="text-xl font-black text-blue-700 mt-1">
                          {formatWeight(order.weightKg)}
                        </p>
                        <span className="text-[11px] text-gray-400">
                          {Math.round(order.weightKg * 1000)} กรัม
                        </span>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-gray-200">
                        <span className="text-xs text-gray-500 font-medium">เรทค่าน้ำหนัก</span>
                        <p className="text-xl font-black text-gray-800 mt-1">
                          {order.weightRate} ฿<span className="text-xs text-gray-400 font-normal"> / กก.</span>
                        </p>
                        <span className="text-[11px] text-gray-400">
                          ตามประเภทสินค้าและรอบขนส่ง
                        </span>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                        <span className="text-xs text-amber-800 font-medium">ราคาค่าน้ำหนัก</span>
                        <p className="text-xl font-black text-amber-600 mt-1">
                          {formatCurrency(weightCost)}
                        </p>
                        <span className="text-[11px] text-amber-700">
                          (น้ำหนัก × เรทค่าน้ำหนัก)
                        </span>
                      </div>
                    </div>

                    {/* Grand Total Summary Box if balance exists */}
                    {(totalCalc.itemPrice > 0 || totalCalc.localShipping > 0) && (
                      <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-2 text-xs">
                        <div className="flex justify-between text-gray-600">
                          <span>ราคาสินค้า:</span>
                          <span>{formatCurrency(totalCalc.itemPrice)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>ค่าน้ำหนัก:</span>
                          <span>{formatCurrency(totalCalc.weightCost)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>ค่าส่งในไทย:</span>
                          <span>{formatCurrency(totalCalc.localShipping)}</span>
                        </div>
                        {totalCalc.depositPaid > 0 && (
                          <div className="flex justify-between text-emerald-600 font-semibold">
                            <span>มัดจำแล้ว:</span>
                            <span>-{formatCurrency(totalCalc.depositPaid)}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-bold">
                          <span className="text-gray-900">ยอดที่ต้องชำระคงเหลือ:</span>
                          <span className="text-red-600 text-base font-black">
                            {formatCurrency(totalCalc.remainingDue)}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Card Bottom Help Footer */}
                  <div className="p-4 bg-gray-100/80 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{shopName}</span>
                      <span>• ยินดีให้บริการพรีออเดอร์และดูแลสินค้าของคุณ (โทร: {phone})</span>
                    </div>

                    <a
                      href={lineUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-4 py-1.5 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>สอบถามทาง LINE</span>
                    </a>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Intro info box if not searched yet */}
      {!searched && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-soft text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">คิดค่าน้ำหนักตามจริง</h4>
            <p className="text-xs text-gray-500">
              ชั่งน้ำหนักสินค้าจริงเมื่อถึงไทย พร้อมแสดงสูตรคำนวณราคาค่าน้ำหนักโปร่งใส
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-soft text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">รอบวันกลับชัดเจน</h4>
            <p className="text-xs text-gray-500">
              มีตารางรอบบินตรงและรอบเรือให้เลือก แจ้งวันกลับถึงไทยแม่นยำ
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-soft text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">จัดส่งรวดเร็วถึงบ้าน</h4>
            <p className="text-xs text-gray-500">
              แพ็คสินค้ากันกระแทกอย่างดี พร้อมอัปเดตเลขพัสดุ Flash / Kerry / EMS ให้ทันที
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
