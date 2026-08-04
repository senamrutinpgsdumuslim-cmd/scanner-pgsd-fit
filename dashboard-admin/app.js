// =========================================
// DASHBOARD ADMIN PGSD FIT (FINAL)
// =========================================

const API_URL = "https://script.google.com/macros/s/AKfycbzwBgCzvU7H1LSMEiVO8gJ9iy1g1EmXhUchuewpBMQiJgIiWq3IJIgH8Y6H5m0nrU_3rw/exec?api=dashboard";

let attendanceChart;
let unitChart;

// =========================================
// INIT CHART
// =========================================
function initCharts() {

  attendanceChart = new Chart(
    document.getElementById("attendanceChart"),
    {
      type: "line",
      data: {
        labels: ["P1","P2","P3","P4","P5","P6","P7","P8"],
        datasets: [{
          label: "Kehadiran",
          data: [0,0,0,0,0,0,0,0],
          borderColor: "#1565C0",
          backgroundColor: "rgba(21,101,192,.15)",
          fill: true,
          tension: 0.35
        }]
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
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            "#1565C0",
            "#16A34A",
            "#F97316",
            "#7C3AED",
            "#E11D48",
            "#0891B2",
            "#65A30D",
            "#EA580C",
            "#475569"
          ]
        }]
      },
options: {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0
      }
    }
  },
  plugins: {
    legend: {
      display: true
    }
  }
}

// =========================================
// LOAD DASHBOARD
// =========================================
async function loadDashboard() {
  try {
    const res = await fetch(API_URL + "&t=" + Date.now());
    const result = await res.json();

    if (!result.sukses) return;

    // Statistik
    document.getElementById("hadirCount").textContent = result.statistik.hadir;
    document.getElementById("terlambatCount").textContent = result.statistik.terlambat;
    document.getElementById("izinCount").textContent = result.statistik.izin;
    document.getElementById("pesertaAktifCount").textContent = result.statistik.pesertaAktif;

    // Absensi terbaru
    const tbody = document.getElementById("absensiTerbaru");
    if (tbody) {
      tbody.innerHTML = "";
      (result.terbaru || []).forEach(item => {
        tbody.innerHTML += `
          <tr>
            <td>${item.npm}</td>
            <td>${item.nama}</td>
            <td>P${item.pertemuan}</td>
            <td>
              <span class="badge ${item.status === 'HADIR' ? 'hadir' : 'terlambat'}">
                ${item.status}
              </span>
            </td>
          </tr>
        `;
      });
    }
    
// Grafik kehadiran
if (attendanceChart && result.grafik) {
  attendanceChart.data.labels = result.grafik.labels;
  attendanceChart.data.datasets[0].data = result.grafik.data;
  attendanceChart.update();
}
    // Grafik unit
    if (unitChart && result.unit) {
      unitChart.data.labels = Object.keys(result.unit);
      unitChart.data.datasets[0].data = Object.values(result.unit);
      unitChart.update();
    }

    // Ranking unit
    const ranking = document.getElementById("rankingContainer");
    if (ranking && result.rankingUnit) {
      let html = "";

      Object.keys(result.rankingUnit).forEach(angkatan => {
        html += `<h3>Angkatan ${angkatan}</h3>`;

        result.rankingUnit[angkatan].forEach((u,i)=>{
          const medal=["🥇","🥈","🥉"];
          html += `
            <div class="ranking-item">
              <div class="left">
                <span class="medal">${medal[i]}</span>
                <span>Unit ${u.unit}</span>
              </div>
              <div class="right">
                <b>${u.persentase}</b>
              </div>
            </div>
          `;
        });

        html += `<hr>`;
      });

      ranking.innerHTML = html;
    }

  } catch(err) {
    console.error(err);
  }
}

// Auto refresh 30 detik
window.onload = function() {
  initCharts();
  loadDashboard();
  setInterval(loadDashboard, 30000);
};
