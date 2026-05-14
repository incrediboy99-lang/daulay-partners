import { sql, init } from '../../_db.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  await init();
  if (req.method === 'POST') {
    const b = req.body;
    const rows = await sql`INSERT INTO decisions (category,number,title,parties,date,status,status_label,judge,court,summary) VALUES (${b.category},${b.number},${b.title},${b.parties},${b.date},${b.status},${b.status_label},${b.judge||''},${b.court||''},${b.summary||''}) RETURNING *`;
    return res.status(201).json({ data: rows[0], message: 'Putusan berhasil ditambahkan' });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
