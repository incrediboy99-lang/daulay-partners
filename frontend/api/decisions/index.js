import { sql, init } from '../_db.js';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  await init();
  const { category, search } = req.query;
  let rows;
  if (category && category !== 'all' && search) {
    rows = await sql`SELECT * FROM decisions WHERE category=${category} AND (number ILIKE ${'%'+search+'%'} OR title ILIKE ${'%'+search+'%'} OR parties ILIKE ${'%'+search+'%'}) ORDER BY id DESC`;
  } else if (category && category !== 'all') {
    rows = await sql`SELECT * FROM decisions WHERE category=${category} ORDER BY id DESC`;
  } else if (search) {
    rows = await sql`SELECT * FROM decisions WHERE number ILIKE ${'%'+search+'%'} OR title ILIKE ${'%'+search+'%'} OR parties ILIKE ${'%'+search+'%'} ORDER BY id DESC`;
  } else {
    rows = await sql`SELECT * FROM decisions ORDER BY id DESC`;
  }
  res.json({ data: rows, total: rows.length });
}
