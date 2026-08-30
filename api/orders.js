// Vercel Serverless API Route: /api/orders
// Handles CRUD operations for KOI Japan Shop orders

// In-memory / temporary edge store fallback if no external DB connected yet
let memoryOrders = null;

export default async function handler(req, res) {
  // Enable CORS
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
    const { method, query, body } = req;

    // Check if Postgres database connection is configured (e.g. Vercel Postgres / Supabase / Neon)
    const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (databaseUrl) {
      // Connect to PostgreSQL database
      const { Pool } = await import('pg');
      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }
      });

      if (method === 'GET') {
        const { q, id, tripId } = query;
        let sql = 'SELECT * FROM orders';
        const params = [];

        if (id) {
          sql += ' WHERE id = $1';
          params.push(id);
        } else if (q) {
          sql += ' WHERE id ILIKE $1 OR customer_name ILIKE $1 OR customer_phone ILIKE $1 OR local_tracking_no ILIKE $1';
          params.push(`%${q}%`);
        } else if (tripId && tripId !== 'all') {
          sql += ' WHERE trip_id = $1';
          params.push(tripId);
        }

        sql += ' ORDER BY created_at DESC';
        const result = await pool.query(sql, params);
        
        // Map database column names to camelCase for frontend
        const orders = result.rows.map(mapDbToOrder);
        await pool.end();
        return res.status(200).json({ success: true, orders });
      }

      if (method === 'POST') {
        const order = body;
        const sql = `
          INSERT INTO orders (
            id, customer_name, customer_phone, customer_address, product_name, 
            category_id, quantity, weight_kg, weight_rate, trip_id, status, 
            item_price_thb, deposit_paid, local_shipping_fee, other_fee, 
            local_tracking_no, local_carrier, image_url, notes, status_logs, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW()
          ) RETURNING *
        `;
        const params = [
          order.id,
          order.customerName,
          order.customerPhone || '',
          order.customerAddress || '',
          order.productName,
          order.categoryId || 'snacks',
          order.quantity || 1,
          order.weightKg || 0,
          order.weightRate || 250,
          order.tripId || '',
          order.status || 'ordered',
          order.itemPriceThb || 0,
          order.depositPaid || 0,
          order.localShippingFee || 50,
          order.otherFee || 0,
          order.localTrackingNo || '',
          order.localCarrier || 'Flash Express',
          order.imageUrl || '',
          order.notes || '',
          JSON.stringify(order.statusLogs || [])
        ];

        const result = await pool.query(sql, params);
        await pool.end();
        return res.status(201).json({ success: true, order: mapDbToOrder(result.rows[0]) });
      }

      if (method === 'PUT') {
        const order = body;
        const sql = `
          UPDATE orders SET
            customer_name = $2, customer_phone = $3, customer_address = $4, product_name = $5,
            category_id = $6, quantity = $7, weight_kg = $8, weight_rate = $9, trip_id = $10,
            status = $11, item_price_thb = $12, deposit_paid = $13, local_shipping_fee = $14,
            other_fee = $15, local_tracking_no = $16, local_carrier = $17, image_url = $18,
            notes = $19, status_logs = $20, updated_at = NOW()
          WHERE id = $1
          RETURNING *
        `;
        const params = [
          order.id,
          order.customerName,
          order.customerPhone || '',
          order.customerAddress || '',
          order.productName,
          order.categoryId || 'snacks',
          order.quantity || 1,
          order.weightKg || 0,
          order.weightRate || 250,
          order.tripId || '',
          order.status || 'ordered',
          order.itemPriceThb || 0,
          order.depositPaid || 0,
          order.localShippingFee || 50,
          order.otherFee || 0,
          order.localTrackingNo || '',
          order.localCarrier || 'Flash Express',
          order.imageUrl || '',
          order.notes || '',
          JSON.stringify(order.statusLogs || [])
        ];

        const result = await pool.query(sql, params);
        await pool.end();
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, error: 'Order not found' });
        }
        return res.status(200).json({ success: true, order: mapDbToOrder(result.rows[0]) });
      }

      if (method === 'DELETE') {
        const { id } = query;
        if (!id) return res.status(400).json({ success: false, error: 'Order ID is required' });

        await pool.query('DELETE FROM orders WHERE id = $1', [id]);
        await pool.end();
        return res.status(200).json({ success: true, deletedId: id });
      }
    }

    // Fallback: In-memory store (when DB URL not yet connected)
    if (!memoryOrders) {
      memoryOrders = [];
    }

    if (method === 'GET') {
      const { q, id } = query;
      let result = memoryOrders;
      if (id) {
        result = result.filter(o => o.id === id);
      } else if (q) {
        const lowerQ = q.toLowerCase();
        result = result.filter(o => 
          o.id.toLowerCase().includes(lowerQ) ||
          (o.customerName && o.customerName.toLowerCase().includes(lowerQ)) ||
          (o.customerPhone && o.customerPhone.includes(lowerQ)) ||
          (o.localTrackingNo && o.localTrackingNo.toLowerCase().includes(lowerQ))
        );
      }
      return res.status(200).json({ success: true, orders: result, mode: 'memory_fallback' });
    }

    if (method === 'POST') {
      const newOrder = { ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      memoryOrders = [newOrder, ...memoryOrders.filter(o => o.id !== newOrder.id)];
      return res.status(201).json({ success: true, order: newOrder });
    }

    if (method === 'PUT') {
      const updated = { ...body, updatedAt: new Date().toISOString() };
      memoryOrders = memoryOrders.map(o => o.id === updated.id ? updated : o);
      return res.status(200).json({ success: true, order: updated });
    }

    if (method === 'DELETE') {
      const { id } = query;
      memoryOrders = memoryOrders.filter(o => o.id !== id);
      return res.status(200).json({ success: true, deletedId: id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error in /api/orders:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

// Helper: map DB snake_case columns to frontend camelCase
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
