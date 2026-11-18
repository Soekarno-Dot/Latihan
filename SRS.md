# Software Requirements Specification (SRS)
## Social Media Intelligence & Social Network Analysis Dashboard

- Versi dokumen: 1.0
- Status: Draft baseline untuk MVP
- Deployment: Local/self-hosted via Docker
- Bahasa implementasi utama: TypeScript (Node.js)

## 1. Pendahuluan
### 1.1 Tujuan
Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional aplikasi dashboard terintegrasi untuk pengumpulan, pengelolaan, eksplorasi, dan analisis data media sosial menggunakan Social Network Analysis (SNA).

### 1.2 Ruang lingkup
Sistem menyediakan satu dashboard untuk:
1. mengumpulkan data berdasarkan target akun, keyword, hashtag, post, atau trending;
2. mengelola data dari beberapa platform melalui provider adapter;
3. menganalisis akun, postingan, komentar, mention, dan relasi yang tersedia;
4. membentuk graf interaktif dengan node dan edge;
5. menghitung metrik SNA yang dapat dipilih;
6. mengekspor data dan hasil analisis.

Sistem tidak menjanjikan akses ke data privat, tidak melewati kontrol akses platform, dan tidak mengasumsikan seluruh jenis relasi tersedia pada setiap platform.

### 1.3 Definisi
- SNA: Social Network Analysis.
- Node: entitas dalam graf (akun, post, hashtag, dll.).
- Edge: hubungan antar-node.
- Betweenness: centrality berdasarkan proporsi shortest path yang melewati node.
- Snapshot: representasi graf pada waktu dan filter tertentu.
- Provider: layanan sumber data eksternal, pada MVP EnsembleData.
- Target collection: pengambilan data berpusat pada akun/keyword/hashtag/post tertentu.
- Trending collection: pengambilan data trending sesuai dukungan endpoint/provider.

## 2. Gambaran umum
### 2.1 Perspektif produk
Aplikasi web lokal dengan frontend browser dan backend API/worker. Seluruh layanan dijalankan melalui Docker Compose. API key provider hanya berada di backend.

### 2.2 Kelas pengguna
- Administrator: konfigurasi provider, user, project, retention, dan sistem.
- Analyst: membuat collection, memilih metrik, mengeksplorasi graf, mengekspor hasil.
- Viewer: melihat dashboard dan hasil yang diizinkan.

Untuk MVP single-user lokal, autentikasi dapat dibuat sederhana namun struktur RBAC harus memungkinkan pengembangan multi-user.

### 2.3 Lingkungan operasi
- Docker Engine + Docker Compose.
- Browser modern.
- Node.js LTS di image container.
- PostgreSQL dan Redis dalam container.
- Koneksi internet diperlukan untuk mengakses EnsembleData.

### 2.4 Batasan desain
- Semua kredensial eksternal dikelola server-side.
- Skema internal harus platform-agnostic.
- Data mentah provider dapat berubah; normalisasi wajib.
- Ketersediaan field dan endpoint mengikuti platform, paket, dan dokumentasi provider.
- Analisis hanya valid sejauh data yang dikumpulkan cukup lengkap.

## 3. Kebutuhan fungsional
### FR-001 Dashboard terpadu
Sistem harus menyediakan satu dashboard utama yang menampilkan ringkasan project, collection job, akun, postingan, trending, dan hasil analisis.

### FR-002 Manajemen project
Sistem harus memungkinkan pengguna membuat, mengubah, memilih, dan mengarsipkan project analisis.

### FR-003 Konfigurasi sumber data
Sistem harus menyediakan konfigurasi provider EnsembleData melalui environment variable dan status koneksi tanpa mengekspos API key ke browser.

### FR-004 Collection berbasis target
Sistem harus menerima input platform, target type (username/account, post URL/ID, keyword, hashtag), query, rentang waktu, limit, dan jenis data yang ingin dikumpulkan.

### FR-005 Collection berbasis trending
Sistem harus menyediakan mode trending berdasarkan platform/region/kategori/periode jika endpoint provider mendukung parameter tersebut. Jika tidak tersedia, UI harus menandai fitur sebagai tidak didukung, bukan membuat data simulasi.

### FR-006 Background job
Sistem harus menjalankan pengumpulan data secara asynchronous, menampilkan status queued/running/succeeded/partial/failed, progress, waktu, dan pesan kesalahan yang aman.

### FR-007 Pagination dan rate limit
Worker harus menangani pagination, retry, backoff, timeout, dan pembatasan concurrency sesuai ketentuan provider.

### FR-008 Normalisasi data
Sistem harus menormalisasi data akun, post, komentar, hashtag, mention, dan relasi ke skema kanonis. Field yang tidak dikenal dapat disimpan dalam JSONB dengan kebijakan retensi.

### FR-009 Data explorer akun
Sistem harus menyediakan pencarian dan detail akun, termasuk platform, username/handle, nama tampilan, URL, metrik publik yang tersedia, dan daftar postingan yang terkumpul.

### FR-010 Data explorer postingan
Sistem harus menyediakan daftar/detail post, timestamp, teks/caption, URL, tipe media, engagement yang tersedia, hashtag, mention, dan komentar yang berhasil dikumpulkan.

### FR-011 Pembentukan graf
Sistem harus membangun graf dari data kanonis. Node dan edge wajib memiliki tipe, ID stabil, sumber data, dan provenance. Edge harus membedakan jenis relasi.

### FR-012 Visualisasi graf
Sistem harus menampilkan graf interaktif yang mendukung pan, zoom, select node/edge, tooltip, filter, highlight neighborhood, dan penyesuaian layout.

### FR-013 Animasi graf
Sistem harus mendukung animasi transisi/layout atau penelusuran relasi. Animasi harus dapat dihentikan dan menghormati preferensi reduced motion.

### FR-014 Pemilihan metrik
Sistem harus menyediakan pemilihan satu atau beberapa metrik yang didukung:
- Degree centrality (in/out/total jika directed);
- Betweenness centrality;
- Closeness centrality;
- Eigenvector centrality;
- PageRank;
- Density;
- Community detection dan modularity (jika algoritma mendukung).

UI harus menjelaskan arti metrik dan batas interpretasinya.

### FR-015 Analisis berbasis snapshot
Setiap analysis run harus terikat pada graph snapshot, konfigurasi filter, parameter algoritma, dan versi implementasi.

### FR-016 Ranking dan detail metrik
Sistem harus menampilkan ranking node berdasarkan metrik yang dipilih, nilai numerik, normalisasi bila digunakan, serta tautan kembali ke node pada graf.

### FR-017 Community detection
Sistem harus dapat memberi label komunitas pada node untuk algoritma yang dipilih dan menampilkan legenda/warna komunitas.

### FR-018 Ekspor
Sistem harus mendukung ekspor hasil terpilih minimal ke CSV dan JSON. Format GraphML dapat menjadi fitur lanjutan.

### FR-019 Audit dan provenance
Sistem harus mencatat siapa/kapan menjalankan collection dan analisis, provider, parameter, sumber record, dan status job.

### FR-020 Penghapusan dan retensi
Administrator harus dapat menghapus project/dataset sesuai kebijakan retensi. Penghapusan harus mencakup data turunan atau menandainya invalid.

## 4. Kebutuhan antarmuka
### UI-001 Dashboard
Ringkasan KPI: jumlah akun, post, komentar, edge, collection aktif, dan analisis terbaru.

### UI-002 Collection panel
Form target/trending, platform, rentang waktu, limit, data type, dan validasi kapabilitas provider.

### UI-003 Graph workspace
Canvas graf dominan dengan panel filter, pilihan metrik, legenda node/edge, detail terpilih, dan kontrol layout.

### UI-004 Analysis panel
Daftar metrik, parameter, progress, ranking, community summary, dan riwayat run.

### UI-005 Data tables
Tabel akun/post/komentar dengan pencarian, filter, pagination, dan detail.

### UI-006 Settings
Status provider, konfigurasi non-secret, health layanan, dan retention.

## 5. Kebutuhan data
### 5.1 Entitas minimum
- Project
- DataSource
- CollectionJob
- SocialAccount
- Post
- Comment
- Hashtag
- PostHashtag
- AccountRelationship
- PostMention
- GraphSnapshot
- GraphNode
- GraphEdge
- AnalysisRun
- NodeMetric
- Community
- AuditLog

### 5.2 Aturan integritas
- Unique key akun: `(platform, platform_account_id)`; fallback handle hanya jika ID tidak tersedia dan harus ditandai.
- Unique key post: `(platform, platform_post_id)`.
- Simpan waktu dalam UTC.
- Simpan `raw_payload` dan `normalized_at`.
- Hindari duplikasi edge melalui unique key yang sesuai tipe relasi dan sumber record.
- Semua edge memiliki provenance dan relationship type.

### 5.3 Rekomendasi tabel
PostgreSQL merupakan database utama. Gunakan JSONB untuk atribut vendor tambahan; gunakan tabel relasional untuk field yang sering difilter/join. Partitioning dan Neo4j ditunda sampai kebutuhan skala terbukti.

## 6. Kebutuhan non-fungsional
### NFR-001 Local deployment
Seluruh komponen inti harus dapat dijalankan menggunakan Docker Compose.

### NFR-002 Security
API key tidak boleh muncul di frontend, log, source control, atau response API. Terapkan validasi input, CORS terbatas, rate limit API, dan sanitasi error.

### NFR-003 Privacy/compliance
Hanya kumpulkan data yang diizinkan oleh akses provider/platform dan ketentuan hukum. Sediakan retention dan deletion. Jangan mengumpulkan kredensial login akun target.

### NFR-004 Reliability
Job harus tahan terhadap restart worker, retry terbatas, dan tidak membuat duplikasi data saat diproses ulang (idempotent).

### NFR-005 Performance
Dashboard umum menargetkan response API p95 < 2 detik pada dataset MVP lokal. Analisis graf berjalan asynchronous dan tidak memblokir request HTTP.

### NFR-006 Scalability
Batas collection, pagination, queue concurrency, dan graph size harus dapat dikonfigurasi. Graf besar menggunakan sampling, clustering, atau neighborhood expansion.

### NFR-007 Maintainability
Backend TypeScript modular, provider adapter terisolasi, skema canonical terdokumentasi, dan test otomatis untuk normalizer/algoritma.

### NFR-008 Observability
Sediakan structured logs, health checks, job status, durasi proses, error category, dan pemakaian kuota jika tersedia.

### NFR-009 Accessibility
Kontrol graf memiliki alternatif tabel/ranking. UI mendukung keyboard untuk kontrol utama dan reduced motion.

### NFR-010 Backup
Dokumentasikan backup/restore PostgreSQL dan uji pemulihan data.

## 7. Aturan bisnis
- BR-001: hanya data publik/diizinkan yang dapat diproses.
- BR-002: ketiadaan data relasi tidak boleh diganti dengan relasi hasil asumsi.
- BR-003: edge mention, comment, follow, dan reshare adalah tipe berbeda.
- BR-004: metrik dihitung pada snapshot dan filter tertentu.
- BR-005: nilai metrik tidak boleh dipakai sebagai bukti tunggal perilaku/niat/identitas.
- BR-006: jika provider tidak mendukung target/platform/field, sistem menampilkan status unsupported.
- BR-007: setiap hasil analisis menyimpan parameter dan versi algoritma.

## 8. Use cases
### UC-001 Mengumpulkan akun target
1. Analyst memilih project.
2. Analyst memilih platform dan mode target.
3. Analyst memasukkan username/ID serta rentang waktu dan limit.
4. Sistem memvalidasi dukungan provider.
5. Sistem membuat collection job.
6. Worker mengumpulkan, menyimpan, dan menormalisasi data.
7. Dashboard menampilkan hasil dan status.

### UC-002 Mengumpulkan trending
1. Analyst memilih mode trending.
2. Analyst memilih platform/region/periode jika tersedia.
3. Sistem memvalidasi endpoint.
4. Worker mengambil hasil dan menyimpan data.
5. Dashboard menampilkan tren dan sumber.

### UC-003 Menjalankan analisis SNA
1. Analyst memilih dataset dan filter relasi.
2. Sistem membentuk graph snapshot.
3. Analyst memilih metrik dan parameter.
4. Worker menghitung metrik.
5. Sistem menyimpan hasil dan ranking.
6. Dashboard memvisualisasikan graf dan hasil.

### UC-004 Eksplorasi node
1. Analyst memilih node.
2. Sistem menampilkan detail entitas dan metrik.
3. Analyst memperluas neighborhood dengan depth/limit.
4. Sistem mengambil subgraph sesuai filter.

## 9. Acceptance criteria MVP
- AC-001 Docker Compose dapat menjalankan web, API, worker, PostgreSQL, dan Redis.
- AC-002 Health check API berhasil.
- AC-003 API key provider hanya tersedia di backend.
- AC-004 User dapat membuat collection job target.
- AC-005 Worker dapat memproses job dengan provider adapter mock/test tanpa akses vendor.
- AC-006 Normalizer menyimpan akun/post/comment dan provenance.
- AC-007 Graph API mengembalikan node dan edge bertipe.
- AC-008 User dapat memilih Betweenness dan minimal Degree/PageRank untuk analisis.
- AC-009 Graf dapat menampilkan node, edge, filter, zoom, dan detail node.
- AC-010 Hasil analisis dapat diekspor JSON/CSV.
- AC-011 Kegagalan/unsupported endpoint ditampilkan dengan pesan yang aman.
- AC-012 Dokumen backup, konfigurasi, dan batasan data tersedia.

## 10. Risiko dan mitigasi
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Perubahan endpoint/response EnsembleData | Ingestion gagal | Adapter terisolasi, schema validation, contract tests |
| Field relasi tidak tersedia | Graf tidak lengkap | Tampilkan coverage dan provenance |
| Rate limit/kuota/biaya | Job tertunda/biaya meningkat | Budget cap, throttling, max pages, usage tracking |
| Graf terlalu besar | UI/API lambat | Subgraph, sampling, clustering, worker |
| Bias data | Interpretasi salah | Tampilkan periode, sumber, missingness, keterbatasan |
| Data sensitif/retensi | Risiko privasi | Minimasi, masking, retention/deletion |

## 11. Out of scope MVP
- Prediksi identitas atau atribusi individu.
- Akses akun privat atau bypass autentikasi.
- Pengiriman pesan/aksi ke akun media sosial.
- Real-time streaming penuh jika provider tidak menyediakan.
- Analisis sentimen/LLM sebagai fitur wajib.
- Neo4j dan distributed deployment sebelum kebutuhan skala tervalidasi.

## 12. Pertanyaan terbuka sebelum implementasi produksi
1. Platform prioritas pertama (misalnya Instagram, TikTok, YouTube, X, Reddit).
2. Endpoint dan paket EnsembleData yang tersedia.
3. Definisi relasi utama: follow, mention, comment, reply, reshare, atau kombinasi.
4. Batas jumlah post/comment per collection dan rentang histori.
5. Single-user lokal atau multi-user dengan autentikasi.
6. Target ukuran graf dan kebutuhan ekspor.
