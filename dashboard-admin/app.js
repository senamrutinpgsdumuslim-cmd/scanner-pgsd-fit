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
        plugins: {
          legend: {
            position: "bottom"
          }
        }
      }
    }
  );

}

// =========================================
// LOAD DASHBOARD
// =========================================
async function loadDashboard() {

  try {

    const res = await fetch(API_URL);
    const result = await res.json();

    console.log(result);

    if (!result.sukses) return;

    // =========================
    // STATISTIK
    // =========================
    document.getElementById("hadirCount").textContent =
      result.statistik.hadir;

    document.getElementById("terlambatCount").textContent =
      result.statistik.terlambat;

    document.getElementById("izinCount").textContent =
      result.statistik.izin;

    document.getElementById("pesertaAktifCount").textContent =
      result.statistik.pesertaAktif;

    // =========================
    // ABSENSI TERBARU
    // =========================
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
              <span class="badge ${item.status === "HADIR" ? "hadir" : "terlambat"}">
                ${item.status}
              </span>
            </td>
          </tr>
        `;

      });

    }

    // =========================
    // GRAFIK UNIT
    // =========================
    if (unitChart && result.unit) {

      const labels = Object.keys(result.unit);
      const values = Object.values(result.unit);

      unitChart.data.labels = labels;
      unitChart.data.datasets[0].data = values;
      unitChart.update();

    }

    // =========================
    // RANKING UNIT PER ANGKATAN
    // =========================
    const rankingContainer =
      document.getElementById("rankingContainer");

    if (rankingContainer && result.rankingUnit) {

      let html = "";

      Object.keys(result.rankingUnit).forEach(angkatan => {

        html += `
          <div class="ranking-section">
            <h3>🏆 Angkatan ${angkatan}</h3>
            <table class="ranking-table">
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Unit</th>
                  <th>Persentase</th>
                  <th>Hadir</th>
                </tr>
              </thead>
              <tbody>
        `;

        const medal = ["🥇","🥈","🥉"];

        result.rankingUnit[angkatan].forEach((u,i)=>{

          html += `
            <tr>
              <td>${medal[i] || (i+1)}</td>
              <td><b>Unit ${u.unit}</b></td>
              <td>${u.persentase}</td>
              <td>${u.hadir}</td>
            </tr>
          `;

        });

        html += `
              </tbody>
            </table>
          </div>
        `;

      });

      rankingContainer.innerHTML = html;

    }

  } catch(err) {

    console.error("Dashboard error:", err);

  }

}

// =========================================
// AUTO REFRESH
// =========================================
window.onload = function () {

  initCharts();
  loadDashboard();

  // refresh otomatis setiap 30 detik
  setInterval(loadDashboard, 30000);

};
