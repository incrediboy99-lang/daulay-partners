import { sql, init } from '../../_db.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  await init();
  const { id } = req.query;
  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM decisions WHERE id=${id}`;
    return rows.length ? res.json({ data: rows[0] }) : res.status(404).json({ error: 'Not found' });
  }
  if (req.method === 'DELETE') {
    await sql`DELETE FROM decisions WHERE id=${id}`;
    return res.json({ message: 'Putusan berhasil dihapus' });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
