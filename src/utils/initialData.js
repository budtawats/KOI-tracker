export const INITIAL_TRIPS = [
  {
    id: 'trip-2026-09a',
    name: 'รอบบิน 15 ก.ย. 2026 (บินด่วน ✈️)',
    returnDate: '2026-09-15',
    channel: 'air_express',
    defaultRate: 280,
    status: 'open', // open, in_transit, completed
    note: 'รับหิ้วเครื่องสำอาง ขนม ฟิกเกอร์ บินตรงโตเกียว-กรุงเทพฯ'
  },
  {
    id: 'trip-2026-09b',
    name: 'รอบบิน 30 ก.ย. 2026 (รอบสิ้นเดือน)',
    returnDate: '2026-09-30',
    channel: 'air_cargo',
    defaultRate: 250,
    status: 'open',
    note: 'รอบทั่วไป รับทุกประเภทสินค้า'
  },
  {
    id: 'trip-2026-10-sea',
    name: 'รอบเรือ 15 ต.ค. 2026 (ประหยัด/ของหนัก 🚢)',
    returnDate: '2026-10-15',
    channel: 'sea_cargo',
    defaultRate: 150,
    status: 'open',
    note: 'เหมาะสำหรับของสะสมกล่องใหญ่ เสื้อผ้า สินค้ามีน้ำหนัก'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'KOI-JP26-1082',
    customerName: 'คุณธนภัทร สุขสมบูรณ์',
    customerPhone: '081-234-5678',
    customerAddress: '123/45 ถ.สุขุมวิท 71 แขวงพระโขนงเหนือ เขตวัฒนา กทม. 10110',
    productName: 'Tokyo Banana ขนมกล้วยยอดฮิต กล่อง 8 ชิ้น + Shiroi Koibito 18 ชิ้น',
    categoryId: 'snacks',
    quantity: 3,
    weightKg: 1.25,
    weightRate: 250,
    tripId: 'trip-2026-09a',
    status: 'in_transit',
    itemPriceThb: 1450,
    depositPaid: 1000,
    localShippingFee: 50,
    otherFee: 0,
    localTrackingNo: '',
    localCarrier: 'Flash Express',
    imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=500&auto=format&fit=crop&q=60',
    notes: 'กล่องขนมระวังบุบ ใส่บับเบิ้ลหนาๆ ด้วยครับ',
    createdAt: '2026-08-25T10:30:00.000Z',
    statusLogs: [
      { status: 'ordered', timestamp: '2026-08-25T10:30:00.000Z', note: 'รับออเดอร์และยืนยันยอดมัดจำ 1,000 บาท' },
      { status: 'received_jp', timestamp: '2026-08-27T14:20:00.000Z', note: 'สินค้าซื้อครบแล้ว นำเข้าจุดแพ็คสินค้าโตเกียว' },
      { status: 'in_transit', timestamp: '2026-08-29T18:00:00.000Z', note: 'เตรียมแพ็คลงกระเป๋ารอบบิน 15 ก.ย. 2026' }
    ]
  },
  {
    id: 'KOI-JP26-2194',
    customerName: 'คุณนลินรัตน์ ศิริพร',
    customerPhone: '089-876-5432',
    customerAddress: '88/19 หมู่บ้านแสนสิริ ถ.ราชพฤกษ์ ต.บางกร่าง อ.เมือง นนทบุรี 11000',
    productName: 'SK-II Facial Treatment Essence 230ml + ครีมกันแดด Anessa Gold',
    categoryId: 'cosmetics',
    quantity: 2,
    weightKg: 0.85,
    weightRate: 280,
    tripId: 'trip-2026-09a',
    status: 'arrived_th',
    itemPriceThb: 6200,
    depositPaid: 6200,
    localShippingFee: 60,
    otherFee: 0,
    localTrackingNo: 'TH01293848123A',
    localCarrier: 'Kerry Express',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=60',
    notes: 'ชั่งน้ำหนักเรียบร้อย 0.85 กก. ค่าน้ำหนัก 238 บาท รอจัดส่ง',
    createdAt: '2026-08-24T09:15:00.000Z',
    statusLogs: [
      { status: 'ordered', timestamp: '2026-08-24T09:15:00.000Z', note: 'สั่งซื้อจากเคาน์เตอร์ห้าง Ginza' },
      { status: 'received_jp', timestamp: '2026-08-26T11:00:00.000Z', note: 'สินค้าครบถ้วน พร้อมใบเสร็จญี่ปุ่น' },
      { status: 'in_transit', timestamp: '2026-08-28T08:00:00.000Z', note: 'ขึ้นเครื่องกลับไทย' },
      { status: 'arrived_th', timestamp: '2026-08-30T16:00:00.000Z', note: 'ถึงไทย ชั่งน้ำหนักจริง 0.85 กก. แพ็คเตรียมส่ง' }
    ]
  },
  {
    id: 'KOI-JP26-3401',
    customerName: 'คุณกิตติศักดิ์ พงษ์ไพศาล',
    customerPhone: '086-555-1234',
    customerAddress: '55 อาคารเลครัชดา ชั้น 12 ถ.รัชดาภิเษก คลองเตย กทม. 10110',
    productName: 'Bandai Metal Build Gundam Astray Red Frame Kai (กล่องใหญ่)',
    categoryId: 'figures',
    quantity: 1,
    weightKg: 2.60,
    weightRate: 250,
    tripId: 'trip-2026-09b',
    status: 'received_jp',
    itemPriceThb: 8900,
    depositPaid: 5000,
    localShippingFee: 90,
    otherFee: 0,
    localTrackingNo: '',
    localCarrier: 'Flash Express',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60',
    notes: 'กล่องคมกริบ เช็คสภาพที่โกดังญี่ปุ่นเรียบร้อย',
    createdAt: '2026-08-28T15:45:00.000Z',
    statusLogs: [
      { status: 'ordered', timestamp: '2026-08-28T15:45:00.000Z', note: 'กดสั่งซื้อจากเว็บ Tamashii Web Shop' },
      { status: 'received_jp', timestamp: '2026-08-30T13:10:00.000Z', note: 'พัสดุส่งถึงโกดังญี่ปุ่นแล้ว ตรวจสอบกล่องสภาพสมบูรณ์' }
    ]
  },
  {
    id: 'KOI-JP26-4512',
    customerName: 'คุณศศิธร วงศ์เจริญ',
    customerPhone: '092-444-9988',
    customerAddress: '402 หมู่ 4 ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200',
    productName: 'เสื้อกันหนาว Uniqlo Hybrid Down Jacket + ถุงเท้า Heattech 3 คู่',
    categoryId: 'fashion',
    quantity: 4,
    weightKg: 1.40,
    weightRate: 250,
    tripId: 'trip-2026-09b',
    status: 'ordered',
    itemPriceThb: 3850,
    depositPaid: 2000,
    localShippingFee: 60,
    otherFee: 0,
    localTrackingNo: '',
    localCarrier: 'J&T Express',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&auto=format&fit=crop&q=60',
    notes: 'สีเบจ ไซส์ L สำหรับเสื้อ',
    createdAt: '2026-08-30T10:00:00.000Z',
    statusLogs: [
      { status: 'ordered', timestamp: '2026-08-30T10:00:00.000Z', note: 'รับออเดอร์เรียบร้อย รอซื้อหน้าร้าน Uniqlo Shinjuku' }
    ]
  },
  {
    id: 'KOI-JP26-5623',
    customerName: 'คุณปริญญา เลิศศิลป์',
    customerPhone: '083-999-7711',
    customerAddress: '789 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กทม. 10900',
    productName: 'DHC วิตามินซี 60 วัน (5 ซอง) + DHC Collagen 60 วัน (3 ซอง)',
    categoryId: 'vitamins',
    quantity: 8,
    weightKg: 0.65,
    weightRate: 280,
    tripId: 'trip-2026-09a',
    status: 'delivered',
    itemPriceThb: 1980,
    depositPaid: 2162,
    localShippingFee: 0,
    otherFee: 0,
    localTrackingNo: 'TH6629103948K',
    localCarrier: 'EMS ไปรษณีย์ไทย',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60',
    notes: 'จัดส่งพร้อมเลข EMS ลูกค้ารับของเรียบร้อย',
    createdAt: '2026-08-20T11:20:00.000Z',
    statusLogs: [
      { status: 'ordered', timestamp: '2026-08-20T11:20:00.000Z', note: 'รับออเดอร์' },
      { status: 'received_jp', timestamp: '2026-08-22T16:00:00.000Z', note: 'สินค้าครบถ้วน' },
      { status: 'in_transit', timestamp: '2026-08-25T14:00:00.000Z', note: 'เดินทางกลับไทย' },
      { status: 'arrived_th', timestamp: '2026-08-27T09:00:00.000Z', note: 'ชั่งน้ำหนัก 0.65 กก. ค่าน้ำหนัก 182 ฿' },
      { status: 'delivered', timestamp: '2026-08-28T11:30:00.000Z', note: 'ส่งมอบ EMS เลขพัสดุ TH6629103948K' }
    ]
  },
  {
    id: 'KOI-JP26-6734',
    customerName: 'คุณวราภรณ์ สดใส',
    customerPhone: '085-111-2233',
    customerAddress: '99/4 หมู่ 2 ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150',
    productName: 'Nintendo Switch OLED Pokémon Scarlet & Violet Edition',
    categoryId: 'gadgets',
    quantity: 1,
    weightKg: 1.80,
    weightRate: 300,
    tripId: 'trip-2026-10-sea',
    status: 'ordered',
    itemPriceThb: 10500,
    depositPaid: 5000,
    localShippingFee: 100,
    otherFee: 0,
    localTrackingNo: '',
    localCarrier: 'Kerry Express',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500&auto=format&fit=crop&q=60',
    notes: 'ส่งทางเรือประหยัด ป้องกันกระแทกอย่างดี',
    createdAt: '2026-08-29T14:00:00.000Z',
    statusLogs: [
      { status: 'ordered', timestamp: '2026-08-29T14:00:00.000Z', note: 'สั่งจองสินค้าเรียบร้อย' }
    ]
  }
];
