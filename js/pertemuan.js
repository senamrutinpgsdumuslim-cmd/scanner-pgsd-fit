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
  data.tanggal || "Semester Ganjil 2027";

document.getElementById("jumlahHadir").textContent =
  data.hadir ?? "-";

document.getElementById("jumlahTerlambat").textContent =
  data.terlambat ?? "-";

document.getElementById("jumlahIzin").textContent =
  data.izin ?? "-";

document.getElementById("persentase").textContent =
  data.persentase || "-";

document.getElementById("catatanPertemuan").textContent =
  data.catatan || "Belum ada catatan kegiatan.";

const galeri = document.getElementById("galeriFoto");

if (Array.isArray(data.foto) && data.foto.length > 0) {
  galeri.innerHTML = data.foto
    .map(
      (url) => `
      <div class="gallery-card">
        <img src="${url}" alt="Dokumentasi Pertemuan ${id}">
      </div>
    `
    )
    .join("");
}
```

} catch (err) {
console.error(err);
}
}

document.addEventListener("DOMContentLoaded", loadPertemuan);
