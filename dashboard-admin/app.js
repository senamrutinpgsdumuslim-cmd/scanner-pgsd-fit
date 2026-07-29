// =========================================
// DASHBOARD ADMIN PGSD FIT
// =========================================

const API_URL = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec?api=dashboard";

// ===============================
// JAM REALTIME
// ===============================

function updateClock() {
const now = new Date();

```
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
```

}

setInterval(updateClock, 1000);
updateClock();

// ===============================
// CHART
// ===============================

let attendanceChart;
let unitChart;

function initCharts() {

```
attendanceChart = new Chart(
    document.getElementById("attendanceChart"),
    {
        type: "line",
        data: {
            labels: ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"],
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
            labels: ["Hadir", "Terlambat", "Izin", "Aktif"],
            datasets: [
                {
                    data: [1,1,1,1],
                    backgroundColor: [
                        "#1565C0",
                        "#F97316",
                        "#64748B",
                        "#16A34A"
                    ],
                    borderWidth: 0
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
```

}

// ===============================
// AMBIL DATA DASHBOARD
// ===============================

function loadDashboard() {

```
fetch(API_URL)

.then(res => res.json())

.then(data => {

    if (!data.sukses) return;

    // ===============================
    // UPDATE STATISTIK
    // ===============================

    document.querySelectorAll(".number")[0].textContent = data.statistik.hadir;
    document.querySelectorAll(".number")[1].textContent = data.statistik.terlambat;
    document.querySelectorAll(".number")[2].textContent = data.statistik.izin;
    document.querySelectorAll(".number")[3].textContent = data.statistik.pesertaAktif;

    // ===============================
    // UPDATE TABEL
    // ===============================

    const tbody = document.querySelector("table tbody");

    tbody.innerHTML = "";

    data.terbaru.forEach(item => {

        tbody.innerHTML += `
            <tr>
                <td>${item.npm}</td>
                <td>${item.nama}</td>
                <td>${item.pertemuan}</td>
                <td>
                    <span class="badge ${item.status === "HADIR" ? "hadir" : "terlambat"}">
                        ${item.status}
                    </span>
                </td>
            </tr>
        `;

    });

    // ===============================
    // UPDATE GRAFIK
    // ===============================

    attendanceChart.data.datasets[0].data = [
        data.statistik.hadir,
        data.statistik.hadir,
        data.statistik.hadir,
        data.statistik.hadir,
        data.statistik.hadir,
        data.statistik.hadir,
        data.statistik.hadir,
        data.statistik.hadir
    ];

    attendanceChart.update("none");

    unitChart.data.datasets[0].data = [
        data.statistik.hadir,
        data.statistik.terlambat,
        data.statistik.izin,
        data.statistik.pesertaAktif
    ];

    unitChart.update("none");

})

.catch(err => {
    console.error(err);
});
```

}

// ===============================
// START
// ===============================

window.onload = function() {

```
initCharts();

loadDashboard();

// Refresh setiap 15 detik
setInterval(loadDashboard, 15000);
```

};
