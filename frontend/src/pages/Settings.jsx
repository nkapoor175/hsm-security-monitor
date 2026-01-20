import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

export default function Settings() {
  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <Header />

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">
            System Settings
          </h2>

          <p className="text-slate-400 text-sm">
            Configuration options are restricted to administrators.
          </p>
        </div>
      </div>
    </div>
  )
}
