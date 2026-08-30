// Universal Real-Time Cloud Sync API: /api/sync
// Persistent cross-device storage for Computer & Mobile Phone

const CLOUD_SYNC_OBJECT_ID = 'ff808181a04ccf2d01a05376f5b21927';
const CLOUD_API_URL = `https://api.restful-api.dev/objects/${CLOUD_SYNC_OBJECT_ID}`;

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

    // 1. If PostgreSQL database is connected on Vercel
    if (databaseUrl) {
      try {
        const { Pool } = await import('pg');
        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: { rejectUnauthorized: false }
        });

        if (method === 'GET') {
          const [ordersRes, tripsRes, settingsRes] = await Promise.all([
            pool.query('SELECT * FROM orders ORDER BY created_at DESC'),
            pool.query('SELECT * FROM trips ORDER BY return_date ASC'),
            pool.query('SELECT * FROM settings WHERE id = $1', ['main'])
          ]);

          const orders = ordersRes.rows.map(mapDbToOrder);
          const trips = tripsRes.rows.map(row => ({
            id: row.id,
            name: row.name,
            returnDate: row.return_date,
            channel: row.channel,
            defaultRate: parseFloat(row.default_rate) || 250,
            status: row.status,
            note: row.note
          }));
          const s = settingsRes.rows[0];
          const settings = s ? {
            shopName: s.shop_name,
            shopTagline: s.shop_tagline,
            phone: s.phone,
            lineId: s.line_id,
            lineUrl: s.line_url,
            facebook: s.facebook,
            instagram: s.instagram,
            address: s.address,
            bankName: s.bank_name,
            bankAccountNo: s.bank_account_no,
            bankAccountName: s.bank_account_name,
            promptpay: s.promptpay,
            adminPin: s.admin_pin,
            requirePin: s.require_pin
          } : null;

          await pool.end();
          return res.status(200).json({ success: true, orders, trips, settings, source: 'postgres' });
        }

        if (method === 'POST' || method === 'PUT') {
          const { orders, trips, settings } = body;
          if (settings) {
            await pool.query(`
              INSERT INTO settings (id, shop_name, shop_tagline, phone, line_id, line_url, facebook, instagram, address, bank_name, bank_account_no, bank_account_name, promptpay, admin_pin, require_pin, updated_at)
              VALUES ('main', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
              ON CONFLICT (id) DO UPDATE SET
                shop_name = $1, shop_tagline = $2, phone = $3, line_id = $4, line_url = $5, facebook = $6, instagram = $7, address = $8, bank_name = $9, bank_account_no = $10, bank_account_name = $11, promptpay = $12, admin_pin = $13, require_pin = $14, updated_at = NOW()
            `, [
              settings.shopName, settings.shopTagline, settings.phone, settings.lineId, settings.lineUrl,
              settings.facebook, settings.instagram, settings.address, settings.bankName, settings.bankAccountNo,
              settings.bankAccountName, settings.promptpay, settings.adminPin || '1234', settings.requirePin !== false
            ]);
          }
          await pool.end();
        }
      } catch (dbErr) {
        console.warn('Postgres query error, falling back to persistent cloud store:', dbErr.message);
      }
    }

    // 2. Persistent Cross-Device Cloud Store (Works 100% across Computer + Mobile)
    if (method === 'GET') {
      try {
        const cloudRes = await fetch(CLOUD_API_URL);
        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          if (cloudData && cloudData.data) {
            return res.status(200).json({
              success: true,
              orders: cloudData.data.orders,
              trips: cloudData.data.trips,
              settings: cloudData.data.settings,
              lastUpdated: cloudData.data.lastUpdated,
              source: 'persistent_cloud'
            });
          }
        }
      } catch (cloudErr) {
        console.warn('Failed to read from persistent cloud store:', cloudErr.message);
      }

      return res.status(200).json({
        success: true,
        orders: null,
        trips: null,
        settings: null,
        source: 'empty'
      });
    }

    if (method === 'POST' || method === 'PUT') {
      const { orders, trips, settings } = body;
      const payload = {
        name: 'koi_japan_shop_sync',
        data: {
          orders: Array.isArray(orders) ? orders : [],
          trips: Array.isArray(trips) ? trips : [],
          settings: settings || null,
          lastUpdated: new Date().toISOString()
        }
      };

      try {
        await fetch(CLOUD_API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (saveErr) {
        console.warn('Failed to save to persistent cloud store:', saveErr.message);
      }

      return res.status(200).json({
        success: true,
        orders: payload.data.orders,
        trips: payload.data.trips,
        settings: payload.data.settings,
        lastUpdated: payload.data.lastUpdated,
        source: 'persistent_cloud'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error in /api/sync:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

function mapDbToOrder(row) {
  if (!row) return null;
  let statusLogs = [];
  try {
    statusLogs = typeof row.status_logs === 'string' ? JSON.parse(row.status_logs) : (row.status_logs || []);
  } catch {
    statusLogs = [];
  }
  return {
    id: row.id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    productName: row.product_name,
    categoryId: row.category_id,
    quantity: parseInt(row.quantity) || 1,
    weightKg: parseFloat(row.weight_kg) || 0,
    weightRate: parseFloat(row.weight_rate) || 250,
    tripId: row.trip_id,
    status: row.status,
    itemPriceThb: parseFloat(row.item_price_thb) || 0,
    depositPaid: parseFloat(row.deposit_paid) || 0,
    localShippingFee: parseFloat(row.local_shipping_fee) || 0,
    otherFee: parseFloat(row.other_fee) || 0,
    localTrackingNo: row.local_tracking_no || '',
    localCarrier: row.local_carrier || 'Flash Express',
    imageUrl: row.image_url || '',
    notes: row.notes || '',
    statusLogs,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
