const API = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec";

const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "1";

async function loadDetail() {
  try {
    const res = await fetch(`${API}?page=detail&id=${id}`);
    const data = await res.json();

    document.getElementById("judulPertemuan").textContent = `Pertemuan ${id}`;
    document.getElementById("tanggalPertemuan").textContent = data.tanggal || "-";
    document.getElementById("catatanPertemuan").textContent = data.catatan || "-";

    document.getElementById("jumlahHadir").textContent = data.hadir || 0;
    document.getElementById("jumlahTerlambat").textContent = data.terlambat || 0;
    document.getElementById("jumlahIzin").textContent = data.izin || 0;
    document.getElementById("persentaseHadir").textContent = data.persentase || "0%";

    const galeri = document.getElementById("galeriFoto");

    if (data.foto && data.foto.length > 0) {
      galeri.innerHTML = data.foto
        .map(
          (f) => `
          <a href="${f}" target="_blank" class="foto-item">
            <img src="${f}" alt="Dokumentasi Pertemuan">
          </a>
        `
        )
        .join("");
    } else {
      galeri.innerHTML = `
        <div class="gallery-card" style="width:100%">
          <div class="gallery-content" style="text-align:center;padding:40px">
            <div style="font-size:42px;margin-bottom:12px">📷</div>
            <h3>Dokumentasi Belum Tersedia</h3>
            <p>Foto kegiatan akan dipublikasikan setelah diverifikasi oleh panitia PGSD FIT.</p>
          </div>
        </div>
      `;
    }

    const list = document.getElementById("listTerlambat");

    if (data.terlambatList && data.terlambatList.length > 0) {
      list.innerHTML = data.terlambatList
        .map(
          (m, i) => `
          <div class="gallery-content" style="border-bottom:1px solid #e5e7eb;padding:14px 0">
            <strong>${i + 1}. ${m.nama}</strong><br>
            NPM: ${m.npm}<br>
            Unit: ${m.unit}
          </div>
        `
        )
        .join("");
    } else {
      list.innerHTML = `
        <div class="gallery-content">
          Tidak ada peserta terlambat pada pertemuan ini.
        </div>
      `;
    }
  } catch (err) {
    console.error(err);
  }
}

loadDetail();
