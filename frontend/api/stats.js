import { neon } from '@neondatabase/serverless';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS decisions (id SERIAL PRIMARY KEY, category VARCHAR(50), number VARCHAR(255), title VARCHAR(500), parties VARCHAR(500), date VARCHAR(100), status VARCHAR(50), status_label VARCHAR(100), judge VARCHAR(255), court VARCHAR(255), summary TEXT, pdf_path VARCHAR(500), created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())`;
  const t = await sql`SELECT COUNT(*) as c FROM decisions`;
  const w = await sql`SELECT COUNT(*) as c FROM decisions WHERE status='won'`;
  const total = parseInt(t[0].c), won = parseInt(w[0].c);
  res.json({ total, win_rate: total > 0 ? Math.round(won/total*100) : 0, years: 15 });
}
