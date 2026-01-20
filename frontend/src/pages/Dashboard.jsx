import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import StatusCards from "../components/StatusCards"
import TamperGraph from "../components/TamperGraph"
import EventLogTable from "../components/EventLogTable"
import LockdownPanel from "../components/LockdownPanel"
import SensorStatusPanel from "../components/SensorStatusPanel"
import { apiGet, apiPost } from "../api"

function Dashboard() {
  /* =======================
     🔹 STATE (APPENDED ONLY)
  ======================= */
  const [status, setStatus] = useState(null)
  const [logs, setLogs] = useState([])
  const [uptime, setUptime] = useState(0)
  const [alertVisible, setAlertVisible] = useState(false)

  /* =======================
     🔹 AUTH CHECK (UNCHANGED)
  ======================= */
  useEffect(() => {
    fetch("http://localhost:5000/auth/status", {
      credentials: "include",
    }).then((res) => {
      if (!res.ok) window.location.href = "/"
    })
  }, [])

  /* =======================
     🔹 BACKEND DATA FETCH
  ======================= */
  useEffect(() => {
    async function loadData() {
      try {
        const statusRes = await apiGet("/status")
        const logsRes = await apiGet("/logs")
        const uptimeRes = await apiGet("/uptime")

        setStatus(statusRes)
        setLogs(logsRes.reverse())
        setUptime(uptimeRes.uptimeSeconds)

        if (statusRes.locked) setAlertVisible(true)
      } catch (err) {
        console.error("Backend fetch error", err)
      }
    }

    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [])

  /* =======================
     🔹 SYSTEM STATUS LOGIC
  ======================= */
  const systemStatus = status?.zeroized
    ? "ZEROIZED"
    : status?.locked
    ? "LOCKED"
    : status?.sensorsActive
    ? "SAFE"
    : "MAINTENANCE"

  const dangerClass =
    systemStatus === "LOCKED" || systemStatus === "ZEROIZED"
      ? "danger-pulse border border-red-500/40"
      : "border border-transparent"

  /* =======================
     🔹 HELPERS
  ======================= */
  function formatUptime(sec) {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h}h ${m}m ${s}s`
  }

  /* =======================
     🔹 OTP RESET HANDLER
  ======================= */
  async function requestResetOTP() {
    await apiPost("/request-otp")
    alert("OTP sent (check backend console)")
  }

  async function submitOTP(otp) {
    const res = await apiPost("/verify-otp", { otp })
    if (res.success) {
      await apiPost("/reset")
      setAlertVisible(false)
    }
  }

  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <Header systemStatus={systemStatus} />

        {/* =======================
            🚨 CRITICAL ALERT BANNER
        ======================= */}
        {alertVisible && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-400">
            🚨 <b>CRITICAL ALERT SENT</b>
            <ul className="mt-2 text-sm">
              <li>• Push notification</li>
              <li>• Email alert</li>
              <li>• SOC dashboard</li>
            </ul>
          </div>
        )}

        {/* =======================
            🔹 STATUS CARDS
        ======================= */}
        <div className={`rounded-xl p-1 ${dangerClass}`}>
          <StatusCards
            systemStatus={systemStatus}
            uptime={formatUptime(uptime)}
            lastTamper={logs[0]?.time || "—"}
          />
        </div>

        {/* =======================
            🔹 SENSOR STATUS
        ======================= */}
        <SensorStatusPanel status={status} />

        {/* =======================
            🔹 GRAPH + LOCKDOWN
        ======================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className={`lg:col-span-2 rounded-xl ${dangerClass}`}>
            <TamperGraph />
          </div>

          <div className={`rounded-xl ${dangerClass}`}>
            <LockdownPanel
              onDeactivate={() => apiPost("/deactivate")}
              onReactivate={() => apiPost("/reactivate")}
              onReset={requestResetOTP}
              onZeroize={() => apiPost("/zeroize")}
            />
          </div>
        </div>

        {/* =======================
            🔹 EVENT LOG TABLE
        ======================= */}
        <div className={`mt-6 rounded-xl ${dangerClass}`}>
          <EventLogTable logs={logs} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
