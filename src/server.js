const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// GET 1: mendapatkan seluruh data antrean
app.get('/api/antrean', asyncHandler(async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM antrean ORDER BY id ASC'
  );
  res.json({ message: 'Data antrean berhasil diambil', data: result.rows });
}));

// GET 2: mendapatkan data berdasarkan ID pada URL
app.get('/api/antrean/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID harus berupa bilangan bulat positif' });
  }
  const result = await pool.query('SELECT * FROM antrean WHERE id = $1', [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Data antrean tidak ditemukan' });
  }
  res.json({ data: result.rows[0] });
}));

// GET 3: mencari data berdasarkan nama pasien
app.get('/api/antrean/nama/:nama', asyncHandler(async (req, res) => {
  const nama = req.params.nama;
  const result = await pool.query(
    'SELECT * FROM antrean WHERE nama_pasien ILIKE $1 ORDER BY id ASC',
    [`%${nama}%`]
  );
  res.json({ jumlah: result.rowCount, data: result.rows });
}));

// POST: menambahkan data antrean baru
app.post('/api/antrean', asyncHandler(async (req, res) => {
  const {
    nama_pasien, nama_fasilitas, jenis_layanan, kategori_pasien,
    kebutuhan_khusus, nomor_antrean, status_antrean
  } = req.body;

  if (!nama_pasien || !nama_fasilitas || !jenis_layanan ||
      !kategori_pasien || !nomor_antrean) {
    return res.status(400).json({
      message: 'nama_pasien, nama_fasilitas, jenis_layanan, kategori_pasien, dan nomor_antrean wajib diisi'
    });
  }

  const result = await pool.query(
    `INSERT INTO antrean
      (nama_pasien, nama_fasilitas, jenis_layanan, kategori_pasien,
       kebutuhan_khusus, nomor_antrean, status_antrean)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'Menunggu'))
     RETURNING *`,
    [nama_pasien, nama_fasilitas, jenis_layanan, kategori_pasien,
     kebutuhan_khusus || null, nomor_antrean, status_antrean || null]
  );
  res.status(201).json({ message: 'Data antrean berhasil ditambahkan', data: result.rows[0] });
}));

// PUT: memperbarui data antrean berdasarkan ID
app.put('/api/antrean/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID harus berupa bilangan bulat positif' });
  }

  const {
    nama_pasien, nama_fasilitas, jenis_layanan, kategori_pasien,
    kebutuhan_khusus, nomor_antrean, status_antrean
  } = req.body;

  const result = await pool.query(
    `UPDATE antrean SET
      nama_pasien = COALESCE($1, nama_pasien),
      nama_fasilitas = COALESCE($2, nama_fasilitas),
      jenis_layanan = COALESCE($3, jenis_layanan),
      kategori_pasien = COALESCE($4, kategori_pasien),
      kebutuhan_khusus = COALESCE($5, kebutuhan_khusus),
      nomor_antrean = COALESCE($6, nomor_antrean),
      status_antrean = COALESCE($7, status_antrean)
     WHERE id = $8
     RETURNING *`,
    [nama_pasien, nama_fasilitas, jenis_layanan, kategori_pasien,
     kebutuhan_khusus, nomor_antrean, status_antrean, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Data antrean tidak ditemukan' });
  }
  res.json({ message: 'Data antrean berhasil diperbarui', data: result.rows[0] });
}));

// DELETE: menghapus data antrean berdasarkan ID
app.delete('/api/antrean/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'ID harus berupa bilangan bulat positif' });
  }
  const result = await pool.query(
    'DELETE FROM antrean WHERE id = $1 RETURNING *', [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Data antrean tidak ditemukan' });
  }
  res.json({ message: 'Data antrean berhasil dihapus', data: result.rows[0] });
}));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === '23514') {
    return res.status(400).json({ message: 'Nilai status_antrean harus Menunggu, Dipanggil, atau Selesai' });
  }
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`QCare API berjalan di http://localhost:${PORT}`));
