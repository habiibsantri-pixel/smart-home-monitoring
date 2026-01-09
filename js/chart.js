let powerChart, voltageChart;
const maxPoints = 15;

export function initCharts() {
    const ctxPower = document.getElementById("powerChart").getContext("2d");
    const ctxVoltage = document.getElementById("voltageChart").getContext("2d");

    // Inisialisasi Chart Daya
    powerChart = createChartConfig(ctxPower, "Daya (Watt)", "#c77dff", "rgba(199, 125, 255, 0.1)", true);
    
    // Inisialisasi Chart Tegangan
    voltageChart = createChartConfig(ctxVoltage, "Tegangan (Volt)", "#00f2ff", "rgba(0, 242, 255, 0.1)", false);
}

function createChartConfig(ctx, label, color, bgColor, beginZero) {
    return new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: color,
                backgroundColor: bgColor,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { ticks: { color: "#fff" }, grid: { display: false } },
                y: { ticks: { color: "#fff" }, beginAtZero: beginZero }
            },
            plugins: { legend: { labels: { color: "#fff" } } }
        }
    });
}

export function updatePowerChart(val) {
    updateData(powerChart, val);
}

export function updateVoltageChart(val) {
    updateData(voltageChart, val);
}

function updateData(chart, val) {
    if (!chart) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(val);

    if (chart.data.labels.length > maxPoints) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update('none');
}