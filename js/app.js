const latencyElement = document.getElementById("latency");
const packetLossElement = document.getElementById("packetLoss");
const deviceCountElement = document.getElementById("deviceCount");
const uptimeElement = document.getElementById("uptime");
const canvas = document.getElementById("latencyChart");
const ctx = canvas.getContext("2d");

let latencyHistory = Array.from({ length: 20 }, () => Math.floor(Math.random() * 25) + 15);

// Set canvas resolution correctly
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawChart();
}

// Draw performance chart
function drawChart() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    const maxValue = 100;

    // Horizontal grid lines
    ctx.strokeStyle = "#26364d";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Plot latency values
    const step = width / (latencyHistory.length - 1);

    ctx.beginPath();

    latencyHistory.forEach((value, index) => {
        const x = index * step;
        const y = height - (value / maxValue) * height;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw data points
    latencyHistory.forEach((value, index) => {
        const x = index * step;
        const y = height - (value / maxValue) * height;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);

        ctx.fillStyle = "#38bdf8";
        ctx.fill();
    });
}

// Generate simulated network data
function updateNetwork() {
    const latency = Math.floor(Math.random() * 30) + 15;
    const packetLoss = Math.random() > 0.95 ? (Math.random() * 0.5).toFixed(1) : "0.0";

    latencyElement.innerHTML = `${latency}<small>ms</small>`;
    packetLossElement.innerHTML = `${packetLoss}<small>%</small>`;

    latencyHistory.push(latency);

    if (latencyHistory.length > 20) {
        latencyHistory.shift();
    }

    drawChart();
}

// Start dashboard simulation
updateNetwork();
resizeCanvas();

setInterval(updateNetwork, 2000);

window.addEventListener("resize", resizeCanvas);

// PING TEST SIMULATION
async function runPing() {
    const target = document.getElementById("target").value.trim();
    const output = document.getElementById("terminalOutput");
    const button = document.getElementById("pingButton");

    // Validate input
    const validIP = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;

    if (!validIP.test(target)) {
        output.innerHTML = '<p class="terminal-error">ERROR: Enter a valid IPv4 address.</p>';
        return;
    }

    button.disabled = true;
    button.textContent = "Testing...";

    output.innerHTML = `<p class="terminal-success">Starting diagnostic...</p><p class="terminal-muted">Target: ${target}</p><p class="terminal-muted">Sending simulated packets...</p>`;

    const result = [];

    for (let i = 1; i <= 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 650));

        const response = Math.floor(Math.random() * 30) + 10;
        result.push(response);

        output.innerHTML += `<p class="terminal-success">Reply from ${target}: bytes = 32 time = ${response}ms TTL = 64</p>`;
    }

    const average = (
        result.reduce((sum, value) => sum + value, 0) / result.length
    ).toFixed(2);

    const minimum = Math.min(...result);
    const maximum = Math.max(...result);

    output.innerHTML += `<br><p class="terminal-success">Diagnostic completed.</p><p>Packages: Sent = 4, Received = 4, Lost = 0 (0% loss)</p><p>Minimum = ${minimum}ms</p><p>Maximum = ${maximum}ms</p><p>Average = ${average}ms</p>`;

    button.disabled = false;
    button.textContent = "Run Ping Test ->";
}