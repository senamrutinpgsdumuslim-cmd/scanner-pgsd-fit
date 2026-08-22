// =========================================
// DASHBOARD ADMIN PGSD FIT - FINAL
// =========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbzQvc2HJKWgkX_sHiUodSwbc31wW86wUkkv26Fyfw0h95KqbixA3mKuFMejRbpR2v0s/exec?api=dashboard";

let attendanceChart = null;
let unitChart = null;

let absensiTerbaruData = [];


// =========================================
// INIT CHART
// =========================================
function initCharts() {

  const attendanceCanvas =
    document.getElementById("attendanceChart");

  const unitCanvas =
    document.getElementById("unitChart");

  if (!attendanceCanvas || !unitCanvas) {
    console.error("Canvas chart tidak ditemukan.");
    return;
  }


  // =======================================
  // GRAFIK KEHADIRAN
  // =======================================

  const labels =
    Array.from(
      { length: 15 },
      (_, i) => `P${i + 1}`
    );


  attendanceChart =
    new Chart(
      attendanceCanvas,
      {
        type: "line",

        data: {
          labels: labels,

          datasets: [{
            label: "Kehadiran",

            data: new Array(15).fill(0),

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


  // =======================================
  // GRAFIK KEHADIRAN PER UNIT
  // =======================================

  unitChart =
    new Chart(
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

    const response =
      await fetch(
        API_URL +
        "&t=" +
        Date.now()
      );


    const result =
      await response.json();


    if (!result || !result.sukses) {

      console.error(
        "Dashboard API gagal:",
        result
      );

      return;
    }


    // =======================================
    // STATISTIK
    // =======================================

    renderStatistik(
      result.statistik || {}
    );


    // =======================================
    // ABSENSI TERBARU
    // Maksimal data sesuai kiriman backend
    // HADIR + TERLAMBAT + ALPHA
    // =======================================

    absensiTerbaruData =
      Array.isArray(result.terbaru)
        ? result.terbaru
        : [];


    renderAbsensiTerbaru(
      absensiTerbaruData
    );


    // =======================================
    // SEARCH ABSENSI
    // =======================================

    setupSearchAbsensi();


    // =======================================
    // GRAFIK KEHADIRAN PER PERTEMUAN
    // =======================================

    if (
      attendanceChart &&
      result.grafik
    ) {

      attendanceChart.data.labels =
        Array.isArray(
          result.grafik.labels
        )
          ? result.grafik.labels
          : [];


      attendanceChart.data
        .datasets[0]
        .data =
        Array.isArray(
          result.grafik.data
        )
          ? result.grafik.data
          : [];


      attendanceChart.update();
    }


    // =======================================
    // GRAFIK SEMUA UNIT
    // =======================================

    if (
      unitChart &&
      Array.isArray(
        result.rankingUnitKeseluruhan
      )
    ) {

      const dataUnit =
        result.rankingUnitKeseluruhan;


      unitChart.data.labels =
        dataUnit.map(
          function(item) {

            return (
              "Unit " +
              String(
                item.unit || "-"
              )
            );

          }
        );


      unitChart.data.datasets[0].data =
        dataUnit.map(
          function(item) {

            return Number(
              item.hadir || 0
            );

          }
        );


      unitChart.update();
    }

    // =======================================
    // KLASEMEN UNIT PER ANGKATAN
    // =======================================

    renderRankingUnitPerAngkatan(
      result.rankingUnit || {}
    );


  } catch (error) {

    console.error(
      "Error Dashboard:",
      error
    );
  }
}


// =========================================
// RENDER STATISTIK
// =========================================
function renderStatistik(
  statistik
) {

  const hadirCount =
    document.getElementById(
      "hadirCount"
    );

  const terlambatCount =
    document.getElementById(
      "terlambatCount"
    );

  const izinCount =
    document.getElementById(
      "izinCount"
    );

  const pesertaAktifCount =
    document.getElementById(
      "pesertaAktifCount"
    );

  const alphaCount =
    document.getElementById(
      "alphaCount"
    );


  if (hadirCount) {

    hadirCount.textContent =
      statistik.hadir ?? 0;
  }


  if (terlambatCount) {

    terlambatCount.textContent =
      statistik.terlambat ?? 0;
  }


  if (izinCount) {

    izinCount.textContent =
      statistik.izin ?? 0;
  }


  if (pesertaAktifCount) {

    pesertaAktifCount.textContent =
      statistik.pesertaAktif ?? 0;
  }


  // Dipakai jika kartu Alpha sudah tersedia
  if (alphaCount) {

    alphaCount.textContent =
      statistik.alpha ?? 0;
  }
}


// =========================================
// RENDER ABSENSI TERBARU
// SEMUA STATUS:
// HADIR
// TERLAMBAT
// ALPHA
// =========================================
function renderAbsensiTerbaru(
  data
) {

  const tbody =
    document.getElementById(
      "absensiTerbaru"
    );


  if (!tbody) {
    return;
  }


  tbody.innerHTML = "";


  if (!data.length) {

    tbody.innerHTML = `
      <tr>
        <td
          colspan="4"
          style="
            text-align:center;
            color:#64748b;
            padding:24px;
          "
        >
          Data absensi tidak ditemukan.
        </td>
      </tr>
    `;

    return;
  }


  data.forEach(
    function(item) {

      const status =
        String(
          item.status || "-"
        )
        .trim()
        .toUpperCase();


      let badgeClass =
        "alpha";


      if (status === "HADIR") {

        badgeClass =
          "hadir";

      } else if (
        status === "TERLAMBAT"
      ) {

        badgeClass =
          "terlambat";

      } else if (
        status === "ALPHA"
      ) {

        badgeClass =
          "alpha";
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
              ${escapeHtml(
                status
              )}
            </span>
          </td>

        </tr>
      `;
    }
  );
}


// =========================================
// SEARCH ABSENSI
// Cari berdasarkan:
// Nama
// NPM
// Unit
// Status
// Pertemuan
// =========================================
function setupSearchAbsensi() {

  const input =
    document.getElementById(
      "searchAbsensi"
    );


  if (!input) {
    return;
  }


  // Hindari event listener berulang
  if (
    input.dataset.searchReady === "true"
  ) {
    return;
  }


  input.dataset.searchReady =
    "true";


  input.addEventListener(
    "input",
    function() {

      const keyword =
        String(
          this.value || ""
        )
        .trim()
        .toLowerCase();


      if (!keyword) {

        renderAbsensiTerbaru(
          absensiTerbaruData
        );

        return;
      }


      const hasil =
        absensiTerbaruData.filter(
          function(item) {

            const nama =
              String(
                item.nama || ""
              ).toLowerCase();


            const npm =
              String(
                item.npm || ""
              ).toLowerCase();


            const unit =
              String(
                item.unit || ""
              ).toLowerCase();


            const status =
              String(
                item.status || ""
              ).toLowerCase();


            const pertemuan =
              String(
                item.pertemuan || ""
              ).toLowerCase();


            return (
              nama.includes(keyword) ||
              npm.includes(keyword) ||
              unit.includes(keyword) ||
              status.includes(keyword) ||
              pertemuan.includes(keyword)
            );
          }
        );


      renderAbsensiTerbaru(
        hasil
      );
    }
  );
}


// =========================================
// KLASEMEN UNIT PER ANGKATAN
// =========================================
function renderRankingUnitPerAngkatan(
  data
) {

  const ranking =
    document.getElementById(
      "rankingContainer"
    );


  if (!ranking) {
    return;
  }


  const angkatanKeys =
    Object.keys(
      data || {}
    )
    .sort(
      function(a, b) {

        return String(b)
          .localeCompare(
            String(a)
          );

      }
    );


  if (!angkatanKeys.length) {

    ranking.innerHTML = `
      <p class="loading">
        Belum ada data klasemen.
      </p>
    `;

    return;
  }


  const medal = [
    "🥇",
    "🥈",
    "🥉"
  ];


  let html = "";


  angkatanKeys.forEach(
    function(angkatan) {

      const daftarUnit =
        Array.isArray(
          data[angkatan]
        )
          ? data[angkatan]
          : [];


      // Judul angkatan
      html += `
        <div
          class="ranking-angkatan-title"
          style="
            margin-top:22px;
            margin-bottom:10px;
            font-size:18px;
            font-weight:800;
            color:#174ea6;
          "
        >
          Angkatan
          ${escapeHtml(
            angkatan
          )}
        </div>
      `;


      daftarUnit.forEach(
        function(item, index) {

          html += `
            <div
              class="ranking-item"
            >

              <div
                class="left"
              >

                <span
                  class="medal"
                >
                  ${
                    medal[index] ||
                    (index + 1)
                  }
                </span>

                <span>
                  Unit
                  ${escapeHtml(
                    item.unit || "-"
                  )}
                </span>

              </div>


              <div
                class="right"
              >

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

    }
  );


  ranking.innerHTML =
    html;
}


// =========================================
// ESCAPE HTML
// =========================================
function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

// =========================================
// LEVEL & TAHAP STREAK
// =========================================
function getLevelTahapStreak(streak) {

  const nilai = Number(streak) || 0;

  if (nilai <= 0) {
    return {
      level: "0",
      tahap: "BELUM MULAI"
    };
  }

  if (nilai <= 4) {
    return {
      level: "1",
      tahap: "AWAL"
    };
  }

  if (nilai <= 9) {
    return {
      level: "2",
      tahap: "MENENGAH"
    };
  }

  if (nilai <= 14) {
    return {
      level: "3",
      tahap: "LANJUT"
    };
  }

  return {
    level: "MAX",
    tahap: "MAX"
  };
}
// =========================================
// STREAK PESERTA
// =========================================

const STREAK_API =
  "https://script.google.com/macros/s/AKfycbzQvc2HJKWgkX_sHiUodSwbc31wW86wUkkv26Fyfw0h95KqbixA3mKuFMejRbpR2v0s/exec?api=allStreak";


let streakData = [];


// =========================================
// LOAD STREAK
// =========================================

async function loadAllStreak() {

  try {

    const response =
      await fetch(
        STREAK_API +
        "&t=" +
        Date.now()
      );


    const result =
      await response.json();


    if (
      !result ||
      !result.sukses
    ) {

      console.error(
        "API Streak gagal:",
        result
      );

      tampilStreakKosong();

      return;
    }


    streakData =
      Array.isArray(result.data)
        ? result.data
        : [];


    renderAllStreak(
      streakData
    );


    renderStreakStats(
      streakData
    );


  } catch (error) {

    console.error(
      "Error Streak:",
      error
    );

    tampilStreakKosong();

  }

}


// =========================================
// RENDER STREAK
// =========================================

function renderAllStreak(
  data
) {

  const tbody =
    document.getElementById(
      "streakPeserta"
    );


  if (!tbody) {
    return;
  }


  tbody.innerHTML = "";


  if (!data.length) {

    tbody.innerHTML = `
      <tr>
        <td
          colspan="8"
          style="
            text-align:center;
            color:#64748b;
            padding:24px;
          "
        >
          Belum ada data streak.
        </td>
      </tr>
    `;

    return;
  }


  data.forEach(
    function(item,index) {

      const streak =
        Number(
          item.streak || 0
        );


const levelTahap =
  getLevelTahapStreak(streak);

const level =
  levelTahap.level;

const tahap =
  levelTahap.tahap;


      let medal = "";


      if (index === 0) {

        medal = "🥇";

      } else if (index === 1) {

        medal = "🥈";

      } else if (index === 2) {

        medal = "🥉";

      }


      tbody.innerHTML += `

        <tr>

          <td>
            ${
              medal ||
              (item.rank || index + 1)
            }
          </td>

          <td>
            ${escapeHtml(
              item.nama || "-"
            )}
          </td>

          <td>
            ${escapeHtml(
              item.npm || "-"
            )}
          </td>

          <td>
            ${escapeHtml(
              item.angkatan || "-"
            )}
          </td>

          <td>
            ${escapeHtml(
              item.unit || "-"
            )}
          </td>

          <td>

            <strong>
              🔥 ${streak}
            </strong>

          </td>

          <td>
            Level ${escapeHtml(
              level
            )}
          </td>

          <td>
            ${escapeHtml(
              tahap
            )}
          </td>

        </tr>

      `;

    }
  );

}


// =========================================
// STATISTIK STREAK
// =========================================

function renderStreakStats(
  data
) {

  let streak0 = 0;
  let streak1 = 0;
  let streak5 = 0;
  let streak10 = 0;
  let streak15 = 0;


  data.forEach(
    function(item) {

      const streak =
        Number(
          item.streak || 0
        );


      if (streak === 0) {

        streak0++;

      } else if (
        streak >= 1 &&
        streak <= 4
      ) {

        streak1++;

      } else if (
        streak >= 5 &&
        streak <= 9
      ) {

        streak5++;

      } else if (
        streak >= 10 &&
        streak <= 14
      ) {

        streak10++;

      } else if (
        streak >= 15
      ) {

        streak15++;

      }

    }
  );


  setStreakNumber(
    "streak0",
    streak0
  );

  setStreakNumber(
    "streak1",
    streak1
  );

  setStreakNumber(
    "streak5",
    streak5
  );

  setStreakNumber(
    "streak10",
    streak10
  );

  setStreakNumber(
    "streak15",
    streak15
  );

}


// =========================================
// SET ANGKA STREAK
// =========================================

function setStreakNumber(
  id,
  value
) {

  const el =
    document.getElementById(
      id
    );


  if (el) {

    el.textContent =
      value;

  }

}


// =========================================
// SEARCH STREAK
// =========================================

function filterStreak() {

  const input =
    document.getElementById(
      "searchStreak"
    );


  if (!input) {
    return;
  }


  const keyword =
    String(
      input.value || ""
    )
    .trim()
    .toLowerCase();


  if (!keyword) {

    renderAllStreak(
      streakData
    );

    return;
  }


  const hasil =
    streakData.filter(
      function(item) {

        const nama =
          String(
            item.nama || ""
          ).toLowerCase();


        const npm =
          String(
            item.npm || ""
          ).toLowerCase();


        const unit =
          String(
            item.unit || ""
          ).toLowerCase();


        const angkatan =
          String(
            item.angkatan || ""
          ).toLowerCase();


        return (
          nama.includes(keyword) ||
          npm.includes(keyword) ||
          unit.includes(keyword) ||
          angkatan.includes(keyword)
        );

      }
    );


  renderAllStreak(
    hasil
  );

}


// =========================================
// JIKA STREAK GAGAL
// =========================================

function tampilStreakKosong() {

  const tbody =
    document.getElementById(
      "streakPeserta"
    );


  if (!tbody) {
    return;
  }


  tbody.innerHTML = `
    <tr>
      <td
        colspan="8"
        style="
          text-align:center;
          color:#64748b;
          padding:24px;
        "
      >
        Data streak tidak tersedia.
      </td>
    </tr>
  `;

}

// =========================================
// START DASHBOARD
// =========================================
window.addEventListener(
  "load",
  function() {

    initCharts();

    loadDashboard();

    setInterval(
      loadDashboard,
      30000
    );
  }
);
