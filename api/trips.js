// Vercel Serverless API Route: /api/trips
// Handles Return Trips management for KOI Japan Shop

let memoryTrips = null;

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
    const { method, query, body } = req;
    const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

    if (databaseUrl) {
      const { Pool } = await import('pg');
      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false }
      });

      if (method === 'GET') {
        const result = await pool.query('SELECT * FROM trips ORDER BY return_date ASC');
        const trips = result.rows.map(row => ({
          id: row.id,
          name: row.name,
          returnDate: row.return_date,
          channel: row.channel || 'air_express',
          defaultRate: parseFloat(row.default_rate) || 250,
          status: row.status || 'open',
          note: row.note || ''
        }));
        await pool.end();
        return res.status(200).json({ success: true, trips });
      }

      if (method === 'POST') {
        const trip = body;
        const sql = `
          INSERT INTO trips (id, name, return_date, channel, default_rate, status, note)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;
        const params = [
          trip.id,
          trip.name,
          trip.returnDate,
          trip.channel || 'air_express',
          trip.defaultRate || 250,
          trip.status || 'open',
          trip.note || ''
        ];
        const result = await pool.query(sql, params);
        await pool.end();
        const row = result.rows[0];
        return res.status(201).json({
          success: true,
          trip: {
            id: row.id,
            name: row.name,
            returnDate: row.return_date,
            channel: row.channel,
            defaultRate: parseFloat(row.default_rate),
            status: row.status,
            note: row.note
          }
        });
      }

      if (method === 'PUT') {
        const trip = body;
        const sql = `
          UPDATE trips SET
            name = $2, return_date = $3, channel = $4, default_rate = $5, status = $6, note = $7
          WHERE id = $1
          RETURNING *
        `;
        const params = [
          trip.id,
          trip.name,
          trip.returnDate,
          trip.channel || 'air_express',
          trip.defaultRate || 250,
          trip.status || 'open',
          trip.note || ''
        ];
        const result = await pool.query(sql, params);
        await pool.end();
        const row = result.rows[0];
        return res.status(200).json({
          success: true,
          trip: {
            id: row.id,
            name: row.name,
            returnDate: row.return_date,
            channel: row.channel,
            defaultRate: parseFloat(row.default_rate),
            status: row.status,
            note: row.note
          }
        });
      }

      if (method === 'DELETE') {
        const { id } = query;
        await pool.query('DELETE FROM trips WHERE id = $1', [id]);
        await pool.end();
        return res.status(200).json({ success: true, deletedId: id });
      }
    }

    // Fallback: In-memory store
    if (!memoryTrips) {
      memoryTrips = [];
    }

    if (method === 'GET') {
      return res.status(200).json({ success: true, trips: memoryTrips, mode: 'memory_fallback' });
    }

    if (method === 'POST') {
      memoryTrips = [...memoryTrips.filter(t => t.id !== body.id), body];
      return res.status(201).json({ success: true, trip: body });
    }

    if (method === 'PUT') {
      memoryTrips = memoryTrips.map(t => t.id === body.id ? body : t);
      return res.status(200).json({ success: true, trip: body });
    }

    if (method === 'DELETE') {
      const { id } = query;
      memoryTrips = memoryTrips.filter(t => t.id !== id);
      return res.status(200).json({ success: true, deletedId: id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error in /api/trips:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
