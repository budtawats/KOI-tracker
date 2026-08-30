-- KOI Japan Shop Database Schema for PostgreSQL (Vercel Postgres / Supabase / Neon)

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT,
  product_name TEXT NOT NULL,
  category_id VARCHAR(50) DEFAULT 'snacks',
  quantity INTEGER DEFAULT 1,
  weight_kg NUMERIC(10, 2) DEFAULT 0,
  weight_rate NUMERIC(10, 2) DEFAULT 250,
  trip_id VARCHAR(50),
  status VARCHAR(50) DEFAULT 'ordered',
  item_price_thb NUMERIC(10, 2) DEFAULT 0,
  deposit_paid NUMERIC(10, 2) DEFAULT 0,
  local_shipping_fee NUMERIC(10, 2) DEFAULT 50,
  other_fee NUMERIC(10, 2) DEFAULT 0,
  local_tracking_no VARCHAR(100),
  local_carrier VARCHAR(100) DEFAULT 'Flash Express',
  image_url TEXT,
  notes TEXT,
  status_logs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Trips Table (รอบวันกลับ)
CREATE TABLE IF NOT EXISTS trips (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  return_date VARCHAR(50) NOT NULL,
  channel VARCHAR(50) DEFAULT 'air_express',
  default_rate NUMERIC(10, 2) DEFAULT 250,
  status VARCHAR(50) DEFAULT 'open',
  note TEXT
);

-- 3. Create Settings Table (ข้อมูลร้านค้า & รหัสผ่าน)
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
  shop_name VARCHAR(255) DEFAULT 'KOI Japan Shop',
  shop_tagline TEXT DEFAULT 'บริการพรีออเดอร์ & ขนส่งสินค้าจากญี่ปุ่น ชั่งน้ำหนักจริง ส่งตรงถึงบ้าน',
  phone VARCHAR(50) DEFAULT '081-234-5678',
  line_id VARCHAR(100) DEFAULT '@koijapanshop',
  line_url TEXT DEFAULT 'https://line.me',
  facebook VARCHAR(255) DEFAULT 'KOI Japan Shop',
  instagram VARCHAR(255) DEFAULT '@koijapan.shop',
  address TEXT DEFAULT 'กรุงเทพมหานคร ประเทศไทย',
  bank_name VARCHAR(100) DEFAULT 'กสิกรไทย (KBANK)',
  bank_account_no VARCHAR(100) DEFAULT '123-4-56789-0',
  bank_account_name VARCHAR(255) DEFAULT 'KOI Japan Shop',
  promptpay VARCHAR(50) DEFAULT '081-234-5678',
  admin_pin VARCHAR(50) DEFAULT '1234',
  require_pin BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Settings if not exists
INSERT INTO settings (id, shop_name, phone, line_id, admin_pin)
VALUES ('main', 'KOI Japan Shop', '081-234-5678', '@koijapanshop', '1234')
ON CONFLICT (id) DO NOTHING;
