// =========================================
// DASHBOARD ADMIN PGSD FIT - FINAL
// =========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzQvc2HJKWgkX_sHiUodSwbc31wW86wUkkv26Fyfw0h95KqbixA3mKuFMejRbpR2v0s/exec?api=dashboard";

let attendanceChart;
let unitChart;


// =========================================
// INIT CHART
// =========================================
function initCharts() {

  const attendanceCanvas =
    document.getElementById("attendanceChart");

  const unitCanvas =
    document.getElementById("unitChart");

  if (!attendanceCanvas || !unitCanvas) {
    console.error("Canvas chart tidak ditemukan");
    return;
  }


  const labels =
    Array.from(
      { length: 15 },
      (_, i) => `P${i + 1}`
    );


  attendanceChart = new Chart(
    attendanceCanvas,
    {
      type: "line",

      data: {
        labels: labels,

        datasets: [{
          label: "Kehadiran",

          data:
            new Array(15).fill(0),

          borderColor: "#1565C0",

          backgroundColor:
            "rgba(21,101,192,.15)",

          fill: true,

          tension: 0.35,

          pointRadius: 4,

          pointHoverRadius: 6
        }]
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        animation: false,

        plugins: {
          legend: {
            position: "top"
          }
        },

        scales: {
          y: {
            beginAtZero: true,

            ticks: {
              precision: 0
            }
          }
        }
      }
    }
  );


  unitChart = new Chart(
    unitCanvas,
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

    const res =
      await fetch(
        API_URL +
        "&t=" +
        Date.now()
      );

    const result =
      await res.json();


    if (!result.sukses) {

      console.error(
        "Dashboard API gagal:",
        result
      );

      return;
    }


    // =======================================
    // STATISTIK
    // =======================================

    const statistik =
      result.statistik || {};


    document.getElementById(
      "hadirCount"
    ).textContent =
      statistik.hadir ?? 0;


    document.getElementById(
      "terlambatCount"
    ).textContent =
      statistik.terlambat ?? 0;


    document.getElementById(
      "izinCount"
    ).textContent =
      statistik.izin ?? 0;


    document.getElementById(
      "pesertaAktifCount"
    ).textContent =
      statistik.pesertaAktif ?? 0;


    const alphaCount =
      document.getElementById(
        "alphaCount"
      );

    if (alphaCount) {

      alphaCount.textContent =
        statistik.alpha ?? 0;
    }


    // =======================================
    // ABSENSI TERBARU
    // =======================================

    const tbody =
      document.getElementById(
        "absensiTerbaru"
      );


    if (tbody) {

      tbody.innerHTML = "";

      const terbaru =
        result.terbaru || [];


      if (!terbaru.length) {

        tbody.innerHTML = `
          <tr>
            <td
              colspan="4"
              style="
                text-align:center;
                color:#64748b;
                padding:20px;
              "
            >
              Belum ada data absensi.
            </td>
          </tr>
        `;

      } else {

        terbaru.forEach(function(item) {

          const status =
            String(
              item.status || "-"
            )
            .trim()
            .toUpperCase();


          let badgeClass =
            "alpha";


          if (status === "HADIR") {
            badgeClass = "hadir";

          } else if (
            status === "TERLAMBAT"
          ) {
            badgeClass = "terlambat";

          } else if (
            status === "ALPHA"
          ) {
            badgeClass = "alpha";
          }


          tbody.innerHTML += `
            <tr>

              <td>
                ${escapeHtml(
                  item.npm || "-"
                )}
              </td>

              <td>
                ${escapeHtml(
                  item.nama || "-"
                )}
              </td>

              <td>
                P${escapeHtml(
                  item.pertemuan || "-"
                )}
              </td>

              <td>
                <span
                  class="badge ${badgeClass}"
                >
                  ${escapeHtml(status)}
                </span>
              </td>

            </tr>
          `;
        });
      }
    }


    // =======================================
    // GRAFIK KEHADIRAN
    // =======================================

    if (
      attendanceChart &&
      result.grafik
    ) {

      attendanceChart.data.labels =
        result.grafik.labels || [];

      attendanceChart.data.datasets[0].data =
        result.grafik.data || [];

      attendanceChart.update();
    }


    // =======================================
    // GRAFIK UNIT
    // =======================================

    if (
      unitChart &&
      result.rankingUnitKeseluruhan
    ) {

      const rankingUnit =
        result.rankingUnitKeseluruhan;


      unitChart.data.labels =
        rankingUnit.map(function(item) {

          return "Unit " +
            item.unit;

        });


      unitChart.data.datasets[0].data =
        rankingUnit.map(function(item) {

          return item.hadir || 0;

        });


      unitChart.update();
    }


    // =======================================
    // RANKING UNIT + ANGKATAN
    // =======================================

    const ranking =
      document.getElementById(
        "rankingContainer"
      );


    if (ranking) {

      const data =
        result.rankingUnitAngkatan ||
        [];


      if (!data.length) {

        ranking.innerHTML = `
          <p class="loading">
            Belum ada data ranking.
          </p>
        `;

      } else {

        let html = "";

        const medal = [
          "🥇",
          "🥈",
          "🥉"
        ];


        data.forEach(
          function(item, index) {

            html += `
              <div class="ranking-item">

                <div class="left">

                  <span class="medal">
                    ${
                      medal[index] ||
                      (index + 1)
                    }
                  </span>

                  <span>
                    Unit ${escapeHtml(
                      item.unit
                    )}
                    • Angkatan
                    ${escapeHtml(
                      item.angkatan
                    )}
                  </span>

                </div>

                <div class="right">

                  <b>
                    ${escapeHtml(
                      item.persentase ||
                      "0%"
                    )}
                  </b>

                </div>

              </div>
            `;
          }
        );


        ranking.innerHTML =
          html;
      }
    }

  } catch (err) {

    console.error(
      "Error Dashboard:",
      err
    );
  }
}


// =========================================
// ESCAPE HTML
// =========================================
function escapeHtml(value) {

  return String(
    value ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// =========================================
// AUTO REFRESH
// =========================================
window.onload = function() {

  initCharts();

  loadDashboard();

  setInterval(
    loadDashboard,
    30000
  );
};
