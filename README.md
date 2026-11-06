# QCare REST API

REST API untuk sistem antrean online fasilitas kesehatan QCare menggunakan Express.js dan PostgreSQL.

## 1. Persiapan
- Install Node.js.
- Buat project PostgreSQL di Neon melalui https://neon.tech.
- Buka SQL Editor pada project Neon, lalu jalankan seluruh isi file `database.sql`.

## 2. Menjalankan project
Di terminal VS Code, dari folder project:

```bash
npm install
```

Salin `.env.example` menjadi `.env`. Di Neon Dashboard, tekan **Connect**, pilih project dan database, lalu salin connection string (Pooled atau Direct) yang disediakan. Tempelkan connection string tersebut sebagai nilai `DATABASE_URL` di file `.env`.

```bash
npm run dev
```

Server berjalan pada `http://localhost:3000`.

## 3. Enam endpoint API

| Metode | URL | Fungsi |
|---|---|---|
| POST | `/api/antrean` | Menambah data antrean |
| GET | `/api/antrean` | Mendapatkan semua data |
| GET | `/api/antrean/1` | Mendapatkan data berdasarkan ID |
| PUT | `/api/antrean/1` | Memperbarui data berdasarkan ID |
| DELETE | `/api/antrean/1` | Menghapus data berdasarkan ID |
| GET | `/api/antrean/nama/Ahmad` | Mencari berdasarkan nama pasien |

## 4. Contoh body POST (JSON)

```json
{
  "nama_pasien": "Ahmad Fauzi",
  "nama_fasilitas": "Puskesmas Sehat",
  "jenis_layanan": "Pemeriksaan Umum",
  "kategori_pasien": "Umum",
  "kebutuhan_khusus": null,
  "nomor_antrean": "A001",
  "status_antrean": "Menunggu"
}
```

## 5. Contoh body PUT (JSON)

```json
{
  "status_antrean": "Dipanggil"
}
```

## 6. Import Postman
Import file `postman/QCare.postman_collection.json` ke Postman. Pastikan server aktif sebelum menjalankan request. Request menggunakan variabel `baseUrl` dengan nilai `http://localhost:3000`.

Urutan pengujian yang disarankan:
1. POST untuk membuat data.
2. GET semua data.
3. GET berdasarkan ID (gunakan ID yang dikembalikan POST).
4. GET berdasarkan nama pasien.
5. PUT berdasarkan ID.
6. DELETE berdasarkan ID (lakukan paling akhir).

## 7. dbdiagram.io
Buka https://dbdiagram.io, buat diagram baru, pilih DBML, lalu masukkan definisi berikut (atau gunakan fitur import SQL bila tersedia):

```dbml
Table antrean {
  id int [pk, increment]
  nama_pasien varchar(100) [not null]
  nama_fasilitas varchar(150) [not null]
  jenis_layanan varchar(100) [not null]
  kategori_pasien varchar(50) [not null]
  kebutuhan_khusus text
  nomor_antrean varchar(20) [not null]
  status_antrean varchar(20) [not null, default: 'Menunggu']
  tanggal_daftar timestamp [not null, default: `CURRENT_TIMESTAMP`]
}
```

Atur akses diagram menjadi publik melalui pengaturan Share, lalu salin tautan publik untuk dikumpulkan.

## Catatan
- Jangan mengunggah file `.env` atau folder `node_modules`.
- `.env.example` aman untuk dibagikan karena hanya berisi format contoh connection string. Simpan connection string Neon yang asli hanya di file `.env`.
- Jika connection string Neon berisi password, jangan pernah membagikannya di screenshot, laporan, atau repository publik.
- Screenshot hasil Postman harus diambil setelah request benar-benar dijalankan pada komputer dan database milik kelompok. File koleksi Postman bukan bukti screenshot pengujian.
