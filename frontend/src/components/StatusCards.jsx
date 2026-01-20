import { useEffect, useState } from "react"

export default function StatusCards({ systemStatus }) {
  const [uptime, setUptime] = useState(0)
  const [lastTamperTime, setLastTamperTime] = useState(null)
  const [keysZeroized, setKeysZeroized] = useState(false)

  // ⏱️ Uptime timer
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 🔴 On LOCKED → zeroize keys + reset uptime
  useEffect(() => {
    if (systemStatus === "LOCKED") {
      setUptime(0)
      setLastTamperTime(new Date().toUTCString())
      setKeysZeroized(true)
    }

    if (systemStatus === "SAFE") {
      setKeysZeroized(false)
    }
  }, [systemStatus])

  const formatUptime = () => {
    const h = Math.floor(uptime / 3600)
    const m = Math.floor((uptime % 3600) / 60)
    const s = uptime % 60
    return `${h}h ${m}m ${s}s`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* SYSTEM STATE */}
      <div className="bg-slate-800 rounded-xl p-4">
        <p className="text-sm text-gray-400">System State</p>
        <p
          className={`text-xl font-bold ${
            systemStatus === "LOCKED"
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {systemStatus}
        </p>
      </div>

      {/* UPTIME */}
      <div className="bg-slate-800 rounded-xl p-4">
        <p className="text-sm text-gray-400">System Uptime</p>
        <p className="text-xl font-bold text-cyan-400">
          {formatUptime()}
        </p>
      </div>

      {/* LAST TAMPER */}
      <div className="bg-slate-800 rounded-xl p-4">
        <p className="text-sm text-gray-400">Last Tamper</p>
        <p className="text-sm font-medium text-yellow-400">
          {lastTamperTime ?? "—"}
        </p>
      </div>

      {/* 🔐 KEY ZEROIZATION */}
      <div
        className={`rounded-xl p-4 border ${
          keysZeroized
            ? "bg-red-500/10 border-red-500/40"
            : "bg-slate-800 border-transparent"
        }`}
      >
        <p className="text-sm text-gray-400">Cryptographic Keys</p>
        <p
          className={`text-xl font-bold ${
            keysZeroized
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {keysZeroized ? "ZEROIZED" : "ACTIVE"}
        </p>
      </div>

      {/* SECURITY MODE */}
      <div className="bg-slate-800 rounded-xl p-4">
        <p className="text-sm text-gray-400">Security Mode</p>
        <p className="text-xl font-bold text-purple-400">
          HSM Active
        </p>
      </div>
    </div>
  )
}
