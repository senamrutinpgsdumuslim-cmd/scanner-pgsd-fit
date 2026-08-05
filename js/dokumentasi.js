const API_URL = 'https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgliWq3IJIgH8Y6H5m0nrU_3rw/exec';

async function loadDokumentasi() {
  try {
    const res = await fetch(API_URL + '?page=dokumentasi');
    const data = await res.json();

    const container = document.getElementById('listPertemuan');

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="gallery-card empty-card">
          <div class="empty-icon">📷</div>
          <div class="gallery-content">
            <h3>Belum Ada Dokumentasi</h3>
            <p>Semester Ganjil 2027 belum dimulai. Dokumentasi dan rekap kehadiran akan dipublikasikan setelah pelaksanaan Pertemuan 1 dan diverifikasi oleh panitia PGSD FIT.</p>
            <span class="status-badge">Menunggu Pelaksanaan Pertemuan 1</span>
          </div>
        </div>`;
      return;
    }

    container.innerHTML = data.map(item => `
      <a href="pertemuan.html?id=${item.pertemuan}" class="gallery-card">
        <img src="assets/logo-pgsdfit-2026.png" alt="PGSD FIT">
        <div class="gallery-content">
          <h3>Pertemuan ${item.pertemuan}</h3>
          <p>${item.tanggal || '-'}</p>
          <span class="status-badge">${item.status || 'Belum dipublikasikan'}</span>
        </div>
      </a>
    `).join('');

  } catch (err) {
    document.getElementById('listPertemuan').innerHTML = `
      <div class="gallery-card empty-card">
        <div class="gallery-content">
          <h3>Gagal memuat dokumentasi</h3>
          <p>Periksa koneksi internet atau API Apps Script.</p>
        </div>
      </div>`;
    console.error(err);
  }
}

loadDokumentasi();
