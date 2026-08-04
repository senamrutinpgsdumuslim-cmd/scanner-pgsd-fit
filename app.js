R// ==========================================
// SCANNER PGSD FIT (VERSI BARU)
// ==========================================

let MODE = "";

const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec?api=dashboard";

const hasil = document.getElementById("hasil");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");

const html5QrCode = new Html5Qrcode("reader");

let scanning = false;

// =============================
// PILIH MODE
// =============================

function pilihMode(mode){

    MODE = mode;

    document.getElementById("pilihMode").style.display = "none";
    document.getElementById("scannerArea").style.display = "block";

    document.getElementById("judulMode").innerHTML =
        mode === "HADIR"
            ? "🟢 MODE HADIR"
            : "🟠 MODE TERLAMBAT";

    mulaiScanner();

}

// =============================
// MULAI SCANNER
// =============================

function mulaiScanner(){

    hasil.innerHTML = "📷 Mengaktifkan Kamera...";

    scanning = true;

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        suksesScan,
        function(error){}
    ).then(function(){

        hasil.innerHTML = "📷 Arahkan QR Code ke Kamera";

    }).catch(function(err){

        console.error(err);

        hasil.innerHTML = "❌ Kamera gagal dibuka";

    });

}

// =============================
// TAMPIL POPUP
// =============================

function tampilPopup(data){

    popup.style.display = "flex";

    popupContent.innerHTML = `
    <div class="verify-card ${MODE==="HADIR" ? "hadir-card" : "terlambat-card"}">

        <img src="assets/logo.png" class="verify-logo">

        <div class="verify-header">
            ${MODE==="HADIR" ? "ABSENSI HADIR" : "ABSENSI TERLAMBAT"}
        </div>

        <div class="verify-check">✔</div>

        <div class="verify-name">
            ${data.nama}
        </div>

        <table class="verify-table">
            <tr><td>NPM</td><td>${data.npm}</td></tr>
            <tr><td>Angkatan</td><td>${data.angkatan}</td></tr>
            <tr><td>Jenis Kelamin</td><td>${data.jk}</td></tr>
            <tr><td>Unit</td><td>${data.unit}</td></tr>
            <tr><td>Status</td><td>${data.statusAnggota}</td></tr>
            <tr><td>Jam</td><td>${data.jam}</td></tr>
        </table>

        <div class="verify-footer">
            ${MODE==="HADIR" ? "✅ VERIFIKASI HADIR BERHASIL" : "🟠 VERIFIKASI TERLAMBAT"}
        </div>

        <div style="padding:20px;text-align:center;">
            <button class="btn-ok" onclick="lanjutScan()">
                ✅ SCAN BERIKUTNYA
            </button>
        </div>

    </div>
    `;

}

// =============================
// LANJUT SCAN
// =============================

function lanjutScan(){

    popup.style.display = "none";
    popupContent.innerHTML = "";

    hasil.innerHTML = "📷 Arahkan QR Code ke Kamera";

    // beri jeda 2 detik agar QR yang sama tidak terbaca lagi
    setTimeout(function(){
        processing = false;
    }, 2000);

}

// =============================
// QR TERBACA (VERSI CEPAT)
// =============================

let processing = false;

async function suksesScan(decodedText){

    if(processing) return;

    processing = true;

    hasil.innerHTML = "⏳ Memproses absensi...";

    try{

        const res = await fetch(URL_APPS_SCRIPT,{
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body:
                "id=" + encodeURIComponent(decodedText) +
                "&mode=" + encodeURIComponent(MODE)
        });

        const data = await res.json();

        if(data.sukses){
            tampilPopup(data);
        }else{
            popup.style.display = "flex";
            popupContent.innerHTML = `
            <div class="verify-card">
                <div style="padding:35px;text-align:center;">
                    <h2 style="color:#dc2626;font-size:30px;">❌</h2>
                    <h3>${data.pesan}</h3>
                    <br>
                    <button class="btn-ok" onclick="lanjutScan()">
                        🔄 KEMBALI SCAN
                    </button>
                </div>
            </div>`;
        }

    }catch(err){

        console.error(err);

        popup.style.display = "flex";
        popupContent.innerHTML = `
        <div class="verify-card">
            <div style="padding:35px;text-align:center;">
                <h2 style="color:#dc2626;">❌</h2>
                <h3>Gagal Menghubungi Server</h3>
                <br>
                <button class="btn-ok" onclick="lanjutScan()">
                    🔄 KEMBALI SCAN
                </button>
            </div>
        </div>`;

    }

}
