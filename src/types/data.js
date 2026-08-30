// Category Definitions
export const CATEGORIES = [
  {
    id: 'snacks',
    name: 'ขนม / ของกิน',
    nameEn: 'Snacks & Foods',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-800',
    icon: 'Cookie',
    defaultRate: 250
  },
  {
    id: 'cosmetics',
    name: 'เครื่องสำอาง / สกินแคร์',
    nameEn: 'Cosmetics & Skincare',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeBg: 'bg-rose-100 text-rose-800',
    icon: 'Sparkles',
    defaultRate: 280
  },
  {
    id: 'figures',
    name: 'ฟิกเกอร์ / โมเดล / ของสะสม',
    nameEn: 'Figures & Toys',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeBg: 'bg-indigo-100 text-indigo-800',
    icon: 'Gamepad2',
    defaultRate: 250
  },
  {
    id: 'fashion',
    name: 'เสื้อผ้า / กระเป๋า / แฟชั่น',
    nameEn: 'Fashion & Apparel',
    color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    badgeBg: 'bg-fuchsia-100 text-fuchsia-800',
    icon: 'Shirt',
    defaultRate: 250
  },
  {
    id: 'gadgets',
    name: 'สินค้าไอที / Gadget',
    nameEn: 'Gadgets & Electronics',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeBg: 'bg-sky-100 text-sky-800',
    icon: 'Smartphone',
    defaultRate: 300
  },
  {
    id: 'vitamins',
    name: 'วิตามิน / อาหารเสริม / ยา',
    nameEn: 'Vitamins & Health',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    icon: 'Pill',
    defaultRate: 280
  },
  {
    id: 'general',
    name: 'สินค้าทั่วไป / ของแต่งบ้าน',
    nameEn: 'General Goods',
    color: 'bg-slate-50 text-slate-700 border-slate-200',
    badgeBg: 'bg-slate-100 text-slate-800',
    icon: 'Package',
    defaultRate: 220
  },
  {
    id: 'others',
    name: 'อื่นๆ',
    nameEn: 'Others',
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    badgeBg: 'bg-gray-100 text-gray-800',
    icon: 'Tag',
    defaultRate: 250
  }
];

// Order Tracking Statuses with Progression Order
export const ORDER_STATUSES = [
  {
    id: 'ordered',
    step: 1,
    label: 'สั่งซื้อแล้ว (ที่ญี่ปุ่น)',
    labelShort: 'สั่งซื้อแล้ว',
    description: 'ทางร้านรับออเดอร์และจัดซื้อสินค้าในญี่ปุ่นเรียบร้อยแล้ว',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    badge: 'bg-amber-500',
    icon: 'Receipt'
  },
  {
    id: 'received_jp',
    step: 2,
    label: 'สินค้าเข้าโกดังญี่ปุ่น',
    labelShort: 'เข้าโกดังญี่ปุ่น',
    description: 'สินค้าจัดส่งถึงโกดัง/ที่พักในญี่ปุ่น ตรวจสอบความถูกต้องแล้ว',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    badge: 'bg-blue-500',
    icon: 'Warehouse'
  },
  {
    id: 'in_transit',
    step: 3,
    label: 'กำลังเดินทางกลับไทย ✈️',
    labelShort: 'กำลังบินกลับไทย',
    description: 'สินค้ากำลังเดินทางกลับไทยตามรอบวันกลับที่กำหนด',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    badge: 'bg-purple-600',
    icon: 'PlaneTakeoff'
  },
  {
    id: 'arrived_th',
    step: 4,
    label: 'ถึงไทยแล้ว & ชั่งน้ำหนัก',
    labelShort: 'ถึงไทย/ชั่งน้ำหนัก',
    description: 'สินค้าเดินทางถึงไทย คัดแยก ชั่งน้ำหนักจริง และสรุปค่าน้ำหนักแล้ว',
    color: 'bg-teal-100 text-teal-800 border-teal-300',
    badge: 'bg-teal-600',
    icon: 'Scale'
  },
  {
    id: 'delivered',
    step: 5,
    label: 'จัดส่งในไทยเรียบร้อย 🚚',
    labelShort: 'จัดส่งเรียบร้อย',
    description: 'พัสดุถูกส่งมอบให้บริษัทขนส่งในไทยแล้ว พร้อมเลขติดตามพัสดุ',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    badge: 'bg-emerald-600',
    icon: 'CheckCircle2'
  }
];

// Shipping Channels
export const SHIPPING_CHANNELS = [
  { id: 'air_express', name: 'ทางเครื่องบิน (บินด่วน)', rateNote: 'เรท 280-350 ฿/กก.', defaultRate: 300 },
  { id: 'air_cargo', name: 'ทางเครื่องบิน (คาร์โก้ปกติ)', rateNote: 'เรท 220-260 ฿/กก.', defaultRate: 250 },
  { id: 'sea_cargo', name: 'ทางเรือ (ของหนัก/ประหยัด)', rateNote: 'เรท 130-180 ฿/กก.', defaultRate: 150 },
];
