export default function EventLogTable() {
  const logs = [
    { time: "12:30:21", event: "VOLTAGE_GLITCH", status: "LOCKED" },
    { time: "12:31:04", event: "ENCLOSURE_OPENED", status: "LOCKED" },
    { time: "12:35:10", event: "FAULT_INJECTION", status: "LOCKED" },
  ]

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg shadow-black/20">
      <h3 className="text-lg font-semibold mb-4">
        Tamper Event Log
      </h3>

      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-800 text-slate-400 border-b border-slate-600 z-10">
            <tr>
              <th className="py-2">Time (UTC)</th>
              <th>Event</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => {
              const statusColor =
                log.status === "LOCKED"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-green-500/20 text-green-400"

              return (
                <tr
                  key={i}
                  className="border-b border-slate-700 hover:bg-slate-700 transition-colors"
                >
                  <td className="py-2">{log.time}</td>
                  <td>{log.event}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded ${statusColor}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

