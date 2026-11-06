-- QCare: database PostgreSQL
-- Jalankan setelah membuat database bernama qcare_db.

CREATE TABLE IF NOT EXISTS antrean (
    id SERIAL PRIMARY KEY,
    nama_pasien VARCHAR(100) NOT NULL,
    nama_fasilitas VARCHAR(150) NOT NULL,
    jenis_layanan VARCHAR(100) NOT NULL,
    kategori_pasien VARCHAR(50) NOT NULL,
    kebutuhan_khusus TEXT,
    nomor_antrean VARCHAR(20) NOT NULL,
    status_antrean VARCHAR(20) NOT NULL DEFAULT 'Menunggu'
        CHECK (status_antrean IN ('Menunggu', 'Dipanggil', 'Selesai')),
    tanggal_daftar TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
