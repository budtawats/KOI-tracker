import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Package, 
  Scale, 
  Coins, 
  Calendar,
  Sparkles,
  Phone,
  Truck
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { 
  formatCurrency, 
  formatWeight, 
  formatThaiDate, 
  calculateWeightCost, 
  calculateOrderTotal 
} from '../utils/formatters';
import { CATEGORIES, ORDER_STATUSES } from '../types/data';

export default function InvoiceSlipModal({
  isOpen,
  onClose,
  order,
  trips,
  settings = {}
}) {
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const slipRef = useRef(null);

  if (!isOpen || !order) return null;

  const shopName = settings.shopName || 'KOI Japan Shop';
  const lineId = settings.lineId || '@koijapanshop';
  const phone = settings.phone || '081-234-5678';
  const bankName = settings.bankName || 'กสิกรไทย (KBANK)';
  const bankAccountNo = settings.bankAccountNo || '123-4-56789-0';
  const bankAccountName = settings.bankAccountName || 'KOI Japan Shop';
  const promptpay = settings.promptpay || '';

  const trip = trips.find(t => t.id === order.tripId) || { name: 'รอบมาตรฐาน', returnDate: '-' };
  const cat = CATEGORIES.find(c => c.id === order.categoryId) || { name: order.categoryId };
  const st = ORDER_STATUSES.find(s => s.id === order.status) || { label: order.status };
  const totals = calculateOrderTotal(order);

  // Generate PNG Image from Slip
  const handleSaveImage = async () => {
    if (!slipRef.current) return;
    try {
      setIsGeneratingImg(true);
      const canvas = await html2canvas(slipRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `KOI-Slip-${order.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating slip image:', err);
      alert('เกิดข้อผิดพลาดในการสร้างรูปภาพ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  // Print slip
  const handlePrint = () => {
    window.print();
  };

  // Copy LINE text summary
  const handleCopyLineText = () => {
    const trackingUrl = `${window.location.origin}${window.location.pathname}?mode=customer&track=${encodeURIComponent(order.id)}`;
    const text = `🎌 ${shopName} — ใบแจ้งยอดค่าน้ำหนัก & สรุปรายการสินค้า
━━━━━━━━━━━━━━━━━━━
📦 รหัสพัสดุ: ${order.id}
👤 ลูกค้า: ${order.customerName}
📞 โทร: ${order.customerPhone || '-'}
📅 รอบวันกลับ: ${trip.name} (กลับ: ${formatThaiDate(trip.returnDate)})
-----------------------------------
🏷️ สินค้า: ${order.productName}
📂 ประเภท: ${cat.name}
🔢 จำนวน: ${order.quantity} ชิ้น
⚖️ น้ำหนัก: ${formatWeight(order.weightKg)}
📊 เรทค่าน้ำหนัก: ${order.weightRate} ฿/กก.
💰 ค่าน้ำหนัก: ${totals.weightCost.toLocaleString()} บาท
-----------------------------------
${totals.itemPrice > 0 ? `💵 ราคาสินค้า: ${totals.itemPrice.toLocaleString()} บาท\n` : ''}${totals.localShipping > 0 ? `🚚 ค่าจัดส่งในไทย: ${totals.localShipping.toLocaleString()} บาท\n` : ''}${totals.depositPaid > 0 ? `✅ มัดจำแล้ว: -${totals.depositPaid.toLocaleString()} บาท\n` : ''}🔴 ยอดคงเหลือที่ต้องชำระ: ${totals.remainingDue.toLocaleString()} บาท
-----------------------------------
${bankAccountNo ? `🏦 ช่องทางชำระเงิน:\n${bankName}: ${bankAccountNo}\nชื่อบัญชี: ${bankAccountName}\n${promptpay ? `พร้อมเพย์: ${promptpay}\n` : ''}-----------------------------------\n` : ''}${order.localTrackingNo ? `🚚 เลขพัสดุจัดส่ง (${order.localCarrier || 'ขนส่ง'}): ${order.localTrackingNo}\n` : ''}🔗 เช็คสถานะพัสดุออนไลน์: ${trackingUrl}
💬 ติดต่อทาง LINE: ${lineId} (โทร: ${phone})
🙏 ขอบพระคุณที่ไว้วางใจ ${shopName} ครับ/ค่ะ ✨`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Top Control Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-sm sm:text-base">ใบแจ้งยอดค่าน้ำหนัก & สลิปสรุปออเดอร์</h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Printable Slip Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-100/60 flex justify-center">
          
          {/* THE PRINTABLE SLIP CARD */}
          <div 
            id="printable-slip"
            ref={slipRef}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-md border border-gray-200 text-gray-800 space-y-6 relative"
          >
            {/* Red top border bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 to-amber-500 rounded-t-2xl"></div>

            {/* Slip Header */}
            <div className="text-center pt-2 space-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white font-black text-xl shadow-md mb-2">
                KOI
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">KOI Japan Shop</h2>
              <p className="text-xs text-gray-500">ใบแจ้งยอดค่าน้ำหนัก & สรุปรายการสินค้าพรีออเดอร์</p>
              <div className="pt-2 flex justify-center">
                <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  {order.id}
                </span>
              </div>
            </div>

            {/* Customer & Trip Details */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">ชื่อลูกค้า:</span>
                <span className="font-bold text-gray-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">เบอร์โทรศัพท์:</span>
                <span className="font-medium text-gray-800">{order.customerPhone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">รอบวันกลับ:</span>
                <span className="font-bold text-blue-700">{trip.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">วันที่เดินทางกลับ:</span>
                <span className="text-gray-800">{formatThaiDate(trip.returnDate)}</span>
              </div>
              {order.customerAddress && (
                <div className="pt-1 border-t border-gray-200/60 text-gray-600">
                  <span className="text-gray-500">ที่อยู่จัดส่ง: </span>{order.customerAddress}
                </div>
              )}
            </div>

            {/* Product Details Section */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                รายละเอียดสินค้า
              </h4>
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="font-bold text-gray-900 text-sm">
                  {order.productName}
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-medium text-gray-700">
                    ประเภท: {cat.name}
                  </span>
                  <span>จำนวน: <strong>{order.quantity} ชิ้น</strong></span>
                </div>
              </div>
            </div>

            {/* Weight & Shipping Calculations Breakdown */}
            <div className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200 text-xs">
              <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2">
                การคำนวณค่าน้ำหนักญี่ปุ่น-ไทย
              </h4>
              
              <div className="flex justify-between text-gray-700">
                <span>น้ำหนักสินค้าชั่งจริง:</span>
                <span className="font-bold text-blue-700">{formatWeight(order.weightKg)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>อัตราเรทค่าน้ำหนัก:</span>
                <span>{order.weightRate} บาท / กก.</span>
              </div>
              <div className="pt-1.5 border-t border-amber-200/80 flex justify-between items-center text-sm font-bold text-amber-900">
                <span>รวมราคาค่าน้ำหนัก:</span>
                <span className="text-base text-amber-600 font-black">{formatCurrency(totals.weightCost)}</span>
              </div>
            </div>

            {/* Full Balance Summary */}
            <div className="space-y-1.5 text-xs text-gray-600 pt-1">
              {totals.itemPrice > 0 && (
                <div className="flex justify-between">
                  <span>ราคาสินค้า:</span>
                  <span>{formatCurrency(totals.itemPrice)}</span>
                </div>
              )}
              {totals.localShipping > 0 && (
                <div className="flex justify-between">
                  <span>ค่าจัดส่งในไทย ({order.localCarrier || 'ขนส่ง'}):</span>
                  <span>{formatCurrency(totals.localShipping)}</span>
                </div>
              )}
              {totals.depositPaid > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>หักเงินมัดจำที่ชำระแล้ว:</span>
                  <span>-{formatCurrency(totals.depositPaid)}</span>
                </div>
              )}

              <div className="pt-3 border-t-2 border-dashed border-gray-300 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">ยอดสุทธิที่ต้องชำระ:</span>
                <span className="text-xl font-black text-red-600">
                  {formatCurrency(totals.remainingDue)}
                </span>
              </div>
            </div>

            {/* Bank Payment Card on Slip */}
            {bankAccountNo && (
              <div className="bg-blue-50/60 border border-blue-200 p-3 rounded-xl text-xs space-y-1">
                <span className="font-bold text-blue-900 text-[11px] block">🏦 ช่องทางชำระเงิน:</span>
                <div className="flex justify-between text-gray-700">
                  <span>ธนาคาร:</span>
                  <span className="font-bold text-gray-900">{bankName}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>เลขที่บัญชี:</span>
                  <span className="font-mono font-bold text-blue-700">{bankAccountNo}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>ชื่อบัญชี:</span>
                  <span>{bankAccountName}</span>
                </div>
                {promptpay && (
                  <div className="flex justify-between text-gray-700 pt-0.5 border-t border-blue-200/60">
                    <span>พร้อมเพย์:</span>
                    <span className="font-mono font-bold text-emerald-700">{promptpay}</span>
                  </div>
                )}
              </div>
            )}

            {/* Local Tracking Number if available */}
            {order.localTrackingNo && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center text-xs space-y-0.5">
                <span className="text-emerald-700 font-semibold">เลขติดตามพัสดุในไทย:</span>
                <div className="font-mono text-sm font-black text-gray-900 tracking-wider">
                  {order.localTrackingNo} ({order.localCarrier || 'Flash/Kerry/EMS'})
                </div>
              </div>
            )}

            {/* Slip Footer */}
            <div className="pt-4 border-t border-gray-100 text-center space-y-1">
              <p className="text-[11px] font-semibold text-gray-800">{shopName}</p>
              <p className="text-[10px] text-gray-500">LINE: {lineId} • โทร: {phone}</p>
              <p className="text-[10px] text-gray-400">ขอบพระคุณที่ไว้วางใจใช้บริการพรีออเดอร์สินค้าญี่ปุ่นกับเรา</p>
            </div>

          </div>

        </div>

        {/* Modal Action Bar (Buttons) */}
        <div className="p-4 bg-white border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            onClick={handleCopyLineText}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'คัดลอกข้อความ LINE แล้ว!' : 'คัดลอกข้อความส่ง LINE'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ใบแจ้งยอด</span>
            </button>

            <button
              onClick={handleSaveImage}
              disabled={isGeneratingImg}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-500/20 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingImg ? 'กำลังบันทึกภาพ...' : 'บันทึกเป็นรูปภาพ (PNG)'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
