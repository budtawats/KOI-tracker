import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Scale, 
  Coins, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatWeight } from '../utils/formatters';

const STORAGE_KEY_CALC = 'koi_japan_shop_calc_settings_v1';

export default function WeightCalculatorModal({ isOpen, onClose }) {
  const [calcState, setCalcState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CALC);
      return saved ? JSON.parse(saved) : {
        weightKg: 1.0,
        ratePerKg: 250,
        jpyPrice: '',
        jpyExchangeRate: 0.24,
        domesticShip: 50
      };
    } catch {
      return { weightKg: 1.0, ratePerKg: 250, jpyPrice: '', jpyExchangeRate: 0.24, domesticShip: 50 };
    }
  });

  const { weightKg, ratePerKg, jpyPrice, jpyExchangeRate, domesticShip } = calcState;

  const updateCalc = (field, val) => {
    setCalcState(prev => {
      const next = { ...prev, [field]: val };
      try {
        localStorage.setItem(STORAGE_KEY_CALC, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const setWeightKg = (val) => updateCalc('weightKg', val);
  const setRatePerKg = (val) => updateCalc('ratePerKg', val);
  const setJpyPrice = (val) => updateCalc('jpyPrice', val);
  const setJpyExchangeRate = (val) => updateCalc('jpyExchangeRate', val);
  const setDomesticShip = (val) => updateCalc('domesticShip', val);

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const weightCost = Math.round((parseFloat(weightKg) || 0) * (parseFloat(ratePerKg) || 0));
  const productThb = jpyPrice ? Math.round((parseFloat(jpyPrice) || 0) * (parseFloat(jpyExchangeRate) || 0.24)) : 0;
  const grandTotal = weightCost + productThb + (parseFloat(domesticShip) || 0);

  const handleCopyQuote = () => {
    const text = `🎌 ใบประเมินราคาพรีออเดอร์ — KOI Japan Shop
━━━━━━━━━━━━━━━━━━━
⚖️ น้ำหนักประมาณการ: ${weightKg} กก.
📊 เรทค่าน้ำหนัก: ${ratePerKg} ฿/กก.
💰 ค่าน้ำหนัก: ${weightCost.toLocaleString()} บาท
${productThb > 0 ? `💴 ราคาสินค้า (${jpyPrice} ¥ × ${jpyExchangeRate}): ${productThb.toLocaleString()} บาท\n` : ''}${domesticShip > 0 ? `🚚 ค่าส่งในไทย: ${domesticShip} บาท\n` : ''}-----------------------------------
✨ ยอดรวมประมาณการทั้งหมด: ${grandTotal.toLocaleString()} บาท
(ค่าน้ำหนักจริงจะคำนวณอีกครั้งเมื่อสินค้าถึงไทยและชั่งจริงครับ/ค่ะ)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">เครื่องคิดเลขค่าน้ำหนัก & ค่าพรีออเดอร์</h3>
              <p className="text-xs text-amber-100">คำนวณและประเมินราคาก่อนเสนอให้ลูกค้า</p>
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
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          
          {/* Weight & Rate Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                น้ำหนัก (กก.)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-black text-blue-700 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
              />
              <div className="flex gap-1 mt-1">
                {[0.2, 0.5, 1.0, 2.0].map(w => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeightKg(w)}
                    className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 font-medium hover:bg-gray-200"
                  >
                    {w}kg
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                เรทค่าน้ำหนัก (฿/กก.)
              </label>
              <input
                type="number"
                min="0"
                value={ratePerKg}
                onChange={(e) => setRatePerKg(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-gray-800 focus:bg-white focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
              />
              <div className="flex gap-1 mt-1">
                {[150, 200, 250, 280, 300].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRatePerKg(r)}
                    className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 font-medium hover:bg-gray-200"
                  >
                    {r}฿
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Yen conversion */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              ราคาสินค้าที่ญี่ปุ่น (ถ้ามี)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-gray-600 mb-0.5">ราคาเยน (¥)</label>
                <input
                  type="number"
                  placeholder="เช่น 3500"
                  value={jpyPrice}
                  onChange={(e) => setJpyPrice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-600 mb-0.5">เรทแลกเปลี่ยน (เช่น 0.24)</label>
                <input
                  type="number"
                  step="0.01"
                  value={jpyExchangeRate}
                  onChange={(e) => setJpyExchangeRate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              ค่าจัดส่งในไทย (บาท)
            </label>
            <input
              type="number"
              value={domesticShip}
              onChange={(e) => setDomesticShip(e.target.value)}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
            />
          </div>

          {/* Summary Box */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>ค่าน้ำหนัก ({weightKg} กก. × {ratePerKg} ฿):</span>
              <span className="font-bold text-amber-700">{formatCurrency(weightCost)}</span>
            </div>
            {productThb > 0 && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>ราคาสินค้าแปลงเป็นเงินบาท:</span>
                <span className="font-bold text-gray-800">{formatCurrency(productThb)}</span>
              </div>
            )}
            {domesticShip > 0 && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>ค่าส่งในไทย:</span>
                <span className="font-bold text-gray-800">{formatCurrency(domesticShip)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-amber-300 flex justify-between items-center text-sm font-bold">
              <span className="text-gray-900">ยอดรวมประเมิน:</span>
              <span className="text-xl font-black text-amber-600">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCopyQuote}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'คัดลอกใบเสนอราคาแล้ว!' : 'คัดลอกข้อความเสนอราคา'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs"
            >
              ปิด
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
