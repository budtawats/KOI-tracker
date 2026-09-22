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

// Thailand Post Style Tracking Statuses
export const ORDER_STATUSES = [
  {
    id: 'ordered',
    step: 1,
    label: 'รับฝากสิ่งของเรียบร้อย (โตเกียว ญี่ปุ่น)',
    labelShort: 'รับฝากสิ่งของ',
    location: 'ศูนย์รับฝากโตเกียว (TOKYO HUB)',
    description: 'รับคำสั่งซื้อและรับสิ่งของเข้าสู่คลังสินค้าที่ญี่ปุ่นเรียบร้อยแล้ว',
    color: 'bg-amber-50 text-amber-800 border-amber-300',
    badge: 'bg-amber-500',
    statusTag: 'รับฝาก',
    icon: 'PackageCheck'
  },
  {
    id: 'received_jp',
    step: 2,
    label: 'สิ่งของอยู่ระหว่างการขนส่ง (Japan Express ✈️)',
    labelShort: 'ระหว่างการขนส่ง',
    location: 'คลังสินค้านาริตะ / ท่าอากาศยานโตเกียว',
    description: 'สิ่งของผ่านการตรวจสอบศุลกากรญี่ปุ่น และอยู่ระหว่างเที่ยวบิน/การเดินทางสู่ประเทศไทย',
    color: 'bg-blue-50 text-blue-800 border-blue-300',
    badge: 'bg-blue-600',
    statusTag: 'ส่งต่อระหว่างประเทศ',
    icon: 'Plane'
  },
  {
    id: 'in_transit',
    step: 3,
    label: 'ถึงศูนย์คัดแยกไทย & ชั่งน้ำหนักจริง (ศป.สุวรรณภูมิ)',
    labelShort: 'ถึงศูนย์คัดแยกไทย',
    location: 'ศูนย์คัดแยกและกระจายสินค้า (THAILAND HUB)',
    description: 'สิ่งของถึงศูนย์คัดแยกประเทศไทย คัดแยก ชั่งน้ำหนักจริง และคำนวณค่าน้ำหนักเรียบร้อย',
    color: 'bg-purple-50 text-purple-800 border-purple-300',
    badge: 'bg-purple-600',
    statusTag: 'ชั่งน้ำหนักแล้ว',
    icon: 'Scale'
  },
  {
    id: 'arrived_th',
    step: 4,
    label: 'ออกใบแจ้งยอด & เตรียมการนำจ่าย',
    labelShort: 'เตรียมการนำจ่าย',
    location: 'ศูนย์ไปรษณีย์นำจ่ายปลายทาง',
    description: 'ออกใบแจ้งยอดค่าน้ำหนัก บรรจุพัสดุห่อหุ้ม และจัดเตรียมส่งมอบบริษัทขนส่งในไทย',
    color: 'bg-orange-50 text-orange-800 border-orange-300',
    badge: 'bg-orange-600',
    statusTag: 'พร้อมนำจ่าย',
    icon: 'Truck'
  },
  {
    id: 'delivered',
    step: 5,
    label: 'นำจ่ายสำเร็จ (จัดส่งถึงผู้รับเรียบร้อย) 📦',
    labelShort: 'นำจ่ายสำเร็จ',
    location: 'ที่อยู่ผู้รับปลายทาง (Destination)',
    description: 'พัสดุจัดส่งถึงมือผู้รับปลายทางเรียบร้อยแล้ว หรือส่งมอบพัสดุให้ขนส่งในประเทศพร้อมหมายเลขพัสดุ',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    badge: 'bg-emerald-600',
    statusTag: 'นำจ่ายสำเร็จ',
    icon: 'CheckCircle2'
  }
];

// Shipping Channels
export const SHIPPING_CHANNELS = [
  { id: 'air_express', name: 'Japan Express (ทางเครื่องบิน)', rateNote: 'เรท 280-350 ฿/กก.', defaultRate: 300 },
  { id: 'air_cargo', name: 'Japan Air Cargo (คาร์โก้ปกติ)', rateNote: 'เรท 220-260 ฿/กก.', defaultRate: 250 },
  { id: 'sea_cargo', name: 'Japan Sea Cargo (ทางเรือประหยัด)', rateNote: 'เรท 130-180 ฿/กก.', defaultRate: 150 },
];
