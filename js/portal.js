// =====================================================
// DOKUMENTASI PORTAL PGSD FIT
// =====================================================

const API_DOKUMENTASI_PORTAL =
  "https://script.google.com/macros/s/AKfycbzQvc2HJKWgkX_sHiUodSwbc31wW86wUkkv26Fyfw0h95KqbixA3mKuFMejRbpR2v0s/exec?api=dokumentasi";


// =====================================================
// LOAD DOKUMENTASI KE PORTAL
// =====================================================

async function loadDokumentasiPortal() {

  const container =
    document.getElementById("portalDokumentasi");

  if (!container) {
    console.warn(
      "Element #portalDokumentasi tidak ditemukan."
    );
    return;
  }


  // Tampilan loading

  container.innerHTML = `
    <div class="portal-doc-empty">

      <div class="portal-doc-icon">
        📷
      </div>

      <h3>Memuat Dokumentasi...</h3>

      <p>
        Sedang mengambil arsip kegiatan PGSD FIT.
      </p>

    </div>
  `;


  try {

    const response =
      await fetch(
        API_DOKUMENTASI_PORTAL +
        "&t=" +
        Date.now()
      );


    if (!response.ok) {
      throw new Error(
        "HTTP Error " + response.status
      );
    }


    const result =
      await response.json();


    console.log(
      "Dokumentasi Portal:",
      result
    );


    if (
      !result ||
      !result.sukses
    ) {

      throw new Error(
        result?.pesan ||
        "Data dokumentasi gagal dimuat."
      );
    }


    const data =
      Array.isArray(result.data)
        ? result.data
        : [];


    renderDokumentasiPortal(
      container,
      data
    );


  } catch (error) {

    console.error(
      "Dokumentasi Portal Error:",
      error
    );


    container.innerHTML = `
      <div class="portal-doc-empty">

        <div class="portal-doc-icon">
          📷
        </div>

        <h3>Dokumentasi Belum Tersedia</h3>

        <p>
          Dokumentasi kegiatan belum dapat dimuat.
        </p>

        <button
          type="button"
          onclick="loadDokumentasiPortal()"
          class="portal-doc-button"
        >
          Coba Lagi
        </button>

      </div>
    `;
  }
}


// =====================================================
// RENDER
// =====================================================

function renderDokumentasiPortal(
  container,
  data
) {

  if (!data.length) {

    container.innerHTML = `
      <div class="portal-doc-empty">

        <div class="portal-doc-icon">
          📷
        </div>

        <h3>Belum Ada Dokumentasi</h3>

        <p>
          Dokumentasi kegiatan akan muncul
          setelah pertemuan dilaksanakan.
        </p>

      </div>
    `;

    return;
  }


  // Ambil beberapa dokumentasi terbaru

  const terbaru =
    data.slice(0, 3);


  let html = "";


  terbaru.forEach(function(item) {

    const pertemuan =
      escapeHtml(
        item.pertemuan || "-"
      );


    const tanggal =
      escapeHtml(
        item.tanggal || "-"
      );


    const tema =
      escapeHtml(
        item.tema ||
        item.catatan ||
        "Senam Rutin PGSD FIT"
      );


    const foto =
      Array.isArray(item.foto)
        ? item.foto
        : [];


    let fotoHtml = "";


    if (foto.length) {

      const image =
        foto[0];


      const imageUrl =
        escapeAttribute(
          image.url || ""
        );


      fotoHtml = `
        <div class="portal-doc-photo">

          <img
            src="${imageUrl}"
            alt="${tema}"
            loading="lazy"
            onerror="
              this.style.display='none';
            "
          >

        </div>
      `;

    } else {

      fotoHtml = `
        <div class="portal-doc-photo portal-doc-no-photo">
          📷
        </div>
      `;
    }


    html += `

      <article class="portal-doc-card">

        ${fotoHtml}

        <div class="portal-doc-content">

          <span class="portal-doc-badge">
            Pertemuan ${pertemuan}
          </span>

          <h3>
            ${tema}
          </h3>

          <p>
            ${tanggal}
          </p>

          <span class="portal-doc-count">
            ${foto.length}
            foto dokumentasi
          </span>

        </div>

      </article>

    `;
  });


  container.innerHTML = `

    <div class="portal-doc-grid">

      ${html}

    </div>

    <div class="portal-doc-action">

      <a
        href="dokumentasi.html"
        class="portal-doc-button"
      >
        Lihat Semua Dokumentasi
      </a>

    </div>

  `;
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

  return String(value ?? "")

    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// =====================================================
// ESCAPE ATTRIBUTE
// =====================================================

function escapeAttribute(value) {

  return String(value ?? "")

    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}


// =====================================================
// JALANKAN
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadDokumentasiPortal();

  }
);
