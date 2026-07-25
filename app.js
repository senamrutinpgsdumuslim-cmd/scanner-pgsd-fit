const URL_APPS_SCRIPT = "PASTE_URL_WEB_APP_ANDA_DI_SINI";

const hasil = document.getElementById("hasil");

const html5QrCode = new Html5Qrcode("reader");

let scanning = true;

function suksesScan(decodedText){

    if(!scanning) return;

    scanning = false;

    hasil.innerHTML = "⏳ Memproses...";

    fetch(URL_APPS_SCRIPT,{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:"id="+encodeURIComponent(decodedText)
    })
    .then(res=>res.json())
    .then(data=>{

        if(data.sukses){

            hasil.innerHTML=`
            <div class="berhasil">
                <div class="nama">${data.nama}</div>
                <div class="info">NPM : ${data.npm}</div>
                <div class="info">Unit : ${data.unit}</div>
                <div class="info">Status : ${data.status}</div>
                <div class="info">Jam : ${data.jam}</div>
                <h2>✅ ABSENSI BERHASIL</h2>
            </div>
            `;

        }else{

            hasil.innerHTML=`
            <div class="gagal">
                <h2>❌ ${data.pesan}</h2>
            </div>
            `;

        }

        setTimeout(function(){

            hasil.innerHTML="Arahkan QR ke kamera";

            scanning=true;

        },2000);

    })
    .catch(function(){

        hasil.innerHTML="❌ Gagal menghubungi server";

        setTimeout(function(){

            hasil.innerHTML="Arahkan QR ke kamera";

            scanning=true;

        },2000);

    });

}

Html5Qrcode.getCameras().then(devices=>{

    if(devices.length){

        html5QrCode.start(

            { facingMode:"environment" },

            {
                fps:10,
                qrbox:250
            },

            suksesScan

        );

    }

});
