import { useNavigate, useLocation } from "react-router-dom"

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tamper Logs", path: "/logs" },
    { name: "Settings", path: "/settings" },
  ]

  const logout = async () => {
    await fetch("http://localhost:5000/auth/logout", {
      credentials: "include",
    })
    navigate("/")
  }

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen p-5 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <img
          src="/hsm-shield.png"
          alt="HSM Guard"
          className="
            w-9 h-9
            transition
            hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]
          "
        />
        <span className="text-xl font-bold tracking-wide">
          HSM Guard
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const active = location.pathname === item.path

          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                cursor-pointer px-4 py-2 rounded-lg transition
                flex items-center justify-between
                ${active
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-white"}
              `}
            >
              <span>{item.name}</span>

              {/* Active indicator */}
              {active && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
            </div>
          )
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="
          mt-6 py-2 rounded-lg font-semibold
          bg-red-600/80 hover:bg-red-600
          transition
        "
      >
        Logout
      </button>
    </aside>
  )
}
