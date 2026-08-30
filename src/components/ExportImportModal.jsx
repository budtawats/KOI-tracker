import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Database, 
  RefreshCw, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { calculateWeightCost } from '../utils/formatters';

export default function ExportImportModal({
  isOpen,
  onClose,
  orders,
  trips,
  onImportData,
  onResetData
}) {
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Export to CSV with UTF-8 BOM so Thai characters show up perfectly in Excel
  const handleExportCSV = () => {
    const headers = [
      'รหัสพัสดุ',
      'วันที่บันทึก',
      'ชื่อลูกค้า',
      'เบอร์โทร',
      'ที่อยู่จัดส่ง',
      'ชื่อสินค้า',
      'หมวดหมู่',
      'จำนวน(ชิ้น)',
      'น้ำหนัก(กก.)',
      'เรทค่าน้ำหนัก(฿/กก.)',
      'ค่าน้ำหนักสุทธิ(฿)',
      'ราคาสินค้า(฿)',
      'ค่าส่งในไทย(฿)',
      'มัดจำแล้ว(฿)',
      'รอบวันกลับ(ID)',
      'สถานะ',
      'เลขพัสดุในไทย',
      'ขนส่งในไทย',
      'หมายเหตุ'
    ];

    const rows = orders.map(o => {
      const weightCost = calculateWeightCost(o.weightKg, o.weightRate);
      return [
        `"${o.id}"`,
        `"${o.createdAt || ''}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${o.customerPhone || ''}"`,
        `"${(o.customerAddress || '').replace(/"/g, '""')}"`,
        `"${(o.productName || '').replace(/"/g, '""')}"`,
        `"${o.categoryId || ''}"`,
        o.quantity || 1,
        o.weightKg || 0,
        o.weightRate || 0,
        weightCost,
        o.itemPriceThb || 0,
        o.localShippingFee || 0,
        o.depositPaid || 0,
        `"${o.tripId || ''}"`,
        `"${o.status || ''}"`,
        `"${o.localTrackingNo || ''}"`,
        `"${o.localCarrier || ''}"`,
        `"${(o.notes || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    // UTF-8 BOM (\uFEFF) ensures Thai language displays correctly in Microsoft Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KOI-Japan-Orders-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export full JSON backup
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      shop: 'KOI Japan Shop',
      trips,
      orders
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KOI-Japan-Backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.orders || !Array.isArray(parsed.orders)) {
          alert('รูปแบบไฟล์ไม่ถูกต้อง: ต้องมีชุดข้อมูล orders');
          return;
        }
        if (confirm(`พบข้อมูล ${parsed.orders.length} รายการ ต้องการนำเข้าและแทนที่ข้อมูลปัจจุบันใช่หรือไม่?`)) {
          onImportData(parsed.orders, parsed.trips || trips);
          alert('นำเข้าข้อมูลสำเร็จ!');
          onClose();
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-base">สำรอง & ส่งออกข้อมูล (Backup & Export)</h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          
          {/* Option 1: Excel CSV */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">ส่งออกไฟล์ Excel (CSV)</h4>
                <p className="text-xs text-gray-500">รองรับภาษาไทย 100% เปิดใน Excel ได้ทันที</p>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-sm active:scale-95 transition-transform"
            >
              ดาวน์โหลด CSV
            </button>
          </div>

          {/* Option 2: JSON Backup */}
          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">สำรองข้อมูลระบบ (JSON Backup)</h4>
                <p className="text-xs text-gray-500">บันทึกประวัติ ออเดอร์ และรอบวันกลับทั้งหมด</p>
              </div>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-sm active:scale-95 transition-transform"
            >
              สำรองข้อมูล
            </button>
          </div>

          {/* Option 3: Restore JSON */}
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">กู้คืนข้อมูล (Import JSON)</h4>
                <p className="text-xs text-gray-500">นำเข้าไฟล์สำรองเพื่อย้ายเครื่องหรือกู้คืน</p>
              </div>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shrink-0 shadow-sm active:scale-95 transition-transform"
              >
                เลือกไฟล์
              </button>
            </div>
          </div>

          {/* Option 4: Reset Sample Data */}
          <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-xs">
            <div className="text-gray-500 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>ต้องการรีเซ็ตข้อมูลเป็นตัวอย่างเริ่มต้น?</span>
            </div>
            <button
              onClick={() => {
                if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นตัวอย่างร้าน KOI Japan Shop ใช่หรือไม่?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
            >
              รีเซ็ตข้อมูลตัวอย่าง
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
}
