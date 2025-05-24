"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Thermometer, Users, Zap, TrendingUp, AlertTriangle, Target, TrendingDown } from "lucide-react"

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Temperature Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Temperature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">22.5</span>
            <span className="text-lg text-gray-500 mb-1">°C</span>
            <AlertTriangle className="w-5 h-5 text-red-500 mb-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <Target className="w-3 h-3" />
                Target
              </span>
              <span className="font-medium">22.0°C</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Deviation</span>
              <span className="font-medium text-red-600">+0.5°C</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          <Badge variant="destructive" className="w-full justify-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Temperature Alert
          </Badge>
        </CardContent>
      </Card>

      {/* Occupancy Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Occupancy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">3</span>
            <span className="text-lg text-gray-500 mb-1">people</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Capacity</span>
              <span className="font-medium">8 people</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Utilization</span>
              <span className="font-medium text-green-600">37.5%</span>
            </div>
            <Progress value={37.5} className="h-2" />
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 flex-1 justify-center">
              Normal
            </Badge>
            <Badge variant="outline" className="flex-1 justify-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +1 vs 1h ago
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Energy Usage Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Energy Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">2.3</span>
            <span className="text-lg text-gray-500 mb-1">kW</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">vs Public Avg</span>
              <span className="font-medium text-green-600 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -12%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Daily Budget</span>
              <span className="font-medium">55.2 kWh</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>

          <Badge variant="secondary" className="w-full justify-center bg-green-100 text-green-800">
            Efficient
          </Badge>
        </CardContent>
      </Card>

      {/* Efficiency Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            System Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">94</span>
            <span className="text-lg text-gray-500 mb-1">%</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">This Week</span>
              <span className="font-medium text-green-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +3%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Target</span>
              <span className="font-medium">90%</span>
            </div>
            <Progress value={94} className="h-2" />
          </div>

          <Badge variant="secondary" className="w-full justify-center bg-blue-100 text-blue-800">
            Excellent
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
