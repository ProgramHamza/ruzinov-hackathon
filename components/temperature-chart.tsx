"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { time: "00:00", temp1: 22.1, temp2: 23.5, temp3: 21.8, temp4: 18.2 },
  { time: "04:00", temp1: 21.8, temp2: 23.2, temp3: 21.5, temp4: 18.0 },
  { time: "08:00", temp1: 22.5, temp2: 24.1, temp3: 22.2, temp4: 18.5 },
  { time: "12:00", temp1: 23.2, temp2: 25.0, temp3: 23.1, temp4: 19.1 },
  { time: "16:00", temp1: 23.8, temp2: 25.5, temp3: 23.5, temp4: 19.3 },
  { time: "20:00", temp1: 23.1, temp2: 24.8, temp3: 22.9, temp4: 18.8 },
]

export function TemperatureChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            domain={["dataMin - 1", "dataMax + 1"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Line type="monotone" dataKey="temp1" stroke="#3b82f6" strokeWidth={2} dot={false} name="Conference Room" />
          <Line type="monotone" dataKey="temp2" stroke="#ef4444" strokeWidth={2} dot={false} name="Innovation Lab" />
          <Line type="monotone" dataKey="temp3" stroke="#10b981" strokeWidth={2} dot={false} name="Research Center" />
          <Line type="monotone" dataKey="temp4" stroke="#f59e0b" strokeWidth={2} dot={false} name="Data Center" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
