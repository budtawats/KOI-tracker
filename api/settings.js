// Vercel Serverless API Route: /api/settings
// Handles Store Settings & Admin PIN

let memorySettings = {
  shopName: 'KOI Japan Shop',
  shopTagline: 'บริการพรีออเดอร์ & ขนส่งสินค้าจากญี่ปุ่น ชั่งน้ำหนักจริง ส่งตรงถึงบ้าน',
  phone: '081-234-5678',
  lineId: '@koijapanshop',
  lineUrl: 'https://line.me',
  facebook: 'KOI Japan Shop',
  instagram: '@koijapan.shop',
  address: 'กรุงเทพมหานคร ประเทศไทย',
  bankName: 'กสิกรไทย (KBANK)',
  bankAccountNo: '123-4-56789-0',
  bankAccountName: 'KOI Japan Shop',
  promptpay: '081-234-5678',
  adminPin: '1234',
  requirePin: true
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, body } = req;
    const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (databaseUrl) {
      const { Pool } = await import('pg');
      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }
      });

      if (method === 'GET') {
        const result = await pool.query('SELECT * FROM settings WHERE id = $1', ['main']);
        let settings = memorySettings;
        if (result.rows.length > 0) {
          const row = result.rows[0];
          settings = {
            shopName: row.shop_name,
            shopTagline: row.shop_tagline,
            phone: row.phone,
            lineId: row.line_id,
            lineUrl: row.line_url,
            facebook: row.facebook,
            instagram: row.instagram,
            address: row.address,
            bankName: row.bank_name,
            bankAccountNo: row.bank_account_no,
            bankAccountName: row.bank_account_name,
            promptpay: row.promptpay,
            adminPin: row.admin_pin,
            requirePin: row.require_pin
          };
        }
        await pool.end();
        return res.status(200).json({ success: true, settings });
      }

      if (method === 'POST' || method === 'PUT') {
        const s = body;
        const sql = `
          INSERT INTO settings (
            id, shop_name, shop_tagline, phone, line_id, line_url, facebook, instagram,
            address, bank_name, bank_account_no, bank_account_name, promptpay, admin_pin, require_pin, updated_at
          ) VALUES (
            'main', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()
          ) ON CONFLICT (id) DO UPDATE SET
            shop_name = $1, shop_tagline = $2, phone = $3, line_id = $4, line_url = $5,
            facebook = $6, instagram = $7, address = $8, bank_name = $9, bank_account_no = $10,
            bank_account_name = $11, promptpay = $12, admin_pin = $13, require_pin = $14, updated_at = NOW()
          RETURNING *
        `;
        const params = [
          s.shopName,
          s.shopTagline || '',
          s.phone,
          s.lineId || '',
          s.lineUrl || '',
          s.facebook || '',
          s.instagram || '',
          s.address || '',
          s.bankName || '',
          s.bankAccountNo || '',
          s.bankAccountName || '',
          s.promptpay || '',
          s.adminPin || '1234',
          s.requirePin !== undefined ? s.requirePin : true
        ];

        const result = await pool.query(sql, params);
        await pool.end();
        return res.status(200).json({ success: true, settings: body });
      }
    }

    // Fallback: in-memory store
    if (method === 'GET') {
      return res.status(200).json({ success: true, settings: memorySettings });
    }

    if (method === 'POST' || method === 'PUT') {
      memorySettings = { ...memorySettings, ...body };
      return res.status(200).json({ success: true, settings: memorySettings });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error in /api/settings:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
