import { sql, init } from '../../../_db.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  await init();
  const { id } = req.query;
  if (req.method === 'PUT') {
    const b = req.body;
    const rows = await sql`UPDATE decisions SET category=${b.category},number=${b.number},title=${b.title},parties=${b.parties},date=${b.date},status=${b.status},status_label=${b.status_label},judge=${b.judge||''},court=${b.court||''},summary=${b.summary||''},updated_at=NOW() WHERE id=${id} RETURNING *`;
    return res.json({ data: rows[0], message: 'Putusan berhasil diupdate' });
  }
  if (req.method === 'DELETE') {
    await sql`DELETE FROM decisions WHERE id=${id}`;
    return res.json({ message: 'Putusan berhasil dihapus' });
  }
  res.status(405).json({ error: 'Method not allowed' });
}
