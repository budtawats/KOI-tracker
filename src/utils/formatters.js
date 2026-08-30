// Format Thai Baht currency
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ฿';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount).replace('THB', '฿').trim();
};

// Format Japanese Yen
export const formatYen = (amount) => {
  if (!amount || isNaN(amount)) return '0 ¥';
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0
  }).format(amount).replace('JPY', '¥').trim();
};

// Format Weight with precision
export const formatWeight = (weightInKg) => {
  const w = parseFloat(weightInKg) || 0;
  if (w >= 1) {
    return `${w.toFixed(2)} กก.`;
  }
  const grams = Math.round(w * 1000);
  return `${w.toFixed(2)} กก. (${grams} กรัม)`;
};

// Format Weight short for badges
export const formatWeightShort = (weightInKg) => {
  const w = parseFloat(weightInKg) || 0;
  return `${w.toFixed(2)} kg`;
};

// Calculate Weight Shipping Fee
export const calculateWeightCost = (weightInKg, ratePerKg) => {
  const w = parseFloat(weightInKg) || 0;
  const rate = parseFloat(ratePerKg) || 0;
  return Math.round(w * rate);
};

// Calculate Total Order Balance
export const calculateOrderTotal = (order) => {
  const weightCost = calculateWeightCost(order.weightKg, order.weightRate);
  const itemPrice = parseFloat(order.itemPriceThb) || 0;
  const localShipping = parseFloat(order.localShippingFee) || 0;
  const otherFee = parseFloat(order.otherFee) || 0;
  const depositPaid = parseFloat(order.depositPaid) || 0;

  const grandTotal = weightCost + itemPrice + localShipping + otherFee;
  const remainingDue = Math.max(0, grandTotal - depositPaid);

  return {
    weightCost,
    itemPrice,
    localShipping,
    otherFee,
    depositPaid,
    grandTotal,
    remainingDue
  };
};

// Thai Date Formatter
export const formatThaiDate = (dateString, includeTime = false) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;

    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year} ${hours}:${minutes} น.`;
    }

    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
};

// Return Trip Days Left / Countdown helper
export const getDaysLeftText = (targetDateStr) => {
  if (!targetDateStr) return null;
  const target = new Date(targetDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { text: 'เดินทางกลับวันนี้!', type: 'today' };
  if (diffDays < 0) return { text: `กลับถึงไทยแล้ว (${Math.abs(diffDays)} วันที่แล้ว)`, type: 'passed' };
  if (diffDays === 1) return { text: 'เดินทางกลับพรุ่งนี้!', type: 'urgent' };
  return { text: `อีก ${diffDays} วันเดินทางกลับ`, type: 'upcoming', days: diffDays };
};

// Generate a random unique tracking code for KOI Japan Shop
export const generateTrackingCode = () => {
  const prefix = 'KOI';
  const now = new Date();
  const yearShort = String(now.getFullYear()).slice(-2);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-JP${yearShort}-${randomNum}`;
};
