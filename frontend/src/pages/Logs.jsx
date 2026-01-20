import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import EventLogTable from "../components/EventLogTable"

export default function Logs() {
  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <Header />
        <EventLogTable />
      </div>
    </div>
  )
}
