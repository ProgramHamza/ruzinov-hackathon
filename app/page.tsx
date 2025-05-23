"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Thermometer, Users, Zap, Eye, TrendingUp, Activity, Wifi } from "lucide-react"
import Link from "next/link"
import { RoomVisualization } from "@/components/room-visualization"
import { EnergyChart } from "@/components/energy-chart"
import { TemperatureChart } from "@/components/temperature-chart"
import { OccupancyChart } from "@/components/occupancy-chart"

// Mock data with more realistic values
const mockRooms = [
  {
    id: "room-001",
    name: "Conference Room Alpha",
    temperature: 22.5,
    occupancy: 8,
    maxOccupancy: 12,
    humidity: 45,
    airQuality: "Excellent",
    energyUsage: 2.3,
    status: "optimal",
    efficiency: 94,
  },
  {
    id: "room-002",
    name: "Innovation Lab Beta",
    temperature: 24.1,
    occupancy: 15,
    maxOccupancy: 20,
    humidity: 52,
    airQuality: "Good",
    energyUsage: 3.1,
    status: "warning",
    efficiency: 78,
  },
  {
    id: "room-003",
    name: "Research Center Gamma",
    temperature: 19.8,
    occupancy: 3,
    maxOccupancy: 8,
    humidity: 38,
    airQuality: "Excellent",
    energyUsage: 4.2,
    status: "optimal",
    efficiency: 91,
  },
  {
    id: "room-004",
    name: "Data Center Core",
    temperature: 18.2,
    occupancy: 1,
    maxOccupancy: 4,
    humidity: 35,
    airQuality: "Good",
    energyUsage: 8.7,
    status: "critical",
    efficiency: 67,
  },
  {
    id: "room-005",
    name: "Executive Lounge",
    temperature: 23.0,
    occupancy: 5,
    maxOccupancy: 15,
    humidity: 48,
    airQuality: "Excellent",
    energyUsage: 1.8,
    status: "optimal",
    efficiency: 96,
  },
  {
    id: "room-006",
    name: "Training Center Delta",
    temperature: 25.3,
    occupancy: 22,
    maxOccupancy: 25,
    humidity: 58,
    airQuality: "Fair",
    energyUsage: 5.4,
    status: "warning",
    efficiency: 72,
  },
]

const mockAlerts = [
  {
    id: "alert-001",
    type: "critical",
    title: "Temperature Critical",
    message: "Data Center Core temperature approaching critical threshold",
    timestamp: "2 minutes ago",
    room: "Data Center Core",
    severity: "high",
  },
  {
    id: "alert-002",
    type: "warning",
    title: "High Occupancy",
    message: "Training Center Delta at 88% capacity",
    timestamp: "5 minutes ago",
    room: "Training Center Delta",
    severity: "medium",
  },
  {
    id: "alert-003",
    type: "info",
    title: "Maintenance Scheduled",
    message: "HVAC system maintenance scheduled for Conference Room Alpha",
    timestamp: "15 minutes ago",
    room: "Conference Room Alpha",
    severity: "low",
  },
  {
    id: "alert-004",
    type: "warning",
    title: "Energy Spike",
    message: "Unusual energy consumption detected in Innovation Lab Beta",
    timestamp: "22 minutes ago",
    room: "Innovation Lab Beta",
    severity: "medium",
  },
]

export default function Dashboard() {
  const [rooms, setRooms] = useState(mockRooms)
  const [alerts, setAlerts] = useState(mockAlerts)
  const [selectedRoom, setSelectedRoom] = useState(mockRooms[0])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => ({
          ...room,
          temperature: Math.max(15, Math.min(30, room.temperature + (Math.random() - 0.5) * 0.3)),
          occupancy: Math.max(0, Math.min(room.maxOccupancy, room.occupancy + Math.floor((Math.random() - 0.5) * 2))),
          energyUsage: Math.max(0.5, room.energyUsage + (Math.random() - 0.5) * 0.1),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "optimal":
        return "default"
      default:
        return "outline"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "warning":
        return <Activity className="h-4 w-4 text-yellow-400" />
      case "info":
        return <Wifi className="h-4 w-4 text-blue-400" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const totalEnergy = rooms.reduce((sum, room) => sum + room.energyUsage, 0)
  const totalOccupancy = rooms.reduce((sum, room) => sum + room.occupancy, 0)
  const avgTemperature = rooms.reduce((sum, room) => sum + room.temperature, 0) / rooms.length
  const avgEfficiency = rooms.reduce((sum, room) => sum + room.efficiency, 0) / rooms.length

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Header */}
      <header className="glass-card-strong border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center neon-glow">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Digital Twin Control System
                </h1>
                <p className="text-sm text-gray-400">Real-time facility management</p>
              </div>
            </div>
            <nav className="flex space-x-2">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Dashboard
                </Button>
              </Link>
              <Link href="/sensors">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sensors
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Analytics
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Energy</p>
                  <p className="text-3xl font-bold text-white">{totalEnergy.toFixed(1)}</p>
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    -12% vs yesterday
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Occupancy</p>
                  <p className="text-3xl font-bold text-white">{totalOccupancy}</p>
                  <p className="text-xs text-blue-400 flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    across {rooms.length} rooms
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Temperature</p>
                  <p className="text-3xl font-bold text-white">{avgTemperature.toFixed(1)}°C</p>
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    <Thermometer className="h-3 w-3 mr-1" />
                    optimal range
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Thermometer className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Efficiency</p>
                  <p className="text-3xl font-bold text-white">{avgEfficiency.toFixed(0)}%</p>
                  <p className="text-xs text-purple-400 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    +5% this week
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Alerts */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="glass-card-strong alert-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  System Alerts
                  <Badge variant="destructive" className="ml-auto">
                    {alerts.length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-400">Critical notifications requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map((alert) => (
                  <Alert key={alert.id} className="glass-card border-red-500/20 bg-red-500/5">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white">{alert.title}</h4>
                          <Badge
                            variant={
                              alert.type === "critical"
                                ? "destructive"
                                : alert.type === "warning"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <AlertDescription className="text-gray-300 text-sm">{alert.message}</AlertDescription>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{alert.room}</span>
                          <span className="text-xs text-gray-500">{alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            {/* Real-time Charts */}
            <Card className="glass-card success-glow">
              <CardHeader>
                <CardTitle className="text-white">Energy Consumption</CardTitle>
                <CardDescription className="text-gray-400">Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyChart />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Rooms and Visualization */}
          <div className="xl:col-span-2 space-y-6">
            <Tabs defaultValue="rooms" className="w-full">
              <TabsList className="glass-card-strong border border-white/10">
                <TabsTrigger value="rooms" className="data-[state=active]:bg-white/20">
                  Room Overview
                </TabsTrigger>
                <TabsTrigger value="charts" className="data-[state=active]:bg-white/20">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="3d" className="data-[state=active]:bg-white/20">
                  3D Visualization
                </TabsTrigger>
              </TabsList>

              <TabsContent value="rooms" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rooms.map((room) => (
                    <Card
                      key={room.id}
                      className={`glass-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedRoom?.id === room.id ? "neon-glow ring-2 ring-purple-500/50" : ""
                      } ${room.status === "critical" ? "alert-glow" : room.status === "warning" ? "warning-glow" : "success-glow"}`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white">{room.name}</CardTitle>
                          <Badge variant={getStatusColor(room.status) as any} className="capitalize">
                            {room.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-blue-400" />
                              <span className="text-sm text-gray-400">Temperature</span>
                            </div>
                            <p className="text-xl font-bold text-white">{room.temperature.toFixed(1)}°C</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-gray-400">Occupancy</span>
                            </div>
                            <p className="text-xl font-bold text-white">
                              {room.occupancy}/{room.maxOccupancy}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Energy Usage</span>
                            <span className="text-white font-medium">{room.energyUsage.toFixed(1)} kW</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Efficiency</span>
                            <span className="text-white font-medium">{room.efficiency}%</span>
                          </div>
                          <Progress value={room.efficiency} className="h-2 bg-gray-800" />
                        </div>

                        <Link href={`/room/${room.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full glass-card border-white/20 text-white hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="charts" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-card neon-glow">
                    <CardHeader>
                      <CardTitle className="text-white">Temperature Trends</CardTitle>
                      <CardDescription className="text-gray-400">Real-time temperature monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TemperatureChart />
                    </CardContent>
                  </Card>

                  <Card className="glass-card neon-glow">
                    <CardHeader>
                      <CardTitle className="text-white">Occupancy Patterns</CardTitle>
                      <CardDescription className="text-gray-400">Daily occupancy distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <OccupancyChart />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="3d">
                <Card className="glass-card neon-glow">
                  <CardHeader>
                    <CardTitle className="text-white">3D Room Visualization</CardTitle>
                    <CardDescription className="text-gray-400">
                      Interactive 3D model of {selectedRoom?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-96 w-full rounded-lg overflow-hidden">
                      <RoomVisualization
                        temperature={selectedRoom?.temperature || 22}
                        occupancy={selectedRoom?.occupancy || 0}
                        maxOccupancy={selectedRoom?.maxOccupancy || 10}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
