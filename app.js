// ==========================================
// SCANNER PGSD FIT
// ==========================================

// URL DEPLOYMENT APPS SCRIPT TERBARU
const URL_APPS_SCRIPT =
  "https://script.google.com/macros/s/AKfycbzQvc2HJKWgkX_sHiUodSwbc31wW86wUkkv26Fyfw0h95KqbixA3mKuFMejRbpR2v0s/exec";

let MODE = "HADIR";
let processing = false;
let html5QrCode = null;

document.addEventListener("DOMContentLoaded", function () {

  const pilihModeEl = document.getElementById("pilihMode");
  const scannerAreaEl = document.getElementById("scannerArea");
  const scannerUtamaEl = document.getElementById("scannerUtama");
  const loginPanitiaEl = document.getElementById("loginPanitia");

  // Pastikan scanner TERKUNCI saat pertama dibuka
  if (scannerUtamaEl) {
    scannerUtamaEl.style.display = "none";
  }

  if (pilihModeEl) {
    pilihModeEl.style.display = "none";
  }

  if (scannerAreaEl) {
    scannerAreaEl.style.display = "none";
  }

  if (loginPanitiaEl) {
    loginPanitiaEl.style.display = "block";
  }
});


// ==========================================
// AKTIFKAN AREA SCANNER SETELAH PIN BENAR
// ==========================================

function aktifkanScanner() {

  const loginPanitia =
    document.getElementById("loginPanitia");

  const scannerUtama =
    document.getElementById("scannerUtama");

  const pilihMode =
    document.getElementById("pilihMode");

  const scannerArea =
    document.getElementById("scannerArea");

  if (loginPanitia) {
    loginPanitia.style.display = "none";
  }

  if (scannerUtama) {
    scannerUtama.style.display = "block";
  }

  if (pilihMode) {
    pilihMode.style.display = "block";
  }

  if (scannerArea) {
    scannerArea.style.display = "none";
  }
}


// ==========================================
// KUNCI SCANNER
// ==========================================

function kunciScanner() {

  if (html5QrCode) {
    html5QrCode.stop()
      .catch(function () {})
      .finally(function () {

        html5QrCode = null;

        resetScannerTampilan();

      });
  } else {
    resetScannerTampilan();
  }
}


function resetScannerTampilan() {

  const loginPanitia =
    document.getElementById("loginPanitia");

  const scannerUtama =
    document.getElementById("scannerUtama");

  const pilihMode =
    document.getElementById("pilihMode");

  const scannerArea =
    document.getElementById("scannerArea");

  if (scannerUtama) {
    scannerUtama.style.display = "none";
  }

  if (pilihMode) {
    pilihMode.style.display = "none";
  }

  if (scannerArea) {
    scannerArea.style.display = "none";
  }

  if (loginPanitia) {
    loginPanitia.style.display = "block";
  }

  processing = false;
}


// ==========================================
// PILIH MODE
// ==========================================

function pilihMode(mode) {

  MODE = mode;

  const pilihMode =
    document.getElementById("pilihMode");

  const scannerArea =
    document.getElementById("scannerArea");

  const judulMode =
    document.getElementById("judulMode");

  if (pilihMode) {
    pilihMode.style.display = "none";
  }

  if (scannerArea) {
    scannerArea.style.display = "block";
  }

  if (judulMode) {
    judulMode.textContent =
      mode === "HADIR"
        ? "🟢 MODE HADIR"
        : "🟠 MODE TERLAMBAT";
  }

  mulaiScanner();
}


// ==========================================
// MULAI SCANNER
// ==========================================

function mulaiScanner() {

  const hasil =
    document.getElementById("hasil");

  if (!hasil) {
    console.error("Elemen #hasil tidak ditemukan.");
    return;
  }

  hasil.innerHTML =
    "📷 Mengaktifkan kamera...";

  // Jangan buat scanner berkali-kali
  if (html5QrCode) {
    try {
      html5QrCode.stop().catch(function () {});
    } catch (e) {}

    html5QrCode = null;
  }

  html5QrCode =
    new Html5Qrcode("reader");

  html5QrCode.start(
    { facingMode: "environment" },

    {
      fps: 10,
      qrbox: 250
    },

    suksesScan,

    function () {
      // callback error scan dikosongkan
    }

  )
  .then(function () {

    hasil.innerHTML =
      "📷 Arahkan QR Code ke kamera";

  })
  .catch(function (err) {

    console.error(
      "Kamera gagal:",
      err
    );

    hasil.innerHTML =
      "❌ Kamera gagal dibuka. Pastikan izin kamera diberikan.";

  });
}


// ==========================================
// QR BERHASIL TERBACA
// ==========================================

async function suksesScan(decodedText) {

  if (processing) {
    return;
  }

  processing = true;

  const hasil =
    document.getElementById("hasil");

  try {

    if (html5QrCode) {
      await html5QrCode.pause(true);
    }

    hasil.innerHTML =
      "⏳ Memproses absensi...";

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        function () {
          controller.abort();
        },
        30000
      );

    const response =
      await fetch(
        URL_APPS_SCRIPT,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          },

          body:
            "id=" +
            encodeURIComponent(decodedText) +

            "&mode=" +
            encodeURIComponent(MODE),

          signal:
            controller.signal
        }
      );

    clearTimeout(timeout);

    const text =
      await response.text();

    let data;

    try {

      data =
        JSON.parse(text);

    } catch (e) {

      console.error(
        "Respons server:",
        text
      );

      throw new Error(
        "Respons server bukan JSON."
      );
    }

    if (!response.ok) {

      throw new Error(
        data.pesan ||
        "Server error."
      );
    }

    if (data.sukses) {

      tampilPopup(data);

    } else {

      tampilError(
        data.pesan ||
        "Gagal menyimpan absensi."
      );
    }

  } catch (err) {

    console.error(err);

    tampilError(
      err.name === "AbortError"
        ? "Koneksi timeout (30 detik)."
        : (
            err.message ||
            "Gagal menghubungi server."
          )
    );
  }
}


// ==========================================
// POPUP ERROR
// ==========================================

function tampilError(pesan) {

  const popup =
    document.getElementById("popup");

  const popupContent =
    document.getElementById("popupContent");

  if (!popup || !popupContent) {
    return;
  }

  popup.style.display = "flex";

  popupContent.innerHTML = `
    <div class="verify-card">

      <div style="padding:35px;text-align:center;">

        <h2 style="color:#dc2626;">
          ❌
        </h2>

        <h3>
          ${pesan}
        </h3>

        <br>

        <button
          class="btn-ok"
          onclick="lanjutScan()"
        >
          🔄 SCAN BERIKUTNYA
        </button>

      </div>

    </div>
  `;
}


// ==========================================
// POPUP BERHASIL
// ==========================================

function tampilPopup(data) {

  const popup =
    document.getElementById("popup");

  const popupContent =
    document.getElementById("popupContent");

  if (!popup || !popupContent) {
    return;
  }

  popup.style.display = "flex";

  popupContent.innerHTML = `
    <div class="verify-card ${
      MODE === "HADIR"
        ? "hadir-card"
        : "terlambat-card"
    }">

      <div class="verify-header">
        ${
          MODE === "HADIR"
            ? "ABSENSI HADIR"
            : "ABSENSI TERLAMBAT"
        }
      </div>

      <div class="verify-check">
        ✔
      </div>

      <div class="verify-name">
        ${data.nama}
      </div>

      <table class="verify-table">

        <tr>
          <td>NPM</td>
          <td>${data.npm}</td>
        </tr>

        <tr>
          <td>Angkatan</td>
          <td>${data.angkatan}</td>
        </tr>

        <tr>
          <td>Jenis Kelamin</td>
          <td>${data.jk}</td>
        </tr>

        <tr>
          <td>Unit</td>
          <td>${data.unit}</td>
        </tr>

        <tr>
          <td>Status</td>
          <td>${data.statusAnggota}</td>
        </tr>

        <tr>
          <td>Jam</td>
          <td>${data.jam}</td>
        </tr>

      </table>

      <div class="verify-footer">

        ${
          MODE === "HADIR"
            ? "✅ VERIFIKASI HADIR BERHASIL"
            : "🟠 VERIFIKASI TERLAMBAT"
        }

      </div>

      <div style="padding:20px;text-align:center;">

        <button
          class="btn-ok"
          onclick="lanjutScan()"
        >
          ✅ SCAN BERIKUTNYA
        </button>

      </div>

    </div>
  `;
}


// ==========================================
// LANJUT SCAN
// ==========================================

async function lanjutScan() {

  const popup =
    document.getElementById("popup");

  const popupContent =
    document.getElementById("popupContent");

  const hasil =
    document.getElementById("hasil");

  if (popup) {
    popup.style.display = "none";
  }

  if (popupContent) {
    popupContent.innerHTML = "";
  }

  if (hasil) {
    hasil.innerHTML =
      "📷 Arahkan QR Code ke kamera";
  }

  processing = false;

  try {

    if (html5QrCode) {
      await html5QrCode.resume();
    }

  } catch (e) {

    console.error(e);

  }
}
async function kembaliKePilihanMode() {

  // Hentikan kamera
  if (html5QrCode) {

    try {
      await html5QrCode.stop();
    } catch (e) {
      console.error("Gagal menghentikan kamera:", e);
    }

    html5QrCode = null;
  }

  // Reset status proses
  processing = false;

  // Sembunyikan area kamera
  const scannerArea =
    document.getElementById("scannerArea");

  if (scannerArea) {
    scannerArea.style.display = "none";
  }

  // Tampilkan pilihan mode
  const pilihMode =
    document.getElementById("pilihMode");

  if (pilihMode) {
    pilihMode.style.display = "block";
  }

  // Bersihkan reader
  const reader =
    document.getElementById("reader");

  if (reader) {
    reader.innerHTML = "";
  }

  // Reset judul
  const judulMode =
    document.getElementById("judulMode");

  if (judulMode) {
    judulMode.textContent = "";
  }

  // Reset tulisan hasil
  const hasil =
    document.getElementById("hasil");

  if (hasil) {
    hasil.innerHTML =
      "📷 Pilih mode scanner terlebih dahulu";
  }
}
