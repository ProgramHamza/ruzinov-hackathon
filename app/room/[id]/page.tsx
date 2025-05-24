"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Thermometer, Users, Zap, Wind, Lightbulb, Camera, Activity } from "lucide-react"
import Link from "next/link"
import { RoomVisualization } from "@/components/room-visualization"
import { EnergyChart } from "@/components/energy-chart"
import { TemperatureChart } from "@/components/temperature-chart"

// Mock room data
const mockRoomData = {
  "room-001": {
    id: "room-001",
    name: "Conference Room Alpha",
    temperature: 22.5,
    occupancy: 8,
    maxOccupancy: 12,
    humidity: 45,
    airQuality: "Excellent",
    energyUsage: 2.3,
    status: "optimal",
    hvacEnabled: true,
    lightingLevel: 80,
    securityCameras: 2,
    lastMaintenance: "2024-01-10",
    efficiency: 94,
  },
  "room-002": {
    id: "room-002",
    name: "Innovation Lab Beta",
    temperature: 24.1,
    occupancy: 15,
    maxOccupancy: 20,
    humidity: 52,
    airQuality: "Good",
    energyUsage: 3.1,
    status: "warning",
    hvacEnabled: true,
    lightingLevel: 65,
    securityCameras: 4,
    lastMaintenance: "2024-01-08",
    efficiency: 78,
  },
}

export default function RoomDetail() {
  const params = useParams()
  const roomId = params?.id as string
  const [room, setRoom] = useState(mockRoomData[roomId as keyof typeof mockRoomData])
  const [hvacEnabled, setHvacEnabled] = useState(room?.hvacEnabled || false)
  const [lightingLevel, setLightingLevel] = useState([room?.lightingLevel || 50])

  useEffect(() => {
    if (roomId && mockRoomData[roomId as keyof typeof mockRoomData]) {
      const roomData = mockRoomData[roomId as keyof typeof mockRoomData]
      setRoom(roomData)
      setHvacEnabled(roomData.hvacEnabled)
      setLightingLevel([roomData.lightingLevel])
    }
  }, [roomId])

  if (!room) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-lg">
          <h1 className="text-2xl font-bold mb-4 text-black">Room Not Found</h1>
          <Link href="/">
            <Button className="glass-card border-white/20 text-black hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="glass-card-strong border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-black hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-black">
                  {room.name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant={getStatusColor(room.status) as any} className="capitalize">
                    {room.status}
                  </Badge>
                  <span className="text-sm text-gray-400">Last maintenance: {room.lastMaintenance}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">Efficiency: {room.efficiency}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Controls */}
          <div className="xl:col-span-1 space-y-6">
            {/* Environmental Controls */}
            <Card className="glass-card-strong neon-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Wind className="h-5 w-5 text-blue-400" />
                  Environmental Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-400" />
                    <span className="font-medium text-black">HVAC System</span>
                  </div>
                  <Switch
                    checked={hvacEnabled}
                    onCheckedChange={setHvacEnabled}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium text-black">Lighting Level</span>
                    </div>
                    <span className="text-sm text-gray-400">{lightingLevel[0]}%</span>
                  </div>
                  <Slider
                    value={lightingLevel}
                    onValueChange={setLightingLevel}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="glass-card-strong success-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Camera className="h-5 w-5 text-green-400" />
                  Security Systems
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">Active Cameras</span>
                  <Badge variant="outline" className="border-green-400 text-green-400">
                    {room.securityCameras} online
                  </Badge>
                </div>
                <Button variant="outline" className="w-full glass-card border-white/20 text-black hover:bg-white/10">
                  <Camera className="h-4 w-4 mr-2" />
                  View Camera Feeds
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card-strong warning-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Air Quality</span>
                  <Badge variant="default">{room.airQuality}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Humidity</span>
                  <span className="text-black font-medium">{room.humidity}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Efficiency</span>
                  <span className="text-black font-medium">{room.efficiency}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Data and Visualization */}
          <div className="xl:col-span-3 space-y-6">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-card neon-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Temperature</p>
                      <p className="text-3xl font-bold text-black">{room.temperature.toFixed(1)}°C</p>
                      <p className="text-xs text-blue-400 mt-1">Target: 22.0°C</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Thermometer className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Occupancy</p>
                      <p className="text-3xl font-bold text-black">{room.occupancy}</p>
                      <Progress value={(room.occupancy / room.maxOccupancy) * 100} className="mt-2 h-2 bg-gray-800" />
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Users className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Energy Usage</p>
                      <p className="text-3xl font-bold text-black">{room.energyUsage.toFixed(1)} kW</p>
                      <p className="text-xs text-green-400 mt-1">-12% vs yesterday</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Efficiency</p>
                      <p className="text-3xl font-bold text-black">{room.efficiency}%</p>
                      <p className="text-xs text-purple-400 mt-1">+3% this week</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="glass-card-strong border border-white/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="visualization" className="data-[state=active]:bg-white/20">
                  3D Visualization
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white/20">
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="glass-card neon-glow">
                    <CardHeader>
                      <CardTitle className="text-black">Energy Consumption</CardTitle>
                      <CardDescription className="text-gray-400">Real-time energy monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnergyChart />
                    </CardContent>
                  </Card>

                  <Card className="glass-card neon-glow">
                    <CardHeader>
                      <CardTitle className="text-black">Temperature Trends</CardTitle>
                      <CardDescription className="text-gray-400">24-hour temperature history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TemperatureChart />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="visualization">
                <Card className="glass-card neon-glow">
                  <CardHeader>
                    <CardTitle className="text-black">3D Room Visualization</CardTitle>
                    <CardDescription className="text-gray-400">
                      Interactive 3D model with real-time data overlay
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-96 w-full rounded-lg overflow-hidden">
                      <RoomVisualization
                        temperature={room.temperature}
                        occupancy={room.occupancy}
                        maxOccupancy={room.maxOccupancy}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="glass-card neon-glow">
                  <CardHeader>
                    <CardTitle className="text-black">Room Analytics</CardTitle>
                    <CardDescription className="text-gray-400">
                      Detailed performance metrics and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <h3 className="font-medium mb-2 text-black">Energy Efficiency</h3>
                        <div className="text-3xl font-bold text-blue-400 mb-2">{room.efficiency}%</div>
                        <Progress value={room.efficiency} className="h-2 bg-gray-800" />
                      </div>

                      <div className="text-center">
                        <h3 className="font-medium mb-2 text-black">Utilization Rate</h3>
                        <div className="text-3xl font-bold text-green-400 mb-2">
                          {Math.round((room.occupancy / room.maxOccupancy) * 100)}%
                        </div>
                        <Progress value={(room.occupancy / room.maxOccupancy) * 100} className="h-2 bg-gray-800" />
                      </div>

                      <div className="text-center">
                        <h3 className="font-medium mb-2 text-black">Climate Control</h3>
                        <div className="text-3xl font-bold text-yellow-400 mb-2">Optimal</div>
                        <Progress value={92} className="h-2 bg-gray-800" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="glass-card neon-glow">
                  <CardHeader>
                    <CardTitle className="text-black">Historical Data</CardTitle>
                    <CardDescription className="text-gray-400">Room metrics over the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-400">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Historical charts and trend analysis would be displayed here</p>
                      <p className="text-sm mt-2">
                        Data includes temperature, occupancy, energy usage, and efficiency metrics
                      </p>
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
