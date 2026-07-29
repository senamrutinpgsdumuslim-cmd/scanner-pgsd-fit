// =====================================
// DASHBOARD ADMIN PGSD FIT
// =====================================

// Jam realtime di header
function updateClock(){

    const now = new Date();

    const options = {
        weekday:'long',
        day:'2-digit',
        month:'long',
        year:'numeric',
        hour:'2-digit',
        minute:'2-digit',
        second:'2-digit'
    };

    const clock = document.getElementById('clock');

    if(clock){
        clock.textContent = now.toLocaleString('id-ID', options);
    }

}

setInterval(updateClock,1000);
updateClock();

// Grafik kehadiran
const attendanceCtx = document.getElementById('attendanceChart');

if(attendanceCtx){

    new Chart(attendanceCtx,{
        type:'line',
        data:{
            labels:[
                'P1',
                'P2',
                'P3',
                'P4',
                'P5',
                'P6',
                'P7',
                'P8'
            ],
            datasets:[
                {
                    label:'Hadir',
                    data:[
                        180,
                        190,
                        205,
                        198,
                        220,
                        214,
                        230,
                        242
                    ],
                    borderColor:'#1565C0',
                    backgroundColor:'rgba(21,101,192,.12)',
                    fill:true,
                    tension:.35,
                    pointRadius:4,
                    pointBackgroundColor:'#1565C0'
                }
            ]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                legend:{
                    display:false
                }
            },
            scales:{
                y:{
                    beginAtZero:true
                }
            }
        }
    });

}

// Grafik unit
const unitCtx = document.getElementById('unitChart');

if(unitCtx){

    new Chart(unitCtx,{
        type:'doughnut',
        data:{
            labels:[
                'Unit A',
                'Unit B',
                'Unit C',
                'Unit D'
            ],
            datasets:[
                {
                    data:[
                        72,
                        64,
                        58,
                        71
                    ],
                    backgroundColor:[
                        '#1565C0',
                        '#16A34A',
                        '#F97316',
                        '#7C3AED'
                    ],
                    borderWidth:0
                }
            ]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,
            plugins:{
                legend:{
                    position:'bottom'
                }
            }
        }
    });

}

// Contoh update statistik realtime
function updateStats(){

    const cards = document.querySelectorAll('.number');

    cards.forEach(function(card){

        const value = parseInt(card.textContent,10);

        if(!isNaN(value)){
            card.textContent = value;
        }

    });

}

updateStats();
