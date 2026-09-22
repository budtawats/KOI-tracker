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
  Share2,
  Barcode,
  HelpCircle,
  FileText,
  Calculator,
  ArrowRight,
  Info,
  ShieldCheck,
  Send
} from 'lucide-react';
import { ORDER_STATUSES, CATEGORIES, SHIPPING_CHANNELS } from '../types/data';
import { 
  formatCurrency, 
  formatWeight, 
  formatThaiDate, 
  calculateWeightCost, 
  calculateOrderTotal, 
  getDaysLeftText 
} from '../utils/formatters';

export default function CustomerTrackingView({ orders = [], trips = [], initialTrackCode = '', settings = {} }) {
  const [searchCode, setSearchCode] = useState(initialTrackCode);
  const [searched, setSearched] = useState(!!initialTrackCode);
  const [copiedTracking, setCopiedTracking] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick Calculator inside Customer View
  const [calcWeight, setCalcWeight] = useState('');
  const [calcRate, setCalcRate] = useState(250);
  const [calcResult, setCalcResult] = useState(null);

  const shopName = settings.shopName || 'KOI Japan Shop';
  const lineUrl = settings.lineUrl || 'https://line.me';
  const lineId = settings.lineId || '@koijapanshop';
  const phone = settings.phone || '081-234-5678';

  // Sync with initial track code from URL
  useEffect(() => {
    if (initialTrackCode) {
      setSearchCode(initialTrackCode);
      setSearched(true);
    }
  }, [initialTrackCode]);

  // Handle Calculator
  const handleCalculate = (e) => {
    e.preventDefault();
    const w = parseFloat(calcWeight) || 0;
    const r = parseFloat(calcRate) || 250;
    setCalcResult({
      weight: w,
      rate: r,
      total: w * r
    });
  };

  // Filter orders matching search
  const safeOrders = Array.isArray(orders) ? orders : [];
  const foundOrders = safeOrders.filter(order => {
    if (!searchCode.trim()) return false;
    const q = searchCode.toLowerCase().trim();
    return (
      (order.id && order.id.toLowerCase().includes(q)) ||
      (order.customerPhone && order.customerPhone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''))) ||
      (order.customerName && order.customerName.toLowerCase().includes(q)) ||
      (order.localTrackingNo && order.localTrackingNo.toLowerCase().includes(q))
    );
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setSearched(true);
    const newUrl = `${window.location.pathname}?mode=customer&track=${encodeURIComponent(searchCode.trim())}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleShareLink = (orderId) => {
    const url = `${window.location.origin}${window.location.pathname}?mode=customer&track=${encodeURIComponent(orderId)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTrackingNo = (trackNo) => {
    navigator.clipboard.writeText(trackNo);
    setCopiedTracking(trackNo);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  const getTripInfo = (tripId) => {
    const safeTrips = Array.isArray(trips) ? trips : [];
    return safeTrips.find(t => t.id === tripId) || { name: 'รอบจัดส่งมาตรฐาน', returnDate: '2026-03-15' };
  };

  const getCategoryInfo = (catId) => {
    return CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
  };

  // Generate realistic postal tracking logs
  const getTrackingLogs = (order) => {
    const trip = getTripInfo(order.tripId);
    const currentStatusObj = ORDER_STATUSES.find(s => s.id === order.status) || ORDER_STATUSES[0];
    const currentStep = currentStatusObj.step;

    if (Array.isArray(order.statusLogs) && order.statusLogs.length > 0) {
      return order.statusLogs.map((log, index) => {
        const matched = ORDER_STATUSES.find(s => s.id === log.status);
        return {
          id: index,
          date: log.timestamp ? formatThaiDate(log.timestamp) : formatThaiDate(order.createdAt),
          time: log.timestamp ? new Date(log.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '10:00',
          location: matched?.location || 'ศูนย์บริการไปรษณีย์',
          status: matched?.label || log.status,
          statusTag: matched?.statusTag || 'สถานะปกติ',
          description: log.note || matched?.description || '',
          isDone: true
        };
      });
    }

    // Default generated realistic postal timeline logs
    const mockLogs = [];
    ORDER_STATUSES.forEach((st) => {
      if (st.step <= currentStep) {
        mockLogs.push({
          id: st.id,
          date: formatThaiDate(order.createdAt || new Date()),
          time: st.step === 1 ? '09:30 น.' : st.step === 2 ? '14:15 น.' : st.step === 3 ? '11:00 น.' : st.step === 4 ? '15:45 น.' : '16:30 น.',
          location: st.location,
          status: st.label,
          statusTag: st.statusTag,
          description: st.step === 5 && order.localTrackingNo 
            ? `ส่งมอบให้บริษัท ${order.localCarrier || 'ขนส่ง'} เรียบร้อย (เลขติดตาม: ${order.localTrackingNo})`
            : st.description,
          isDone: true
        });
      }
    });

    return mockLogs.reverse(); // Newest on top
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      
      {/* =========================================================
          SECTION 1: THAILAND POST STYLE SEARCH HERO
          ========================================================= */}
      <div className="bg-white rounded-3xl border-2 border-red-100 shadow-xl overflow-hidden">
        
        {/* Postal Hero Red Header Banner */}
        <div className="bg-gradient-to-r from-[#ED1C24] via-[#D4141E] to-[#B80D16] text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full pointer-events-none blur-2xl"></div>
          <div className="absolute right-12 bottom-4 opacity-10 pointer-events-none hidden sm:block">
            <Send className="w-32 h-32 text-white -rotate-12" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/30">
              <Send className="w-3.5 h-3.5" />
              <span>THAILAND POST STYLE • TRACK & TRACE PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-sans">
              ติดตามสถานะสิ่งของ
            </h1>
            <p className="text-red-100 text-xs sm:text-sm mt-1.5 leading-relaxed font-light">
              ตรวจสอบสถานะพัสดุนำเข้าจากญี่ปุ่น ชั่งน้ำหนักจริง ตรวจสอบยอดค่าใช้จ่าย และติดตามการนำจ่ายพัสดุถึงปลายทาง
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-red-50/40 to-white">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <label className="block text-xs sm:text-sm font-bold text-gray-800">
              กรอกหมายเลขสิ่งของ / รหัสพัสดุ (Barcode No.) หรือ เบอร์โทรศัพท์ผู้รับ:
            </label>
            
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-5 h-5 text-[#ED1C24]" />
                </div>
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="เช่น KOI-2026-001 หรือ 0812345678"
                  className="w-full pl-11 pr-10 py-3.5 sm:py-4 bg-white border-2 border-gray-300 focus:border-[#ED1C24] rounded-2xl text-sm sm:text-base font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all shadow-inner"
                />
                {searchCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchCode('');
                      setSearched(false);
                    }}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#ED1C24] to-[#C81018] hover:from-[#D4141E] hover:to-[#A80B13] text-white font-bold rounded-2xl text-sm sm:text-base transition-all shadow-lg shadow-red-600/30 active:scale-[0.98] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Search className="w-5 h-5" />
                <span>ค้นหา / ติดตามสิ่งของ</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Chips */}
          <div className="mt-4 pt-4 border-t border-gray-200/80 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span className="font-semibold text-gray-500 text-[11px]">💡 ตัวอย่างหมายเลขสิ่งของ:</span>
            {safeOrders.slice(0, 4).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchCode(o.id);
                  setSearched(true);
                  const newUrl = `${window.location.pathname}?mode=customer&track=${encodeURIComponent(o.id)}`;
                  window.history.pushState({ path: newUrl }, '', newUrl);
                }}
                className="px-2.5 py-1 bg-white hover:bg-red-50 text-[#ED1C24] hover:text-[#C81018] rounded-lg font-mono text-[11px] font-bold transition-colors border border-red-200 shadow-sm"
              >
                {o.id}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* =========================================================
          SECTION 2: TRACKING RESULTS (ไปรษณีย์ไทย TRACK & TRACE VIEW)
          ========================================================= */}
      {searched && (
        <div className="space-y-6 animate-fadeIn">
          {foundOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-red-100 shadow-md">
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#ED1C24] flex items-center justify-center mx-auto mb-4 border border-red-200 shadow-inner">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">ไม่พบข้อมูลหมายเลขสิ่งของนี้ในระบบ</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                กรุณาตรวจสอบหมายเลขพัสดุ (เช่น KOI-2026-001) หรือเบอร์โทรศัพท์ที่ใช้สั่งซื้ออีกครั้ง หรือติดต่อเจ้าหน้าที่ผ่านช่องทาง LINE ได้ตลอดเวลาครับ
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setSearchCode('')}
                  className="px-5 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  ลองค้นหาใหม่
                </button>
                <a
                  href={lineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#06C755] hover:bg-[#05b34c] rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>สอบถามทาง LINE</span>
                </a>
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
              const trackingLogs = getTrackingLogs(order);

              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg overflow-hidden"
                >
                  
                  {/* 1. Official Postal Barcode Card Header */}
                  <div className="p-6 bg-gradient-to-r from-slate-900 via-gray-900 to-red-950 text-white border-b-2 border-[#ED1C24] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-base sm:text-lg font-black text-white bg-[#ED1C24] px-3.5 py-1 rounded-xl shadow-md tracking-wider">
                          {order.id}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/10 text-red-200 text-xs font-semibold border border-white/20">
                          บริการ: Japan Air Express
                        </span>
                        <button
                          onClick={() => handleShareLink(order.id)}
                          className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-white/20"
                          title="คัดลอกลิงก์สำหรับเปิดดูหน้านี้"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-gray-300" />}
                          <span>{copiedLink ? 'คัดลอกลิงก์แล้ว!' : 'แชร์ลิงก์'}</span>
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-gray-300">
                        <span><strong>ผู้รับ:</strong> {order.customerName}</span>
                        <span><strong>โทร:</strong> {order.customerPhone}</span>
                        {trip?.name && <span><strong>รอบบิน:</strong> {trip.name}</span>}
                      </div>
                    </div>

                    {/* Current Status Badge */}
                    <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white text-gray-900 font-bold text-xs sm:text-sm shadow-md border-2 border-[#ED1C24]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ED1C24] animate-ping"></span>
                        <span className="text-[#ED1C24]">สถานะ:</span>
                        <span>{currentStatusObj.labelShort}</span>
                      </div>
                      {daysLeft && (
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          daysLeft.isPast ? 'text-gray-400 bg-gray-800' : 'text-emerald-400 bg-emerald-950/80 border border-emerald-500/30'
                        }`}>
                          {daysLeft.text}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2. Thailand Post 5-Step Visual Timeline */}
                  <div className="p-6 sm:p-8 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Send className="w-4 h-4 text-[#ED1C24]" />
                        <span>ขั้นตอนความคืบหน้าสิ่งของ (5 STAGES PROGRESS)</span>
                      </h4>
                      <span className="text-xs font-bold text-[#ED1C24] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                        ขั้นตอนที่ {currentStep} จาก 5
                      </span>
                    </div>

                    {/* Desktop Step Bar */}
                    <div className="hidden sm:grid grid-cols-5 gap-2 relative">
                      <div className="absolute top-5 left-8 right-8 h-1.5 bg-gray-200 -z-0 rounded-full">
                        <div 
                          className="h-full bg-[#ED1C24] transition-all duration-700 rounded-full"
                          style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                        ></div>
                      </div>

                      {ORDER_STATUSES.map((st) => {
                        const isDone = st.step <= currentStep;
                        const isCurrent = st.step === currentStep;

                        return (
                          <div key={st.id} className="relative z-10 flex flex-col items-center text-center">
                            <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black transition-all shadow-md ${
                              isCurrent
                                ? 'bg-[#ED1C24] text-white ring-4 ring-red-200 scale-110'
                                : isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-gray-400 border-2 border-gray-300'
                            }`}>
                              {isDone && !isCurrent ? <Check className="w-6 h-6" /> : st.step}
                            </div>
                            <span className={`mt-3 text-xs font-bold ${
                              isCurrent ? 'text-[#ED1C24] font-black' : isDone ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {st.labelShort}
                            </span>
                            <span className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 max-w-[120px]">
                              {st.location}
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
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-sm ${
                              isCurrent
                                ? 'bg-[#ED1C24] text-white ring-2 ring-red-200'
                                : isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-400 border border-gray-300'
                            }`}>
                              {isDone && !isCurrent ? <Check className="w-4 h-4" /> : st.step}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xs font-bold ${isCurrent ? 'text-[#ED1C24] font-black' : isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                                {st.label}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                📍 {st.location}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Local Tracking Number Banner if Dispatched */}
                    {order.localTrackingNo && (
                      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              หมายเลขพัสดุจัดส่งในไทย ({order.localCarrier || 'Flash Express'})
                            </span>
                            <p className="font-mono text-base font-black text-gray-900 mt-0.5 tracking-wider">
                              {order.localTrackingNo}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyTrackingNo(order.localTrackingNo)}
                            className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                          >
                            {copiedTracking === order.localTrackingNo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedTracking === order.localTrackingNo ? 'คัดลอกแล้ว' : 'คัดลอกเลขพัสดุ'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* 3. Authentic Thailand Post Tracking History Logs Table */}
                  <div className="p-6 sm:p-8 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#ED1C24]" />
                      <span>ประวัติสถานะพัสดุ (TRACKING HISTORY LOGS)</span>
                    </h4>

                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 font-bold">
                              <th className="py-3 px-4 w-36">วันที่ / เวลา</th>
                              <th className="py-3 px-4 w-44">หน่วยงาน / สถานที่</th>
                              <th className="py-3 px-4 w-36">สถานะสิ่งของ</th>
                              <th className="py-3 px-4">รายละเอียด</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {trackingLogs.map((log, idx) => (
                              <tr key={log.id || idx} className={idx === 0 ? 'bg-red-50/40 font-semibold' : 'hover:bg-gray-50'}>
                                <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                                  <div className="font-bold text-gray-900">{log.date}</div>
                                  <div className="text-[11px] text-gray-500">{log.time}</div>
                                </td>
                                <td className="py-3 px-4 text-gray-800">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-[#ED1C24] shrink-0" />
                                    <span>{log.location}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    idx === 0 ? 'bg-[#ED1C24] text-white' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {log.statusTag}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-gray-600 leading-relaxed">
                                  {log.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* 4. Product Details & Weight Calculation Breakdown */}
                  <div className="p-6 sm:p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left: Product Info Card */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-[#ED1C24]" />
                        <span>รายละเอียดสิ่งของในพัสดุ</span>
                      </h4>

                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-1.5 ${cat.color}`}>
                              {cat.name}
                            </span>
                            <h5 className="text-base font-bold text-gray-900 leading-snug">
                              {order.productName}
                            </h5>
                          </div>
                          <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 shrink-0">
                            จำนวน {order.quantity} ชิ้น
                          </span>
                        </div>

                        {order.customerAddress && (
                          <div className="text-xs text-gray-600 pt-2 border-t border-gray-200">
                            <span className="font-bold text-gray-700">ที่อยู่จัดส่ง: </span>
                            <span>{order.customerAddress}</span>
                          </div>
                        )}

                        {order.notes && (
                          <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                            <span className="font-bold">หมายเหตุ: </span>
                            <span>{order.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Weight Calculation Breakdown Card */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-[#ED1C24]" />
                        <span>สรุปการคำนวณค่าน้ำหนัก & ค่าบริการ</span>
                      </h4>

                      <div className="p-5 rounded-2xl bg-gradient-to-br from-red-50/60 to-white border-2 border-red-100 space-y-3">
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span>น้ำหนักสิ่งของที่ชั่งจริง:</span>
                          <span className="font-mono text-sm font-bold text-gray-900">{formatWeight(order.weightKg)}</span>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span>อัตราค่าน้ำหนัก:</span>
                          <span className="font-mono font-bold text-gray-800">{formatCurrency(order.weightRate)} / กก.</span>
                        </div>

                        <div className="flex justify-between items-center text-xs font-bold text-[#ED1C24] pt-2 border-t border-red-100">
                          <span>รวมค่าน้ำหนักญี่ปุ่น-ไทย:</span>
                          <span className="font-mono text-base">{formatCurrency(weightCost)}</span>
                        </div>

                        {totalCalc.depositPaid > 0 && (
                          <div className="flex justify-between items-center text-xs text-emerald-600">
                            <span>หักยอดมัดจำที่ชำระแล้ว:</span>
                            <span className="font-mono font-bold">- {formatCurrency(totalCalc.depositPaid)}</span>
                          </div>
                        )}

                        {totalCalc.localShippingFee > 0 && (
                          <div className="flex justify-between items-center text-xs text-gray-600">
                            <span>ค่าจัดส่งในไทย:</span>
                            <span className="font-mono font-bold">+ {formatCurrency(totalCalc.localShippingFee)}</span>
                          </div>
                        )}

                        <div className="pt-3 border-t-2 border-red-200 flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-bold text-gray-900">ยอดคงเหลือสุทธิที่ต้องชำระ:</span>
                          <span className="font-mono text-lg sm:text-xl font-black text-[#ED1C24]">
                            {formatCurrency(totalCalc.remainingBalance)}
                          </span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* 5. Bottom Help Actions */}
                  <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-gray-500">
                      มีข้อสงสัยเกี่ยวกับสถานะพัสดุหรือค่าน้ำหนัก ติดต่อร้านได้ตลอด 24 ชม.
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={lineUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>ติดต่อ LINE ร้าน ({lineId})</span>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* =========================================================
          SECTION 3: INLINE POSTAL RATE CALCULATOR WIDGET
          ========================================================= */}
      <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#ED1C24] flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              คำนวณอัตราค่าบริการและค่าน้ำหนักญี่ปุ่น-ไทย
            </h3>
            <p className="text-xs text-gray-500">
              ประเมินค่าน้ำหนักก่อนสั่งซื้อสินค้าตามเรทกิโลกรัมจริง
            </p>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              น้ำหนักสินค้า (กิโลกรัม / kg):
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={calcWeight}
              onChange={(e) => setCalcWeight(e.target.value)}
              placeholder="เช่น 1.5 หรือ 0.8"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 focus:border-[#ED1C24] rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-red-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              อัตราค่าบริการ (บาท / กก.):
            </label>
            <select
              value={calcRate}
              onChange={(e) => setCalcRate(parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 focus:border-[#ED1C24] rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-100"
            >
              <option value={220}>สินค้าทั่วไป (220 ฿/กก.)</option>
              <option value={250}>ขนม / ฟิกเกอร์ / เสื้อผ้า (250 ฿/กก.)</option>
              <option value={280}>เครื่องสำอาง / วิตามิน (280 ฿/กก.)</option>
              <option value={300}>สินค้าไอที / บินด่วน (300 ฿/กก.)</option>
              <option value={150}>ทางเรือ Sea Cargo (150 ฿/กก.)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#ED1C24] to-[#C81018] hover:from-[#D4141E] hover:to-[#A80B13] text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-95"
            >
              คำนวณค่าน้ำหนัก
            </button>
          </div>
        </form>

        {calcResult && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between animate-fadeIn">
            <div className="text-xs text-gray-700">
              น้ำหนัก <strong>{calcResult.weight} กก.</strong> × อัตรา <strong>{calcResult.rate} ฿/กก.</strong>
            </div>
            <div className="font-mono text-lg font-black text-[#ED1C24]">
              = {formatCurrency(calcResult.total)}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
