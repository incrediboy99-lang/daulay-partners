package database

import (
	"daulay-partners/models"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "host=localhost user=postgres password=postgres dbname=daulay_partners port=5432 sslmode=disable"
	}
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	fmt.Println("✅ Connected to PostgreSQL")

	// Auto migrate
	DB.AutoMigrate(&models.Decision{})
	fmt.Println("✅ Database migrated")

	// Seed if empty
	var count int64
	DB.Model(&models.Decision{}).Count(&count)
	if count == 0 {
		seed()
	}
}

func seed() {
	decisions := []models.Decision{
		{Category: "perdata", Number: "No. 245/Pdt.G/2025/PN.Jkt.Sel", Title: "Sengketa Perjanjian Kerjasama Bisnis", Parties: "PT Maju Bersama vs CV Karya Mandiri", Date: "12 Mei 2026", Status: "won", StatusLabel: "Dikabulkan", Judge: "Dr. H. Ahmad Fauzi, S.H., M.H.", Court: "PN Jakarta Selatan", Summary: "Majelis hakim mengabulkan gugatan penggugat terkait wanprestasi perjanjian kerjasama bisnis. Tergugat diwajibkan membayar ganti rugi materiil sebesar Rp 2.5 miliar beserta bunga keterlambatan sebesar 6% per tahun."},
		{Category: "pidana", Number: "No. 112/Pid.B/2025/PN.Jkt.Pst", Title: "Tindak Pidana Penipuan Investasi", Parties: "JPU vs Hendra Wijaya", Date: "8 Mei 2026", Status: "won", StatusLabel: "Terbukti Bersalah", Judge: "Hj. Siti Nurhaliza, S.H., M.Hum.", Court: "PN Jakarta Pusat", Summary: "Terdakwa terbukti melakukan tindak pidana penipuan investasi bodong yang merugikan 150 nasabah. Dijatuhi hukuman penjara 8 tahun dan denda Rp 1 miliar."},
		{Category: "tun", Number: "No. 78/G/2025/PTUN.Jkt", Title: "Pembatalan Izin Mendirikan Bangunan", Parties: "PT Graha Sentosa vs Kepala Dinas PTSP DKI Jakarta", Date: "5 Mei 2026", Status: "won", StatusLabel: "Dikabulkan", Judge: "Dr. Bambang Sutrisno, S.H., M.H.", Court: "PTUN Jakarta", Summary: "Majelis hakim membatalkan keputusan pencabutan IMB. Keputusan dinyatakan cacat prosedur."},
		{Category: "niaga", Number: "No. 35/Pdt.Sus-PKPU/2025/PN.Niaga.Jkt.Pst", Title: "Permohonan PKPU PT Sejahtera Abadi", Parties: "BNI vs PT Sejahtera Abadi", Date: "1 Mei 2026", Status: "ongoing", StatusLabel: "Dalam Proses", Judge: "Dr. Ir. Wahyu Prakoso, S.H., M.Kn.", Court: "PN Niaga Jakarta Pusat", Summary: "Majelis hakim mengabulkan permohonan PKPU Sementara selama 45 hari."},
		{Category: "perdata", Number: "No. 189/Pdt.G/2025/PN.Bdg", Title: "Sengketa Kepemilikan Tanah dan Bangunan", Parties: "Keluarga Suryadi vs PT Bumi Properti Indonesia", Date: "28 Apr 2026", Status: "won", StatusLabel: "Dikabulkan Sebagian", Judge: "H. Ridwan Mansur, S.H., M.H.", Court: "PN Bandung", Summary: "Gugatan dikabulkan sebagian. Tanah seluas 5.000 m2 dinyatakan sah milik penggugat."},
		{Category: "pidana", Number: "No. 67/Pid.Sus-TPK/2025/PN.Jkt.Pst", Title: "Tindak Pidana Korupsi Dana Infrastruktur", Parties: "KPK vs Ir. Budi Santoso, M.M.", Date: "22 Apr 2026", Status: "won", StatusLabel: "Terbukti Bersalah", Judge: "Prof. Dr. Maria Theresia, S.H., LL.M.", Court: "Pengadilan Tipikor Jakarta", Summary: "Terdakwa terbukti melakukan korupsi proyek infrastruktur senilai Rp 45 miliar. Dijatuhi 12 tahun penjara."},
		{Category: "niaga", Number: "No. 22/Pdt.Sus-HKI/2025/PN.Niaga.Jkt.Pst", Title: "Pelanggaran Merek Dagang Terdaftar", Parties: "PT Kopi Nusantara vs CV Kopi Nusantara Jaya", Date: "15 Apr 2026", Status: "won", StatusLabel: "Dikabulkan", Judge: "Dr. Lestari Wulandari, S.H., M.H.", Court: "PN Niaga Jakarta Pusat", Summary: "Tergugat terbukti menggunakan merek dagang dengan persamaan pada pokoknya."},
		{Category: "tun", Number: "No. 55/G/2025/PTUN.Sby", Title: "Gugatan Pembatalan SK Pemberhentian PNS", Parties: "Drs. Agus Setiawan vs BKD Prov. Jawa Timur", Date: "10 Apr 2026", Status: "lost", StatusLabel: "Ditolak", Judge: "H. Supriyanto, S.H., M.H.", Court: "PTUN Surabaya", Summary: "Majelis hakim menolak gugatan. SK Pemberhentian dinyatakan sah dan sesuai prosedur."},
		{Category: "perdata", Number: "No. 301/Pdt.G/2025/PN.Jkt.Bar", Title: "Sengketa Hak Waris atas Aset Perusahaan", Parties: "Keluarga Hartono vs PT Hartono Group", Date: "3 Apr 2026", Status: "ongoing", StatusLabel: "Dalam Proses", Judge: "Dr. Dewi Kartika, S.H., M.Kn.", Court: "PN Jakarta Barat", Summary: "Gugatan waris atas kepemilikan 40% saham PT Hartono Group. Sidang pembuktian masih berlangsung."},
	}
	DB.Create(&decisions)
	fmt.Println("✅ Seeded 9 decisions")
}
