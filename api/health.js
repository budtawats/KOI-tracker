// Vercel Serverless API Route: /api/health
export default function handler(req, res) {
  const hasDb = !!(process.env.POSTGRES_URL || process.env.DATABASE_URL);
  res.status(200).json({
    status: 'ok',
    shop: 'KOI Japan Shop',
    time: new Date().toISOString(),
    databaseConnected: hasDb,
    platform: 'Vercel Serverless Functions'
  });
}
