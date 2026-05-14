import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

let initialized = false;
async function init() {
  if (initialized) return;
  await sql`CREATE TABLE IF NOT EXISTS decisions (id SERIAL PRIMARY KEY, category VARCHAR(50) NOT NULL, number VARCHAR(255) NOT NULL, title VARCHAR(500) NOT NULL, parties VARCHAR(500) NOT NULL, date VARCHAR(100) NOT NULL, status VARCHAR(50) NOT NULL, status_label VARCHAR(100) NOT NULL, judge VARCHAR(255), court VARCHAR(255), summary TEXT, pdf_path VARCHAR(500), created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW())`;
  const c = await sql`SELECT COUNT(*) as c FROM decisions`;
  if (parseInt(c[0].c) === 0) {
    await sql`INSERT INTO decisions (category,number,title,parties,date,status,status_label,judge,court,summary) VALUES
    ('perdata','No. 245/Pdt.G/2025/PN.Jkt.Sel','Sengketa Perjanjian Kerjasama Bisnis','PT Maju Bersama vs CV Karya Mandiri','12 Mei 2026','won','Dikabulkan','Dr. H. Ahmad Fauzi, S.H., M.H.','PN Jakarta Selatan','Majelis hakim mengabulkan gugatan penggugat terkait wanprestasi. Tergugat membayar ganti rugi Rp 2.5 miliar.'),
    ('pidana','No. 112/Pid.B/2025/PN.Jkt.Pst','Tindak Pidana Penipuan Investasi','JPU vs Hendra Wijaya','8 Mei 2026','won','Terbukti Bersalah','Hj. Siti Nurhaliza, S.H., M.Hum.','PN Jakarta Pusat','Terdakwa terbukti melakukan penipuan investasi bodong. Dijatuhi 8 tahun penjara.'),
    ('tun','No. 78/G/2025/PTUN.Jkt','Pembatalan Izin Mendirikan Bangunan','PT Graha Sentosa vs Kepala Dinas PTSP DKI','5 Mei 2026','won','Dikabulkan','Dr. Bambang Sutrisno, S.H., M.H.','PTUN Jakarta','Majelis hakim membatalkan pencabutan IMB. Keputusan cacat prosedur.'),
    ('niaga','No. 35/Pdt.Sus-PKPU/2025/PN.Niaga.Jkt.Pst','Permohonan PKPU PT Sejahtera Abadi','BNI vs PT Sejahtera Abadi','1 Mei 2026','ongoing','Dalam Proses','Dr. Ir. Wahyu Prakoso, S.H., M.Kn.','PN Niaga Jakarta Pusat','PKPU Sementara dikabulkan selama 45 hari.'),
    ('perdata','No. 189/Pdt.G/2025/PN.Bdg','Sengketa Kepemilikan Tanah','Keluarga Suryadi vs PT Bumi Properti','28 Apr 2026','won','Dikabulkan Sebagian','H. Ridwan Mansur, S.H., M.H.','PN Bandung','Tanah 5.000 m2 dinyatakan sah milik penggugat.'),
    ('pidana','No. 67/Pid.Sus-TPK/2025/PN.Jkt.Pst','Korupsi Dana Infrastruktur','KPK vs Ir. Budi Santoso','22 Apr 2026','won','Terbukti Bersalah','Prof. Dr. Maria Theresia, S.H., LL.M.','Pengadilan Tipikor Jakarta','Korupsi Rp 45 miliar. Dijatuhi 12 tahun penjara.'),
    ('niaga','No. 22/Pdt.Sus-HKI/2025/PN.Niaga.Jkt.Pst','Pelanggaran Merek Dagang','PT Kopi Nusantara vs CV Kopi Nusantara Jaya','15 Apr 2026','won','Dikabulkan','Dr. Lestari Wulandari, S.H., M.H.','PN Niaga Jakarta Pusat','Tergugat terbukti menggunakan merek dagang serupa.'),
    ('tun','No. 55/G/2025/PTUN.Sby','Gugatan Pembatalan SK PNS','Drs. Agus Setiawan vs BKD Jatim','10 Apr 2026','lost','Ditolak','H. Supriyanto, S.H., M.H.','PTUN Surabaya','SK Pemberhentian dinyatakan sah.'),
    ('perdata','No. 301/Pdt.G/2025/PN.Jkt.Bar','Sengketa Hak Waris','Keluarga Hartono vs PT Hartono Group','3 Apr 2026','ongoing','Dalam Proses','Dr. Dewi Kartika, S.H., M.Kn.','PN Jakarta Barat','Gugatan waris 40% saham. Sidang pembuktian berlangsung.')`;
  }
  initialized = true;
}
export { sql, init };
