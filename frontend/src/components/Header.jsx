import { useLocation } from "react-router-dom"

export default function Header() {
  const location = useLocation()

  const pageTitle = {
    "/dashboard": "Dashboard",
    "/logs": "Tamper Logs",
    "/settings": "Settings",
  }[location.pathname] || "HSM Guard"

  return (
    <header className="flex items-center justify-between mb-6">

      {/* Left: Shield + Title */}
      <div className="flex items-center gap-3">
        <img
          src="/hsm-shield.png"
          alt="HSM"
          className="
            w-7 h-7
            transition
            hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]
          "
        />
        <h1 className="text-lg font-semibold text-slate-200">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Status */}
      <div className="text-sm text-slate-400">
        System Status:
        <span className="ml-2 text-green-400 font-semibold">
          SAFE
        </span>
      </div>
    </header>
  )
}


