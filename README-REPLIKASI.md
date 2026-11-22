# README Replikasi — Nazuaf Privacy Test

Replikasi bersih dari `Ozanxzan/nazuaf-adblock-private` (fork AdBlockTest Turtlecute33).
Tujuan: situs yang **gampang diedit** — ubah CSS sedikit, hasilnya tidak rusak semua.

## Kenapa repo lama susah diedit — 4 penyebab

**1. Empat lapis CSS saling berantem (penyebab utama).**
Ada 45 file Sass → `css/index.css`, lalu `<style id="nazuaf-modern-ui">` di `index.ejs`
dengan **164 `!important`**, ditambah 10 lagi di `header.ejs`, ditambah CSS yang
disuntik JS saat runtime. Di dalamnya ada aturan yang saling menabrak, misal
`#adb_test>.grid` didefinisikan 1fr 1fr di satu tempat dan `minmax(0,1fr)` di
tempat lain — keduanya `!important`, jadi yang menang cuma urutan baris.
Ada juga selector tidak valid (` .#adb_test`) dan tiga sistem breakpoint
berbeda (Sass 40em/500px/768px vs inline 820px/600px/430px).

**2. PurgeCSS cuma jalan di build produksi, bukan di dev.**
`npm run dev` tampil benar, `npm run build` merusak — persis gejala yang Zan
alami. PurgeCSS menghapus selector yang tidak "terlihat" di HTML/JS hasil
build, tanpa safelist. Class bisa selamat cuma karena kebetulan namanya muncul
di JS (`.show` selamat karena ada `showCF`/`showSL`).

**3. DOM tes dibangun JS saat runtime + inline style.**
Grid hasil tes dibuat lewat `innerHTML`, warnanya disetel `div.style.background`,
dan selector skin membaca `[style*="var(--green)"]`. Ubah class atau struktur
sedikit saja, pasangan JS↔CSS itu putus. Ada juga `set_liquid()` yang menulis
`--liquid-*` ke `document.body.style`.

**4. DOM yang membangun ulang dirinya sendiri (sponsor).**
`sponsor.js` memakai class acak tiap load, menyuntik `<style>` runtime, dan
punya **MutationObserver yang membangun ulang node sponsor sampai 5x kalau
node itu disembunyikan/diubah**. Inilah "DOM yang mencegah seseorang
melakukan edit" — literal. Sponsor itu milik Turtlecute (ShockVPN), bukan Zan.

Bonus — dua bug yang ketemu saat verifikasi live di Chrome:
- `#cf_wrap{display:none!important}` bikin tes kosmetik **selalu lapor
  "blocked" palsu** (tinggi terukur 0 walau tanpa adblocker).
- Warna status hijau/merah **tidak pernah tampil**: skin
  `.test_block{background:#0c1728!important}` menindih utilitas `_bg-green`/
  `_bg-red` milik JS.

## Yang diubah di replikasi ini

| Sebelum | Sesudah |
|---|---|
| 174 `!important` di 2 blok `<style>` inline | **0 `!important`** — semua tampilan di `src/sass/theme/nazuaf.sass`, dimuat paling akhir |
| PurgeCSS di script `build` | **Dihapus total** (`config/purgecss.mjs` + script + dependensi) |
| Sponsor ShockVPN + MutationObserver + class acak | **Dihapus total** (`src/js/components/sponsor.js`, gambar sponsor, chunk async) |
| Warna status via `style.background` + `_bg-*` | Class **`is-open` / `is-blocked`** — fungsional di `index.sass`, warna lembut di skin |
| `#cf_wrap{display:none}` → tes kosmetik palsu | Sembunyi **tanpa bunuh tinggi**: `position:fixed; top:-9999px; visibility:hidden` |
| Dua sistem tema (`prefers-color-scheme` vs `data-theme`) | Satu: **`[data-theme="light"]`** ikut tombol tema |
| Brand via `::before` + script JS | Markup **statis** di `header.ejs` (`.brand` + `.brand-mark` + `.brand-name`) |
| Support/BTCPay (form donasi ke toko Turtlecute) + footer partial | **Dihapus** |
| Umami analytics Turtlecute | **Dihapus** |
| Domain `adblock.turtlecute.org` | **`adblock.nazuaf.com`** (satu titik edit, lihat bawah) |
| URL host list hardcode | `window.location.origin + '/d3host.txt'` — ikut domain |
| Hamburger + overlay (navbar.js crash kalau tombol dihapus) | Dihapus dari markup; **listener di-null-guard** |
| Deploy check: ≥2 chunk sponsor + tidak ada 'shockvpn' | Dihapus; canonical + CNAME → `adblock.nazuaf.com` |

**Yang sengaja TIDAK diubah:** seluruh logika tes (`src/js/index.js` selain
yang di atas), data 128 host, umpan tes (`pagead.js`, `widget/ads.js`,
class umpan `#cts_test`), footer atribusi "Based on AdBlockTest by TurtleCute".

## Cara edit CSS sekarang

1. Edit **`src/sass/theme/nazuaf.sass`** untuk tampilan Nazuaf (warna, layout,
   hero, kartu, header, responsif, mode terang).
2. Edit `src/sass/**` lain hanya kalau mengubah struktur/fungsi dasar.
3. `npm run build` → cek `dist/`.
4. Jangan taruh `<style>` inline di file `.ejs` lagi. Jangan pakai `!important`.

## Kontrak ADPROBE (jangan dilanggar)

Elemen yang **diukur tingginya oleh tes** tidak boleh disembunyikan dengan
`display:none` dan class umpannya tidak boleh diubah:

- `#cts_test` — class umpan: `textads adsbox banner_ads adbox ADBox AdBox adbox-wrapper adSocial`
- `#cf_wrap` — sudah disembunyikan aman (fixed, off-screen). Lihat komentar
  `ADPROBE` di `src/index.ejs` dan `src/sass/theme/nazuaf.sass`.

## Domain

Placeholder: **`adblock.nazuaf.com`**. Kalau mau ganti domain, ubah di:
`package.json` (homepage), `src/index.ejs` + `src/404.ejs` (head include),
`src/partials/head.ejs` (`SITE_URL`), `src/robots.txt`, `src/sitemap.xml`,
`src/script/build_list.js`, `.github/workflows/deploy.yml` (CNAME).

## Build & deploy

```bash
npm ci
npm run dev        # dev server
npm run build      # produksi ke dist/
```

Push ke `master` → GitHub Actions build + deploy ke GitHub Pages.

## Ide lanjutan (tidak dikerjakan di sini)

Render grid `#test` secara statis di EJS (bukan `innerHTML` runtime) supaya
struktur hasil tes bisa dibaca langsung dari template. Lihat
`ANALISA-HERMES.md` / `ANALISA-MUSE.md` di repo asal untuk detail analisa.
