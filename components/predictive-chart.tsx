"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { day: "Mon", actual: 156, predicted: 158 },
  { day: "Tue", actual: 142, predicted: 145 },
  { day: "Wed", actual: 168, predicted: 165 },
  { day: "Thu", actual: 175, predicted: 172 },
  { day: "Fri", actual: 189, predicted: 185 },
  { day: "Sat", actual: null, predicted: 145 },
  { day: "Sun", actual: null, predicted: 132 },
]

export function PredictiveChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            name="Actual Consumption"
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
            name="Predicted Consumption"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
