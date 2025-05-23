"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { time: "00:00", energy: 12.4 },
  { time: "02:00", energy: 8.2 },
  { time: "04:00", energy: 6.1 },
  { time: "06:00", energy: 9.8 },
  { time: "08:00", energy: 18.5 },
  { time: "10:00", energy: 22.3 },
  { time: "12:00", energy: 25.1 },
  { time: "14:00", energy: 23.8 },
  { time: "16:00", energy: 21.2 },
  { time: "18:00", energy: 19.4 },
  { time: "20:00", energy: 16.7 },
  { time: "22:00", energy: 14.3 },
]

export function EnergyChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Area
            type="monotone"
            dataKey="energy"
            stroke="#fbbf24"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#energyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
