const API_URL = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec";

async function loadDokumentasi() {
  const container = document.getElementById("listPertemuan");

  if (!container) return;

  container.innerHTML = `
    <div class="gallery-card">
      <div class="gallery-content">
        Memuat dokumentasi...
      </div>
    </div>
  `;

  try {
    const response = await fetch(API_URL + "?page=dokumentasi");
    const data = await response.json();

    container.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `
        <div class="gallery-card">
          <div class="gallery-content">
            <h3>Belum ada data dokumentasi</h3>
            <p>Data pertemuan Semester Ganjil 2027 belum tersedia.</p>
          </div>
        </div>
      `;
      return;
    }

    data.forEach(item => {
      const status = item.status || "Belum Dilaksanakan";
      const tanggal = item.tanggal || "-";

      container.innerHTML += `
        <div class="gallery-card">

          <img src="assets/logo-pgsdfit-2026.png" alt="Pertemuan ${item.pertemuan}">

          <div class="gallery-content">

            <h3>Pertemuan ${item.pertemuan}</h3>

            <p><strong>Semester:</strong> Ganjil 2027</p>

            <p><strong>Tanggal:</strong> ${tanggal}</p>

            <p><strong>Tema:</strong> Senam Rutin PGSD FIT</p>

            <p><strong>Status:</strong> ${status}</p>

            <div class="status-badge ${status.toLowerCase().replace(/ /g, '-')}">
              ${status}
            </div>

            <p class="note">
              Dokumentasi foto dan data kehadiran akan dipublikasikan setelah pertemuan selesai dan diverifikasi oleh panitia PGSD FIT.
            </p>

          </div>

        </div>
      `;
    });

  } catch (error) {
    console.error(error);

    container.innerHTML = `
      <div class="gallery-card">
        <div class="gallery-content">
          <h3>Gagal memuat dokumentasi</h3>
          <p>Periksa koneksi internet atau API Apps Script.</p>
        </div>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadDokumentasi);
