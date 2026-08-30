import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  FileText, 
  Check, 
  ChevronDown, 
  SlidersHorizontal,
  Package, 
  Scale, 
  Coins, 
  Calendar, 
  ExternalLink,
  Phone,
  LayoutGrid,
  ListFilter,
  Sparkles,
  ArrowUpDown,
  Share2,
  Copy
} from 'lucide-react';
import { CATEGORIES, ORDER_STATUSES } from '../types/data';
import { formatCurrency, formatWeight, formatThaiDate, calculateWeightCost } from '../utils/formatters';

export default function OrderTable({
  orders,
  trips,
  selectedTrip,
  setSelectedTrip,
  onEditOrder,
  onDeleteOrder,
  onOpenSlip,
  onUpdateStatus,
  onQuickUpdate,
  onOpenNewOrder
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewStyle, setViewStyle] = useState('table'); // 'table' or 'grid'
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'weight-desc', 'cost-desc', 'customer'
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCustomerLink = (orderId) => {
    const url = `${window.location.origin}${window.location.pathname}?mode=customer&track=${encodeURIComponent(orderId)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search query matching
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.includes(query) ||
      order.productName.toLowerCase().includes(query) ||
      (order.localTrackingNo && order.localTrackingNo.toLowerCase().includes(query));

    // Category filter
    const matchesCategory = categoryFilter === 'all' || order.categoryId === categoryFilter;

    // Trip filter
    const matchesTrip = selectedTrip === 'all' || order.tripId === selectedTrip;

    // Status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesCategory && matchesTrip && matchesStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === 'weight-desc') return (parseFloat(b.weightKg) || 0) - (parseFloat(a.weightKg) || 0);
    if (sortBy === 'weight-asc') return (parseFloat(a.weightKg) || 0) - (parseFloat(b.weightKg) || 0);
    if (sortBy === 'cost-desc') {
      const costA = (parseFloat(a.weightKg) || 0) * (parseFloat(a.weightRate) || 0);
      const costB = (parseFloat(b.weightKg) || 0) * (parseFloat(b.weightRate) || 0);
      return costB - costA;
    }
    if (sortBy === 'customer') return a.customerName.localeCompare(b.customerName, 'th');
    return 0;
  });

  // Category helper
  const getCategoryInfo = (catId) => {
    return CATEGORIES.find(c => c.id === catId) || {
      name: catId || 'อื่นๆ',
      badgeBg: 'bg-gray-100 text-gray-800',
      color: 'bg-gray-50'
    };
  };

  // Status helper
  const getStatusInfo = (stId) => {
    return ORDER_STATUSES.find(s => s.id === stId) || {
      label: stId,
      color: 'bg-gray-100 text-gray-800 border-gray-300',
      badge: 'bg-gray-400'
    };
  };

  // Trip helper
  const getTripInfo = (tripId) => {
    return trips.find(t => t.id === tripId) || { name: 'รอบทั่วไป', returnDate: '-' };
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrderIds(sortedOrders.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = (newStatus) => {
    if (selectedOrderIds.length === 0) return;
    selectedOrderIds.forEach(id => {
      onUpdateStatus(id, newStatus);
    });
    setSelectedOrderIds([]);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-soft overflow-hidden">
      
      {/* Control Bar: Filters, Search & View Toggle */}
      <div className="p-4 sm:p-6 border-b border-gray-200 space-y-4">
        
        {/* Row 1: Search & Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, รหัสพัสดุ (KOI-...), หรือชื่อสินค้า..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
              >
                <option value="newest">📅 ล่าสุด (Newest)</option>
                <option value="oldest">เก่าสุด (Oldest)</option>
                <option value="weight-desc">⚖️ น้ำหนักมาก → น้อย</option>
                <option value="weight-asc">⚖️ น้ำหนักน้อย → มาก</option>
                <option value="cost-desc">💰 ค่าน้ำหนักสูงสุด</option>
                <option value="customer">👤 เรียงตามชื่อลูกค้า</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Switcher (Table / Cards) */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewStyle('table')}
                className={`p-1.5 rounded-lg transition-colors ${viewStyle === 'table' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-800'}`}
                title="มุมมองตาราง"
              >
                <ListFilter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewStyle('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewStyle === 'grid' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-800'}`}
                title="มุมมองการ์ด"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          
          {/* Trip Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-gray-500 font-medium">รอบวันกลับ:</span>
            <select
              value={selectedTrip}
              onChange={(e) => setSelectedTrip(e.target.value)}
              className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="all">ทุกรอบการเดินทาง ({orders.length})</option>
              {trips.map(trip => (
                <option key={trip.id} value={trip.id}>
                  {trip.name} ({orders.filter(o => o.tripId === trip.id).length})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Package className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-gray-500 font-medium">ประเภทสินค้า:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="all">ทุกประเภท ({orders.length})</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({orders.filter(o => o.categoryId === cat.id).length})
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-gray-500 font-medium">สถานะ:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="all">ทุกสถานะ ({orders.length})</option>
              {ORDER_STATUSES.map(st => (
                <option key={st.id} value={st.id}>
                  {st.labelShort} ({orders.filter(o => o.status === st.id).length})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {(searchQuery || categoryFilter !== 'all' || selectedTrip !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setSelectedTrip('all');
                setStatusFilter('all');
              }}
              className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 hover:underline"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}

          <div className="ml-auto text-xs text-gray-500">
            พบ <span className="font-bold text-gray-900">{sortedOrders.length}</span> รายการ
          </div>
        </div>

        {/* Bulk Action Bar (when items selected) */}
        {selectedOrderIds.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-800">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                {selectedOrderIds.length}
              </span>
              <span>เลือก {selectedOrderIds.length} รายการ</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-600">เปลี่ยนสถานะเป็น:</span>
              {ORDER_STATUSES.map(st => (
                <button
                  key={st.id}
                  onClick={() => handleBulkStatusChange(st.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium border text-[11px] hover:opacity-90 transition-opacity ${st.color}`}
                >
                  {st.labelShort}
                </button>
              ))}
              <button
                onClick={() => setSelectedOrderIds([])}
                className="text-gray-500 hover:text-gray-700 ml-2 font-medium"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Main Content: Table or Grid View */}
      {sortedOrders.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-800">ไม่พบรายการสินค้าที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            ลองปรับเปลี่ยนคำค้นหา หรือกดปุ่มเพิ่มรายการสินค้าใหม่ด้านล่าง
          </p>
          <button
            onClick={onOpenNewOrder}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 shadow-sm"
          >
            + เพิ่มสินค้าใหม่
          </button>
        </div>
      ) : viewStyle === 'table' ? (
        /* TABLE VIEW */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-200">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.length === sortedOrders.length && sortedOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                </th>
                <th className="py-3 px-4">รหัสพัสดุ / วันที่</th>
                <th className="py-3 px-4">ลูกค้า</th>
                <th className="py-3 px-4 min-w-[200px]">สินค้า & ประเภท</th>
                <th className="py-3 px-4 text-center">จำนวน (ชิ้น)</th>
                <th className="py-3 px-4 text-right">น้ำหนัก</th>
                <th className="py-3 px-4 text-right">เรท (฿/กก.)</th>
                <th className="py-3 px-4 text-right font-bold text-gray-800">ค่าน้ำหนัก</th>
                <th className="py-3 px-4">รอบวันกลับ</th>
                <th className="py-3 px-4">สถานะพัสดุ</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedOrders.map((order) => {
                const cat = getCategoryInfo(order.categoryId);
                const st = getStatusInfo(order.status);
                const trip = getTripInfo(order.tripId);
                const weightCost = calculateWeightCost(order.weightKg, order.weightRate);
                const isSelected = selectedOrderIds.includes(order.id);

                return (
                  <tr 
                    key={order.id} 
                    className={`hover:bg-red-50/30 transition-colors ${isSelected ? 'bg-red-50/50' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(order.id)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                    </td>

                    {/* Tracking ID & Date */}
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-900">
                      <div className="font-bold text-red-600">{order.id}</div>
                      <div className="text-[10px] text-gray-400 font-sans">
                        {formatThaiDate(order.createdAt)}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-800">{order.customerName}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{order.customerPhone}</span>
                      </div>
                    </td>

                    {/* Product & Category */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        {order.imageUrl && (
                          <img
                            src={order.imageUrl}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1 max-w-xs" title={order.productName}>
                            {order.productName}
                          </div>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${cat.badgeBg}`}>
                              {cat.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Quantity (ชิ้น) */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="number"
                        min="1"
                        value={order.quantity}
                        onChange={(e) => onQuickUpdate && onQuickUpdate(order.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-14 text-center py-1 bg-gray-50 hover:bg-white focus:bg-white border border-transparent hover:border-gray-300 focus:border-red-500 rounded-lg text-xs font-bold text-gray-800 transition-colors focus:ring-1 focus:ring-red-400"
                        title="คลิกเพื่อแก้ไขจำนวนชิ้น"
                      />
                    </td>

                    {/* Weight (กก.) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={order.weightKg}
                          onChange={(e) => onQuickUpdate && onQuickUpdate(order.id, 'weightKg', parseFloat(e.target.value) || 0)}
                          className="w-20 text-right py-1 px-1.5 bg-blue-50/50 hover:bg-white focus:bg-white border border-transparent hover:border-blue-300 focus:border-blue-500 rounded-lg text-xs font-bold text-blue-700 transition-colors focus:ring-1 focus:ring-blue-400"
                          title="คลิกเพื่อแก้ไขน้ำหนัก (กก.)"
                        />
                        <span className="text-[11px] text-gray-400 font-medium">กก.</span>
                      </div>
                    </td>

                    {/* Weight Rate (฿/kg) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <input
                          type="number"
                          min="0"
                          value={order.weightRate}
                          onChange={(e) => onQuickUpdate && onQuickUpdate(order.id, 'weightRate', parseFloat(e.target.value) || 0)}
                          className="w-16 text-right py-1 px-1.5 bg-gray-50 hover:bg-white focus:bg-white border border-transparent hover:border-amber-300 focus:border-amber-500 rounded-lg text-xs font-semibold text-gray-800 transition-colors focus:ring-1 focus:ring-amber-400"
                          title="คลิกเพื่อแก้ไขเรทค่าน้ำหนัก (฿/กก.)"
                        />
                        <span className="text-[11px] text-gray-400">฿</span>
                      </div>
                    </td>

                    {/* Total Weight Cost (฿) */}
                    <td className="py-3.5 px-4 text-right font-black text-amber-600 text-sm">
                      {formatCurrency(weightCost)}
                    </td>

                    {/* Return Trip (รอบวันกลับ) */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800 text-[11px] line-clamp-1" title={trip.name}>
                        {trip.name}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        กลับ: {formatThaiDate(trip.returnDate)}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                          className={`appearance-none text-[11px] font-bold px-2.5 py-1 pr-6 rounded-full border cursor-pointer focus:outline-none ${st.color}`}
                        >
                          {ORDER_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.labelShort}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>

                      {order.localTrackingNo && (
                        <div className="mt-1 text-[10px] text-emerald-700 font-mono flex items-center gap-1">
                          <span>📦 {order.localTrackingNo}</span>
                        </div>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Copy Customer Link */}
                        <button
                          onClick={() => handleCopyCustomerLink(order.id)}
                          title="คัดลอกลิงก์หน้าติดตามให้ลูกค้า (LINE/แชท)"
                          className={`p-1.5 rounded-lg transition-colors ${
                            copiedId === order.id 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {copiedId === order.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                        </button>

                        {/* Slip / Invoice */}
                        <button
                          onClick={() => onOpenSlip(order)}
                          title="สร้างสลิป / ใบแจ้งยอด"
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => onEditOrder(order)}
                          title="แก้ไขข้อมูล"
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          title="ลบรายการ"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID / CARD VIEW */
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOrders.map((order) => {
            const cat = getCategoryInfo(order.categoryId);
            const st = getStatusInfo(order.status);
            const trip = getTripInfo(order.tripId);
            const weightCost = calculateWeightCost(order.weightKg, order.weightRate);

            return (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Tracking ID & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">
                      {order.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.color}`}>
                      {st.labelShort}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-3">
                    <h4 className="font-bold text-gray-900 text-sm">{order.customerName}</h4>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 bg-gray-50 rounded-xl mb-3 border border-gray-100">
                    <div className="flex items-start gap-2">
                      {order.imageUrl && (
                        <img
                          src={order.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800 line-clamp-2">{order.productName}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${cat.badgeBg}`}>
                            {cat.name}
                          </span>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded border text-gray-700 font-bold">
                            {order.quantity} ชิ้น
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weight & Cost Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 mb-3 text-xs">
                    <div>
                      <span className="text-gray-500 text-[11px]">น้ำหนัก (กก.):</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={order.weightKg}
                          onChange={(e) => onQuickUpdate && onQuickUpdate(order.id, 'weightKg', parseFloat(e.target.value) || 0)}
                          className="w-16 px-1.5 py-0.5 bg-white border border-amber-200 rounded font-bold text-blue-700 text-xs"
                          title="แก้ไขน้ำหนัก (กก.)"
                        />
                        <span className="text-[10px] text-gray-500">กก.</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                        <span>เรท:</span>
                        <input
                          type="number"
                          min="0"
                          value={order.weightRate}
                          onChange={(e) => onQuickUpdate && onQuickUpdate(order.id, 'weightRate', parseFloat(e.target.value) || 0)}
                          className="w-12 px-1 py-0.5 bg-white border border-amber-200 rounded font-semibold text-gray-800 text-[10px]"
                          title="แก้ไขเรท (฿/กก.)"
                        />
                        <span>฿</span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <span className="text-gray-500 text-[11px]">ค่าน้ำหนัก:</span>
                      <p className="font-black text-amber-600 text-base">{formatCurrency(weightCost)}</p>
                    </div>
                  </div>

                  {/* Trip Info */}
                  <div className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{trip.name}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenSlip(order)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>สลิปแจ้งยอด</span>
                    </button>

                    <button
                      onClick={() => handleCopyCustomerLink(order.id)}
                      className={`text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                        copiedId === order.id 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title="คัดลอกลิงก์ให้ลูกค้า"
                    >
                      {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-gray-500" />}
                      <span>{copiedId === order.id ? 'คัดลอกแล้ว!' : 'แชร์ลิงก์'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditOrder(order)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Table Footer */}
      <div className="p-4 bg-gray-50/80 border-t border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          แสดง <strong>{sortedOrders.length}</strong> จากทั้งหมด <strong>{orders.length}</strong> รายการ
        </div>
        <div className="flex items-center gap-4 font-semibold text-gray-700">
          <span>น้ำหนักรวมที่แสดง: <strong className="text-blue-600">{sortedOrders.reduce((sum, o) => sum + (parseFloat(o.weightKg) || 0), 0).toFixed(2)} กก.</strong></span>
          <span>ค่าน้ำหนักรวม: <strong className="text-amber-600">{formatCurrency(sortedOrders.reduce((sum, o) => sum + ((parseFloat(o.weightKg) || 0) * (parseFloat(o.weightRate) || 0)), 0))}</strong></span>
        </div>
      </div>

    </div>
  );
}
