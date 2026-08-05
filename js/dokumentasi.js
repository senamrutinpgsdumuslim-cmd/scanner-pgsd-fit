const API = "https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec";

async function loadDokumentasi() {
  try {
    const res = await fetch(API + "?page=dokumentasi");
    const data = await res.json();

    const container = document.getElementById("listPertemuan");
    container.innerHTML = "";

    data.forEach(p => {
      container.innerHTML += `
        <div class="gallery-card">
          <img src="assets/logo-pgsdfit-2026.png">
          <div class="gallery-content">
            <h3>Pertemuan ${p.pertemuan}</h3>
            <p><strong>Status:</strong> ${p.status}</p>
            <p><strong>Tanggal:</strong> ${p.tanggal || "-"}</p>
            <p><strong>Peserta Hadir:</strong> ${p.hadir || "Menunggu Rekap"}</p>
            <p><strong>Terlambat:</strong> ${p.terlambat || "Menunggu Rekap"}</p>
            <p><strong>Izin:</strong> ${p.izin || "Menunggu Rekap"}</p>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
  }
}

loadDokumentasi();
