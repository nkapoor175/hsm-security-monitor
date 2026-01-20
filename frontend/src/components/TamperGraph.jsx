import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { time: "10:00", events: 0 },
  { time: "10:05", events: 1 },
  { time: "10:10", events: 3 },
  { time: "10:15", events: 2 },
  { time: "10:20", events: 4 },
]

export default function TamperGraph() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg shadow-black/20">
      <h3 className="text-lg font-semibold mb-4">
        Tamper Activity Timeline
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Line
            type="natural"
            dataKey="events"
            stroke="#a855f7"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
