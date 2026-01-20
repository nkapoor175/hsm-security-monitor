import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter credentials")
      return
    }

    setError("")
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    })

    if (res.ok) {
      navigate("/otp")
    } else {
      setError("Invalid credentials")
    }
  }

  // 🔑 Press Enter to Login
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-900 text-white">

      {/* LEFT PANEL */}
      <div className="
        hidden lg:flex flex-col justify-center px-20 relative overflow-hidden
        bg-gradient-to-br from-purple-700 via-indigo-800 to-cyan-700
      ">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10">
          <img
            src="/hsm-logo.png"
            alt="HSM Guard"
            className="w-24 mb-8"
          />

          <h1 className="text-5xl font-bold leading-tight">
            Secure Access<br />to HSM Guard
          </h1>

          <p className="mt-6 text-lg text-slate-200 max-w-md">
            Real-time hardware tamper detection, cryptographic lockdown,
            and compliance-grade monitoring — all in one control plane.
          </p>

          <p className="mt-12 text-sm text-slate-300">
            Hardware Security Module • Cyber Security Track
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6">
        <div className="
          w-full max-w-md
          bg-slate-800/70 backdrop-blur-xl
          border border-slate-700
          rounded-2xl p-8
          shadow-xl
          transition
          hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]
        ">
          <h2 className="text-2xl font-bold mb-1">
            Welcome Back
          </h2>

          <p className="text-slate-400 mb-6 text-sm">
            Authorized operators only
          </p>

          {/* Username */}
          <input
            className="
              w-full mb-4 px-4 py-2 rounded-lg
              bg-slate-900 border border-slate-700
              focus:outline-none focus:border-purple-500
              focus:shadow-[0_0_10px_rgba(168,85,247,0.4)]
              transition
            "
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Password */}
          <input
            type="password"
            className="
              w-full mb-4 px-4 py-2 rounded-lg
              bg-slate-900 border border-slate-700
              focus:outline-none focus:border-purple-500
              focus:shadow-[0_0_10px_rgba(168,85,247,0.4)]
              transition
            "
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {error && (
            <p className="text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="
              w-full py-2 rounded-lg font-semibold
              bg-gradient-to-r from-purple-600 to-cyan-500
              hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]
              hover:scale-[1.02]
              transition
            "
          >
            Secure Login →
          </button>

          <p className="text-xs text-slate-400 text-center mt-6">
            Multi-factor authentication required
          </p>
        </div>
      </div>
    </div>
  )
}
