// =========================================
// DASHBOARD ADMIN PGSD FIT (FINAL)
// =========================================

const API_URL = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec?api=dashboard";

// ===============================
// CHART
// ===============================
let attendanceChart;
let unitChart;
let lastData = "";

function initCharts() {

    attendanceChart = new Chart(
        document.getElementById("attendanceChart"),
        {
            type: "line",
            data: {
                labels: ["P1","P2","P3","P4","P5","P6","P7","P8"],
                datasets: [
                    {
                        label: "Kehadiran",
                        data: [0,0,0,0,0,0,0,0],
                        borderColor: "#1565C0",
                        backgroundColor: "rgba(21,101,192,.15)",
                        fill: true,
                        tension: .35
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false
            }
        }
    );

    unitChart = new Chart(
        document.getElementById("unitChart"),
        {
            type: "doughnut",
            data: {
                labels: ["A","B","C","D"],
                datasets: [
                    {
                        data: [0,0,0,0],
                        backgroundColor: [
                            "#1565C0",
                            "#16A34A",
                            "#F97316",
                            "#7C3AED"
                        ]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false
            }
        }
    );
}

// ===============================
// LOAD DASHBOARD
// ===============================
function loadDashboard() {

    fetch(API_URL)
    .then(res => res.json())
.then(data => {

    if (!data.sukses) return;

    const current = JSON.stringify(data.statistik);

    if(current === lastData){
        return;
    }

    lastData = current;
        // Statistik
        const stat = data.statistik;

document.getElementById('hadir').textContent = data.statistik.hadir;
document.getElementById('terlambat').textContent = data.statistik.terlambat;
document.getElementById('izin').textContent = data.statistik.izin;
document.getElementById('pesertaAktif').textContent = data.statistik.pesertaAktif;

        // Tabel terbaru
        const tbody = document.getElementById("absensiTerbaru");
        if (tbody) {
            tbody.innerHTML = "";

            data.terbaru.forEach(item => {
                tbody.innerHTML += `
                    <tr>
                        <td>${item.npm}</td>
                        <td>${item.nama}</td>
                        <td>${item.pertemuan}</td>
                        <td>
                            <span class="badge ${item.status==='HADIR' ? 'hadir' : 'terlambat'}">
                                ${item.status}
                            </span>
                        </td>
                    </tr>
                `;
            });
        }

// Grafik tidak di-update otomatis untuk menghindari kedip layar
}
    })
    .catch(err => {
        console.error("Dashboard error:", err);
    });
}

// ===============================
// START
// ===============================
window.onload = function() {

    initCharts();

    loadDashboard();

};
