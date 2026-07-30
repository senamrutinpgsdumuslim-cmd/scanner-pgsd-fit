// =========================================
// DASHBOARD ADMIN PGSD FIT (FINAL)
// =========================================

const API_URL = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec?api=dashboard";

// ===============================
// JAM REALTIME
// ===============================
function updateClock() {
    const now = new Date();
    const options = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    const clock = document.getElementById("clock");
    if (clock) {
        clock.textContent = now.toLocaleString("id-ID", options);
    }
}

setInterval(updateClock, 1000);
updateClock();

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

        document.querySelectorAll(".number")[0].textContent = stat.hadir;
        document.querySelectorAll(".number")[1].textContent = stat.terlambat;
        document.querySelectorAll(".number")[2].textContent = stat.izin;
        document.querySelectorAll(".number")[3].textContent = stat.pesertaAktif;

        // Tabel terbaru
        const tbody = document.querySelector("table tbody");
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

// Grafik kehadiran (hanya update jika berubah)
const newAttendance = [
    stat.hadir,
    stat.hadir,
    stat.hadir,
    stat.hadir,
    stat.hadir,
    stat.hadir,
    stat.hadir,
    stat.hadir
];

if (JSON.stringify(attendanceChart.data.datasets[0].data) !== JSON.stringify(newAttendance)) {
    attendanceChart.data.datasets[0].data = newAttendance;
    attendanceChart.update("none");
}

// Grafik unit (hanya update jika berubah)
const unit = data.unit || {};
const newLabels = Object.keys(unit).length ? Object.keys(unit) : ["Belum Ada Data"];
const newValues = Object.keys(unit).length ? Object.values(unit) : [1];

if (
    JSON.stringify(unitChart.data.labels) !== JSON.stringify(newLabels) ||
    JSON.stringify(unitChart.data.datasets[0].data) !== JSON.stringify(newValues)
) {
    unitChart.data.labels = newLabels;
    unitChart.data.datasets[0].data = newValues;
    unitChart.update("none");
}

        updateClock();

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
