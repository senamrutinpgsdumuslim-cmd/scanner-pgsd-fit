let MODE = "";

const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec";

const hasil = document.getElementById("hasil");
const html5QrCode = new Html5Qrcode("reader");

let scanning = false;

// ==============================
// PILIH MODE
// ==============================

function pilihMode(mode){

    MODE = mode;

    document.getElementById("pilihMode").style.display = "none";
    document.getElementById("scannerArea").style.display = "block";

    document.getElementById("judulMode").innerHTML =
        MODE === "HADIR"
        ? "🟢 MODE HADIR"
        : "🟠 MODE TERLAMBAT";

    mulaiScanner();
}

// ==============================
// MULAI SCANNER
// ==============================

function mulaiScanner(){

    hasil.innerHTML = "📷 Mengaktifkan kamera...";

    scanning = true;

    html5QrCode.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,
            qrbox: 250
        },

        suksesScan,

        function(error){}

    ).catch(function(err){

        console.error(err);

        hasil.innerHTML = "❌ Kamera gagal dibuka";

        alert("ERROR KAMERA : " + err);

    });

}

// ==============================
// SETELAH QR TERBACA
// ==============================

function suksesScan(decodedText){

    if(!scanning) return;

    scanning = false;

    console.log("QR TERBACA :", decodedText);

    hasil.innerHTML = "⏳ Memproses...";

    html5QrCode.pause(true);

    fetch(URL_APPS_SCRIPT,{

        method:"POST",

        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },

        body:
            "id=" + encodeURIComponent(decodedText) +
            "&mode=" + encodeURIComponent(MODE)

    })

    .then(function(res){

        return res.json();

    })

    .then(function(data){

        console.log("RESPON SERVER :", data);

        alert(JSON.stringify(data));

        if(data.sukses){

         hasil.innerHTML = `
<div class="scan-card">

    <img src="assets/logo.png" class="scan-logo">

    <div class="scan-title">
        ${MODE=="HADIR" ? "✅ ABSENSI HADIR" : "🟠 ABSENSI TERLAMBAT"}
    </div>

    <div class="scan-nama">
        ${data.nama}
    </div>

    <div class="scan-item">🆔 <b>NPM</b> : ${data.npm}</div>
    <div class="scan-item">🎓 <b>Angkatan</b> : ${data.angkatan}</div>
    <div class="scan-item">👤 <b>JK</b> : ${data.jk}</div>
    <div class="scan-item">🏫 <b>Unit</b> : ${data.unit}</div>
    <div class="scan-item">⭐ <b>Status</b> : ${data.statusAnggota}</div>
    <div class="scan-item">🕒 <b>Jam</b> : ${data.jam}</div>

    <div class="scan-ok">
        ✔ VERIFIKASI BERHASIL
    </div>

</div>
`;
        }else{

            hasil.innerHTML = `
                <div class="gagal">
                    <h2>❌ ${data.pesan}</h2>
                </div>
            `;

        }

        setTimeout(function(){

            hasil.innerHTML = "Arahkan QR ke kamera";

            scanning = true;

            html5QrCode.resume();

        },2000);

    })

    .catch(function(err){

        console.error(err);

        hasil.innerHTML = "❌ Gagal menghubungi server";

        setTimeout(function(){

            hasil.innerHTML = "Arahkan QR ke kamera";

            scanning = true;

            html5QrCode.resume();

        },2000);

    });

}
