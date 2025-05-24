"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export function QuickStats() {
  const stats = [
    { label: "Air Quality", value: "Excellent", percentage: 45 },
    { label: "Humidity", value: "45%", percentage: 45 },
    { label: "Efficiency", value: "94%", percentage: 94 },
  ]

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            Quick Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <span className="text-sm font-medium">{stat.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
          <Badge variant="secondary" className="w-full justify-center bg-green-100 text-green-800">
            Excellent
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
