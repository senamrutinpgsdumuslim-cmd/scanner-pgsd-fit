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
<div class="verify-card ${MODE=="HADIR" ? "hadir-card" : "terlambat-card"}">

    <img src="assets/logo.png" class="verify-logo">

    <div class="verify-header">
        ${MODE=="HADIR" ? "ABSENSI HADIR" : "ABSENSI TERLAMBAT"}
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
        ${MODE=="HADIR"
            ? "✅ VERIFIKASI HADIR BERHASIL"
            : "🟠 VERIFIKASI TERLAMBAT"}
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
