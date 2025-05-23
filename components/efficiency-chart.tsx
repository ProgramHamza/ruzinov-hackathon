"use client"

import { RadialBar, RadialBarChart, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "HVAC", efficiency: 92, fill: "#3b82f6" },
  { name: "Lighting", efficiency: 88, fill: "#f59e0b" },
  { name: "Security", efficiency: 95, fill: "#10b981" },
  { name: "Overall", efficiency: 87, fill: "#8b5cf6" },
]

export function EfficiencyChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={data}>
          <RadialBar
            minAngle={15}
            label={{ position: "insideStart", fill: "#fff", fontSize: 12 }}
            background
            clockWise
            dataKey="efficiency"
          />
          <Legend iconSize={10} wrapperStyle={{ color: "#fff", fontSize: "12px" }} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}
