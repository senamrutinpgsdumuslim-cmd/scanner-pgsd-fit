let MODE = "";

const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec";

const hasil = document.getElementById("hasil");
const html5QrCode = new Html5Qrcode("reader");

let scanning = true;

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

function suksesScan(decodedText){

    if(!scanning) return;

    scanning = false;

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
.then(res => res.json())
.then(data => {

    console.log("RESPON SERVER :", data);

    if(data.sukses){

        ...
        if(data.sukses){

            hasil.innerHTML=`
                <div class="berhasil">
                    <div class="nama">${data.nama}</div>
                    <div class="info">NPM : ${data.npm}</div>
                    <div class="info">Unit : ${data.unit}</div>
                    <div class="info">Status : ${data.status}</div>
                    <div class="info">Jam : ${data.jam}</div>
                    <h2>${MODE==="HADIR" ? "✅ HADIR BERHASIL" : "🟠 TERLAMBAT BERHASIL"}</h2>
                </div>
            `;

        }else{

            hasil.innerHTML=`
                <div class="gagal">
                    <h2>❌ ${data.pesan}</h2>
                </div>
            `;

        }

        setTimeout(()=>{
            hasil.innerHTML="Arahkan QR ke kamera";
            scanning=true;
        },2000);

    })
    .catch(err=>{

        console.error(err);

        hasil.innerHTML="❌ Gagal menghubungi server";

        setTimeout(()=>{
            hasil.innerHTML="Arahkan QR ke kamera";
            scanning=true;
        },2000);

    });

}

function mulaiScanner(){

    Html5Qrcode.getCameras().then(devices=>{

        if(!devices.length){
            hasil.innerHTML="❌ Kamera tidak ditemukan";
            return;
        }

        html5QrCode.start(
            { facingMode:"environment" },
            {
                fps:10,
                qrbox:250
            },
            suksesScan
        );

    });

}
