# Social Media Intelligence & SNA Dashboard

Local-first dashboard untuk pengumpulan data media sosial publik, eksplorasi akun/postingan/trending, dan analisis Social Network Analysis (SNA).

## Fitur sasaran
- Satu dashboard untuk multi-platform dan multi-project.
- Pencarian berdasarkan target akun, kata kunci, hashtag, atau trending.
- Ingestion melalui adapter EnsembleData; provider lain dapat ditambahkan.
- Normalisasi akun, postingan, komentar, mention, hashtag, dan interaksi.
- Graf interaktif dengan node, edge, zoom, filter, tooltip, dan animasi.
- Pilihan metrik: Degree, Betweenness, Closeness, Eigenvector, PageRank, Density, serta Community Detection/Modularity.
- Job ingestion dan analisis berjalan di background.
- Docker Compose untuk menjalankan stack lokal.

## Stack
- Frontend: React, Vite, TypeScript, Cytoscape.js.
- Backend: Node.js, TypeScript, Express.
- Database: PostgreSQL + Prisma.
- Queue/cache: Redis + BullMQ.
- SNA: Graphology dan modul algoritma Graphology.
- Deployment: Docker Compose.

## Mulai cepat
1. Salin `.env.example` menjadi `.env`, lalu isi `ENSEMBLEDATA_API_KEY`.
2. Jalankan:
   ```bash
   docker compose up --build -d
   ```
3. API tersedia di `http://localhost:3000/health`.
4. Frontend tersedia di `http://localhost:5173`.

## Dashboard web
Dashboard MVP satu halaman berada di folder `app/`.

```bash
cd app
npm install
npm run dev
```

Dashboard dapat diakses di `http://localhost:5173`.

> Starter ini adalah fondasi proyek, bukan integrasi EnsembleData yang sudah tervalidasi end-to-end. Nama endpoint, parameter, pagination, kuota, dan bentuk respons harus dikonfirmasi terhadap dokumentasi serta paket akun EnsembleData yang digunakan. Implementasi provider sengaja diisolasi di `apps/api/src/providers/ensembledata/`.

## Struktur
```text
social-sna-dashboard/
├── apps/
│   ├── api/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── server.ts
│   │       ├── routes/
│   │       │   └── health.ts
│   │       └── providers/
│   │           └── ensembledata/
│   │               └── client.ts
│   └── web/
│       ├── Dockerfile
│       ├── nginx.conf
│       ├── package.json
│       ├── index.html
│       └── src/
│           ├── main.tsx
│           └── App.tsx
├── prisma/
│   └── schema.prisma
├── docs/
│   ├── ARCHITECTURE.md
│   └── SRS.md
├── .env.example
├── .gitignore
└── docker-compose.yml
```

## Model data yang direkomendasikan
Gunakan PostgreSQL sebagai source of truth. Simpan atribut provider yang berubah-ubah pada kolom JSONB `raw_payload`, tetapi kolom inti tetap dinormalisasi. Tabel inti:
- `workspaces`, `users`, `projects`
- `data_sources`, `collection_jobs`
- `social_accounts`, `posts`, `comments`
- `hashtags`, `post_hashtags`
- `account_relationships`, `post_mentions`
- `graph_snapshots`, `graph_nodes`, `graph_edges`
- `analysis_runs`, `node_metrics`, `communities`
- `audit_logs`

Relasi graf disimpan sebagai tabel edge agar mudah ditelusuri, diberi provenance, dan di-query. Untuk MVP tidak wajib menggunakan database graph terpisah. Pertimbangkan Neo4j hanya jika ukuran graf, pola query traversal, atau kebutuhan eksplorasi multi-hop sudah membenarkannya.

## Catatan SNA
SNA hanya dapat menghitung hubungan yang benar-benar tersedia dalam data hasil pengumpulan. Misalnya, follower/following tidak otomatis tersedia untuk semua platform/akun. Setiap edge harus memiliki `relationship_type`, `source`, `observed_at`, `weight`, dan tingkat keyakinan/provenance bila relevan. Jangan mengartikan edge mention sebagai edge follow.

## Keamanan dan penggunaan data
- Gunakan hanya data yang dapat diakses secara sah dan sesuai ketentuan platform/provider.
- Jangan meminta atau menyimpan password akun media sosial.
- API key disimpan di environment/secret, tidak pernah dikirim ke browser.
- Terapkan rate limit, batas kedalaman pengumpulan, retention policy, dan audit log.
- Sediakan mekanisme penghapusan data dan ekspor dataset.
- Hindari inferensi identitas sensitif atau keputusan berdampak tinggi dari skor graf.
