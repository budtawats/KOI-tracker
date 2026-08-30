import React from 'react';
import { 
  Package, 
  Scale, 
  Coins, 
  Boxes, 
  Plane, 
  Calendar, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatWeight, getDaysLeftText } from '../utils/formatters';
import { ORDER_STATUSES, CATEGORIES } from '../types/data';

export default function DashboardStats({ 
  orders = [], 
  trips = [], 
  selectedTrip = 'all', 
  setSelectedTrip = () => {}, 
  selectedCategory = 'all', 
  setSelectedCategory = () => {}, 
  onOpenTripManager = () => {} 
}) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeTrips = Array.isArray(trips) ? trips : [];

  // Calculate summary metrics
  const totalOrders = safeOrders.length;
  const totalPieces = safeOrders.reduce((sum, o) => sum + (parseInt(o.quantity) || 0), 0);
  const totalWeightKg = safeOrders.reduce((sum, o) => sum + (parseFloat(o.weightKg) || 0), 0);
  
  const totalWeightFee = safeOrders.reduce((sum, o) => {
    const w = parseFloat(o.weightKg) || 0;
    const rate = parseFloat(o.weightRate) || 0;
    return sum + (w * rate);
  }, 0);

  const totalProductValue = safeOrders.reduce((sum, o) => sum + (parseFloat(o.itemPriceThb) || 0), 0);

  // Status counts
  const statusCounts = ORDER_STATUSES.map(st => ({
    ...st,
    count: safeOrders.filter(o => o.status === st.id).length
  }));

  // Trip stats
  const tripStats = safeTrips.map(trip => {
    const tripOrders = safeOrders.filter(o => o.tripId === trip.id);
    const weight = tripOrders.reduce((sum, o) => sum + (parseFloat(o.weightKg) || 0), 0);
    const pieces = tripOrders.reduce((sum, o) => sum + (parseInt(o.quantity) || 0), 0);
    const daysLeft = getDaysLeftText(trip.returnDate);
    return {
      ...trip,
      orderCount: tripOrders.length,
      weight,
      pieces,
      daysLeft
    };
  });

  return (
    <div className="space-y-6 mb-8">
      {/* 4 Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-6 -mt-6 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">พัสดุ / ออเดอร์ทั้งหมด</p>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">{totalOrders} <span className="text-sm font-normal text-gray-500">รายการ</span></h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <span>📦 รวม {totalPieces} ชิ้นสินค้า</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-inner">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 2: Total Weight */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-6 -mt-6 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">น้ำหนักสินค้ารวม</p>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
                {totalWeightKg.toFixed(2)} <span className="text-sm font-normal text-gray-500">กก.</span>
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                เฉลี่ย {totalOrders > 0 ? (totalWeightKg / totalOrders).toFixed(2) : 0} กก./ออเดอร์
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
              <Scale className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 3: Total Weight Cost */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-6 -mt-6 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ยอดรวมค่าน้ำหนัก</p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                {formatCurrency(totalWeightFee)}
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                ค่าน้ำหนักจากญี่ปุ่นกลับไทย
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
              <Coins className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Card 4: Product Value */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-soft hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-6 -mt-6 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">มูลค่าสินค้ารวม</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                {formatCurrency(totalProductValue)}
              </h3>
              <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>ราคาสินค้าพรีออเดอร์</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <Boxes className="w-6 h-6" />
            </div>
          </div>
        </div>

      </div>

      {/* Return Trips (รอบวันกลับ) & Status Flow Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Return Trips */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Plane className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">รอบวันกลับ (Return Trips)</h4>
                <p className="text-xs text-gray-500">เลือกคลิกเพื่อกรองดูรายการสินค้าตามรอบบิน/รอบเรือ</p>
              </div>
            </div>
            <button
              onClick={onOpenTripManager}
              className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 hover:underline"
            >
              <span>จัดการรอบ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* "All Trips" option */}
            <div
              onClick={() => setSelectedTrip('all')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedTrip === 'all'
                  ? 'bg-red-50/80 border-red-300 ring-2 ring-red-400/30'
                  : 'bg-gray-50 hover:bg-gray-100/80 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={selectedTrip === 'all' ? 'text-red-700 font-bold' : 'text-gray-700'}>
                  ทุกรอบการเดินทาง
                </span>
                <span className="px-2 py-0.5 bg-white rounded-full text-gray-700 text-[10px] font-bold border border-gray-200">
                  {totalOrders} รายการ
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex justify-between items-end">
                <span>น้ำหนักรวม</span>
                <span className="font-bold text-gray-900">{totalWeightKg.toFixed(2)} กก.</span>
              </div>
            </div>

            {/* Individual Trips */}
            {tripStats.map((trip) => {
              const isSelected = selectedTrip === trip.id;
              return (
                <div
                  key={trip.id}
                  onClick={() => setSelectedTrip(isSelected ? 'all' : trip.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-50/80 border-red-300 ring-2 ring-red-400/30'
                      : 'bg-gray-50 hover:bg-gray-100/80 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className={`truncate mr-1 ${isSelected ? 'text-red-700 font-bold' : 'text-gray-800'}`}>
                      {trip.name}
                    </span>
                    <span className="px-2 py-0.5 bg-white rounded-full text-red-600 text-[10px] font-bold border border-red-100 shrink-0">
                      {trip.orderCount}
                    </span>
                  </div>

                  <div className="mt-2 text-xs flex justify-between items-center text-gray-500">
                    <span>{trip.weight.toFixed(2)} กก. ({trip.pieces} ชิ้น)</span>
                    {trip.daysLeft && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        trip.daysLeft.type === 'today' || trip.daysLeft.type === 'urgent'
                          ? 'bg-amber-100 text-amber-800'
                          : trip.daysLeft.type === 'passed'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {trip.daysLeft.text}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Status Progress Overview */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">สถานะพัสดุ (Status)</h4>
            <span className="text-xs text-gray-500">ขั้นตอนการดำเนินงาน</span>
          </div>

          <div className="space-y-2.5">
            {statusCounts.map((st) => {
              const percent = totalOrders > 0 ? Math.round((st.count / totalOrders) * 100) : 0;
              return (
                <div key={st.id} className="text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5 font-medium text-gray-700">
                      <span className={`w-2 h-2 rounded-full ${st.badge}`}></span>
                      <span>{st.labelShort}</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {st.count} <span className="text-gray-400 font-normal">({percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${st.badge}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
