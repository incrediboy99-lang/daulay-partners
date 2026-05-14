import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// Auto-create table and seed on first request
let initialized = false;
async function init() {
  if (initialized) return;
  await sql`CREATE TABLE IF NOT EXISTS decisions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    number VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    parties VARCHAR(500) NOT NULL,
    date VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    status_label VARCHAR(100) NOT NULL,
    judge VARCHAR(255),
    court VARCHAR(255),
    summary TEXT,
    pdf_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`;
  const count = await sql`SELECT COUNT(*) as c FROM decisions`;
  if (parseInt(count[0].c) === 0) {
    await sql`INSERT INTO decisions (category,number,title,parties,date,status,status_label,judge,court,summary) VALUES
    ('perdata','No. 245/Pdt.G/2025/PN.Jkt.Sel','Sengketa Perjanjian Kerjasama Bisnis','PT Maju Bersama vs CV Karya Mandiri','12 Mei 2026','won','Dikabulkan','Dr. H. Ahmad Fauzi, S.H., M.H.','PN Jakarta Selatan','Majelis hakim mengabulkan gugatan penggugat terkait wanprestasi perjanjian kerjasama bisnis. Tergugat diwajibkan membayar ganti rugi materiil sebesar Rp 2.5 miliar.'),
    ('pidana','No. 112/Pid.B/2025/PN.Jkt.Pst','Tindak Pidana Penipuan Investasi','JPU vs Hendra Wijaya','8 Mei 2026','won','Terbukti Bersalah','Hj. Siti Nurhaliza, S.H., M.Hum.','PN Jakarta Pusat','Terdakwa terbukti melakukan tindak pidana penipuan investasi bodong yang merugikan 150 nasabah.'),
    ('tun','No. 78/G/2025/PTUN.Jkt','Pembatalan Izin Mendirikan Bangunan','PT Graha Sentosa vs Kepala Dinas PTSP DKI Jakarta','5 Mei 2026','won','Dikabulkan','Dr. Bambang Sutrisno, S.H., M.H.','PTUN Jakarta','Majelis hakim membatalkan keputusan pencabutan IMB. Keputusan dinyatakan cacat prosedur.'),
    ('niaga','No. 35/Pdt.Sus-PKPU/2025/PN.Niaga.Jkt.Pst','Permohonan PKPU PT Sejahtera Abadi','BNI vs PT Sejahtera Abadi','1 Mei 2026','ongoing','Dalam Proses','Dr. Ir. Wahyu Prakoso, S.H., M.Kn.','PN Niaga Jakarta Pusat','Majelis hakim mengabulkan permohonan PKPU Sementara selama 45 hari.'),
    ('perdata','No. 189/Pdt.G/2025/PN.Bdg','Sengketa Kepemilikan Tanah dan Bangunan','Keluarga Suryadi vs PT Bumi Properti Indonesia','28 Apr 2026','won','Dikabulkan Sebagian','H. Ridwan Mansur, S.H., M.H.','PN Bandung','Gugatan dikabulkan sebagian. Tanah seluas 5.000 m2 dinyatakan sah milik penggugat.'),
    ('pidana','No. 67/Pid.Sus-TPK/2025/PN.Jkt.Pst','Tindak Pidana Korupsi Dana Infrastruktur','KPK vs Ir. Budi Santoso, M.M.','22 Apr 2026','won','Terbukti Bersalah','Prof. Dr. Maria Theresia, S.H., LL.M.','Pengadilan Tipikor Jakarta','Terdakwa terbukti melakukan korupsi proyek infrastruktur senilai Rp 45 miliar. Dijatuhi 12 tahun penjara.'),
    ('niaga','No. 22/Pdt.Sus-HKI/2025/PN.Niaga.Jkt.Pst','Pelanggaran Merek Dagang Terdaftar','PT Kopi Nusantara vs CV Kopi Nusantara Jaya','15 Apr 2026','won','Dikabulkan','Dr. Lestari Wulandari, S.H., M.H.','PN Niaga Jakarta Pusat','Tergugat terbukti menggunakan merek dagang dengan persamaan pada pokoknya.'),
    ('tun','No. 55/G/2025/PTUN.Sby','Gugatan Pembatalan SK Pemberhentian PNS','Drs. Agus Setiawan vs BKD Prov. Jawa Timur','10 Apr 2026','lost','Ditolak','H. Supriyanto, S.H., M.H.','PTUN Surabaya','Majelis hakim menolak gugatan. SK Pemberhentian dinyatakan sah dan sesuai prosedur.'),
    ('perdata','No. 301/Pdt.G/2025/PN.Jkt.Bar','Sengketa Hak Waris atas Aset Perusahaan','Keluarga Hartono vs PT Hartono Group','3 Apr 2026','ongoing','Dalam Proses','Dr. Dewi Kartika, S.H., M.Kn.','PN Jakarta Barat','Gugatan waris atas kepemilikan 40% saham PT Hartono Group. Sidang pembuktian masih berlangsung.')`;
  }
  initialized = true;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  await init();

  const path = req.url.replace('/api/', '');

  // GET /api/decisions
  if (path.startsWith('decisions') && req.method === 'GET') {
    const id = path.split('/')[1];
    if (id) {
      const rows = await sql`SELECT * FROM decisions WHERE id=${id}`;
      return rows.length ? res.json({data: rows[0]}) : res.status(404).json({error:'Not found'});
    }
    const {category, search} = req.query || {};
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
    return res.json({data: rows, total: rows.length});
  }

  // GET /api/stats
  if (path === 'stats' && req.method === 'GET') {
    const total = await sql`SELECT COUNT(*) as c FROM decisions`;
    const won = await sql`SELECT COUNT(*) as c FROM decisions WHERE status='won'`;
    const t = parseInt(total[0].c), w = parseInt(won[0].c);
    return res.json({total: t, win_rate: t > 0 ? Math.round(w/t*100) : 0, years: 15});
  }

  // POST /api/admin/decisions
  if (path === 'admin/decisions' && req.method === 'POST') {
    const b = req.body;
    const rows = await sql`INSERT INTO decisions (category,number,title,parties,date,status,status_label,judge,court,summary) VALUES (${b.category},${b.number},${b.title},${b.parties},${b.date},${b.status},${b.status_label},${b.judge||''},${b.court||''},${b.summary||''}) RETURNING *`;
    return res.status(201).json({data: rows[0], message:'Putusan berhasil ditambahkan'});
  }

  // DELETE /api/admin/decisions/:id
  if (path.startsWith('admin/decisions/') && req.method === 'DELETE') {
    const id = path.split('/')[2];
    await sql`DELETE FROM decisions WHERE id=${id}`;
    return res.json({message:'Putusan berhasil dihapus'});
  }

  res.status(404).json({error:'Not found'});
}
