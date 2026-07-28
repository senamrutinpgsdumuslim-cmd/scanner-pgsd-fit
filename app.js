// ==========================================
// SCANNER PGSD FIT
// ==========================================

let MODE = "";

const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec";

const hasil = document.getElementById("hasil");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");

const html5QrCode = new Html5Qrcode("reader");

let scanning = false;

// ==========================================
// PILIH MODE
// ==========================================

function pilihMode(mode){

    MODE = mode;

    document.getElementById("pilihMode").style.display = "none";
    document.getElementById("scannerArea").style.display = "block";

    document.getElementById("judulMode").innerHTML =
        MODE=="HADIR"
        ? "🟢 MODE HADIR"
        : "🟠 MODE TERLAMBAT";

    mulaiScanner();

}

// ==========================================
// MULAI SCANNER
// ==========================================

function mulaiScanner(){

    hasil.innerHTML="📷 Mengaktifkan Kamera...";

    scanning=true;

    html5QrCode.start(

        {
            facingMode:"environment"
        },

        {
            fps:10,
            qrbox:260
        },

        suksesScan,

        function(error){}

    )

.then(function(data){

    console.log(data);

    if(data.sukses){

        tampilPopup(data);

    }else{

        popup.style.display="flex";

        popupContent.innerHTML=`

<div class="verify-card">

    <div style="padding:35px;text-align:center;">

        <h2 style="color:#dc2626;font-size:30px;">❌</h2>

        <h3>${data.pesan}</h3>

        <br>

        <button class="btn-ok" onclick="lanjutScan()">
            🔄 KEMBALI SCAN
        </button>

    </div>

</div>

`;

    }

})
   .catch(function(err){

    console.error(err);

    popup.style.display="flex";

    popupContent.innerHTML=`

<div class="verify-card">

    <div style="padding:35px;text-align:center;">

        <h2 style="color:#dc2626;">❌</h2>

        <h3>Gagal Menghubungi Server</h3>

        <br>

        <button class="btn-ok" onclick="lanjutScan()">
            🔄 KEMBALI SCAN
        </button>

    </div>

</div>

`;

});

// ==========================================
// TAMPIL POPUP
// ==========================================

function tampilPopup(data){

popup.style.display="flex";

popupContent.innerHTML=`

<div class="verify-card ${MODE=="HADIR"?"hadir-card":"terlambat-card"}">

<img src="assets/logo.png" class="verify-logo">

<div class="verify-header">
${MODE=="HADIR"?"ABSENSI HADIR":"ABSENSI TERLAMBAT"}
</div>

<div class="verify-check">✔</div>

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
?
"✅ VERIFIKASI HADIR BERHASIL"
:
"🟠 VERIFIKASI TERLAMBAT"}

</div>
<div style="padding:20px;text-align:center;">

<button
class="btn-ok"
onclick="lanjutScan()">

✅ OKE

</button>

</div>

</div>

`;

}

// ==========================================
// TUTUP POPUP
// ==========================================

function tutupPopup(){

popup.style.display="none";

popupContent.innerHTML="";

}

function lanjutScan(){
    alert("TOMBOL OKE DITEKAN");

    popup.style.display = "none";
    popupContent.innerHTML = "";

    hasil.innerHTML = "📷 Arahkan QR Code ke Kamera";

    scanning = true;

    try{

        html5QrCode.resume();

    }catch(e){

        console.log("Resume gagal, mulai ulang scanner");

        html5QrCode.stop().then(function(){

            mulaiScanner();

        }).catch(function(){

            mulaiScanner();

        });

    }

}

// ==========================================
// SETELAH QR TERBACA
// ==========================================

function suksesScan(decodedText){

    if(!scanning) return;

    scanning = false;

    html5QrCode.pause(true);

    hasil.innerHTML = "⏳ Memproses...";

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

        console.log(data);

        if(data.sukses){

            tampilPopup(data);

      }else{

popup.style.display="flex";

popupContent.innerHTML=`

<div class="verify-card">

<div style="padding:35px;text-align:center;">

<h2 style="color:#dc2626;font-size:28px;">
❌
</h2>

<h3 style="margin-top:10px;">
${data.pesan}
</h3>

<br>

<button
class="btn-ok"
onclick="lanjutScan()">

🔄 KEMBALI SCAN

</button>

</div>

</div>

`;

}

// menunggu tombol OKE ditekan

    })

    .catch(function(err){

        console.error(err);

        popup.style.display="flex";

        popupContent.innerHTML=`

        <div class="verify-card">

            <div style="padding:40px;text-align:center;">

                <h2 style="color:#dc2626;">

                    ❌ Gagal Menghubungi Server

                </h2>

            </div>

        </div>

        `;

popupContent.innerHTML += `

<div style="padding:20px;text-align:center;">

<button
class="btn-ok"
onclick="lanjutScan()">

OKE

</button>

</div>

`;
