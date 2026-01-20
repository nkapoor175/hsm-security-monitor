const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// =====================
// USER AUTH
// =====================
const USERNAME = "admin";
const PASSWORD = "secure123";
let activeToken = null;

// =====================
// OTP
// =====================
let activeOTP = null;
let otpAttempts = 0;

// =====================
// SYSTEM STATE
// =====================
let systemLocked = false;
let sensorsActive = true;
let zeroized = false;
let uptimeStart = Date.now();

// =====================
// LOG FILE
// =====================
const LOG_FILE = path.join(__dirname, "logs.json");

function readLogs() {
  if (!fs.existsSync(LOG_FILE)) return [];
  const data = fs.readFileSync(LOG_FILE, "utf8");
  if (!data.trim()) return [];
  return JSON.parse(data);
}

function writeLogs(logs) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

function addLog(event, status) {
  const logs = readLogs();
  logs.push({
    time: new Date().toISOString(),
    event,
    status
  });
  writeLogs(logs);
}

// =====================
// HEALTH
// =====================
app.get("/", (_, res) => res.send("HSM Backend Running"));

// =====================
// LOGIN
// =====================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    activeToken = Math.random().toString(36).substring(2);
    return res.json({ token: activeToken });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// =====================
// AUTH MIDDLEWARE
// =====================
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];
  if (token !== activeToken)
    return res.status(403).json({ error: "Invalid token" });

  next();
}

// =====================
// STATUS
// =====================
app.get("/status", requireAuth, (req, res) => {
  res.json({ locked: systemLocked, sensorsActive, zeroized });
});

// =====================
// UPTIME
// =====================
app.get("/uptime", requireAuth, (req, res) => {
  res.json({
    uptimeSeconds: Math.floor((Date.now() - uptimeStart) / 1000)
  });
});

// =====================
// HARDWARE LOG
// =====================
app.post("/log", (req, res) => {
  const { event, status } = req.body;
  if (!event || !status)
    return res.status(400).json({ error: "Invalid log" });

  if (sensorsActive) {
    if (status === "LOCKED") systemLocked = true;
    addLog(event, status);
  }
  res.json({ success: true });
});

// =====================
// LOG VIEW
// =====================
app.get("/logs", requireAuth, (req, res) => {
  res.json(readLogs());
});

// =====================
// OTP
// =====================
app.post("/request-otp", requireAuth, (req, res) => {
  activeOTP = Math.floor(100000 + Math.random() * 900000).toString();
  otpAttempts = 0;
  console.log("OTP:", activeOTP);
  res.json({ message: "OTP sent" });
});

app.post("/verify-otp", requireAuth, (req, res) => {
  const { otp } = req.body;
  if (!activeOTP) return res.status(400).json({ error: "No OTP" });

  if (otp === activeOTP) {
    activeOTP = null;
    return res.json({ success: true });
  }

  otpAttempts++;
  if (otpAttempts >= 3) {
    systemLocked = true;
    addLog("OTP_FAILED", "LOCKED");
  }

  res.status(401).json({ error: "Wrong OTP" });
});

// =====================
// RESET
// =====================
app.post("/reset", requireAuth, (req, res) => {
  systemLocked = false;
  zeroized = false;
  uptimeStart = Date.now();
  addLog("SYSTEM_RESET", "SAFE");
  res.json({ success: true });
});

// =====================
// MAINTENANCE
// =====================
app.post("/deactivate", requireAuth, (req, res) => {
  sensorsActive = false;
  addLog("MAINTENANCE_MODE", "SAFE");
  res.json({ success: true });
});

app.post("/reactivate", requireAuth, (req, res) => {
  sensorsActive = true;
  addLog("SYSTEM_ARMED", "SAFE");
  res.json({ success: true });
});

// =====================
// ZEROIZATION
// =====================
app.post("/zeroize", requireAuth, (req, res) => {
  zeroized = true;
  systemLocked = true;
  addLog("KEY_ZEROIZED", "LOCKED");
  res.json({ success: true });
});

// =====================
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
