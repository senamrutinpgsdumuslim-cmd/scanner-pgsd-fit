const API_URL = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec";

async function loadPertemuan() {
const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "1";

try {
const res = await fetch(`${API_URL}?page=detail&id=${id}`);
const data = await res.json();

```
document.getElementById("judulPertemuan").textContent = `Pertemuan ${id}`;
document.getElementById("tanggalPertemuan").textContent =
  data.tanggal || "Semester Ganjil 2026/2027";

document.getElementById("jumlahHadir").textContent =
  data.hadir ?? 0;

document.getElementById("jumlahTerlambat").textContent =
  data.terlambat ?? 0;

document.getElementById("jumlahIzin").textContent =
  data.izin ?? 0;

document.getElementById("persentaseHadir").textContent =
  data.persentase || "0%";

document.getElementById("catatanPertemuan").textContent =
  data.catatan || "Belum ada catatan kegiatan.";

// ===== Galeri Foto =====
const galeri = document.getElementById("galeriFoto");

if (Array.isArray(data.foto) && data.foto.length > 0) {
  galeri.innerHTML = data.foto
    .map(
      (url) => `
      <a href="${url}" target="_blank" class="photo-item">
        <img src="${url}" alt="Dokumentasi Pertemuan ${id}">
      </a>
    `
    )
    .join("");
}

// ===== Daftar Terlambat =====
const list = document.getElementById("listTerlambat");

if (data.terlambatList && data.terlambatList.length > 0) {
  list.innerHTML = data.terlambatList
    .map(
      (m, i) => `
      <div style="padding:14px 0;border-bottom:1px solid #e2e8f0;">
        <strong>${i + 1}. ${m.nama}</strong><br>
        NPM: ${m.npm}<br>
        Unit: ${m.unit}
      </div>
    `
    )
    .join("");
} else {
  list.innerHTML =
    "<p style='text-align:center;color:#64748b'>Tidak ada peserta terlambat pada pertemuan ini.</p>";
}
```

} catch (err) {
console.error(err);
}
}

document.addEventListener("DOMContentLoaded", loadPertemuan);
