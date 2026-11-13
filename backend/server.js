const express = require("express");
const { execFile } = require("child_process");
const app = express();
const PORT = 3000;

app.use(express.json());

// Test server
app.get("/api/status", (req, res) => {
    res.json({
        message: "NetPulse backend is running!", 
        status: "online" 
    });
});

// Ping a real network device
app.get("/api/ping/:ip", (req, res) => {
    const ip = req.params.ip;

    // Validate IPv4 address
    const validIP = /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;

    if (!validIP.test(ip)) {
        return res.status(400).json({
            error: "Invalid IP address"
        });
    }

    // Adjust ping flags based on OS (Windows uses -n, Linux/macOS use -c)
    const isWindows = process.platform === "win32";
    const pingArgs = isWindows 
        ? ["-n", "4", "-w", "2000", ip] 
        : ["-c", "4", "-W", "2", ip];

    execFile("ping", pingArgs, (error, stdout, stderr) => {
        if (error) {
            return res.json({
                target: ip, 
                reachable: false, 
                message: "Device did not respond",
                output: stdout || stderr 
            });
        }

        res.json({
            target: ip,
            reachable: true,
            output: stdout
        });
    });
});

app.listen(PORT, () => {
    console.log(`NetPulse running at http://localhost:${PORT}`);
});