"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { room: "Conf A", occupancy: 8, capacity: 12 },
  { room: "Lab B", occupancy: 15, capacity: 20 },
  { room: "Research", occupancy: 3, capacity: 8 },
  { room: "Data Ctr", occupancy: 1, capacity: 4 },
  { room: "Lounge", occupancy: 5, capacity: 15 },
  { room: "Training", occupancy: 22, capacity: 25 },
]

export function OccupancyChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="room" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Bar dataKey="capacity" fill="rgba(107, 114, 128, 0.3)" radius={[4, 4, 0, 0]} name="Capacity" />
          <Bar dataKey="occupancy" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Current Occupancy" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
