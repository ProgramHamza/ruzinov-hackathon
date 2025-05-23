"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Thermometer, Users, Zap, Wind, Camera, Wifi, WifiOff, Activity, Shield } from "lucide-react"
import Link from "next/link"

// Mock sensor data
const mockSensors = [
  {
    id: "sensor-001",
    name: "Temperature Sensor Alpha-1",
    type: "temperature",
    room: "Conference Room Alpha",
    status: "online",
    value: "22.5°C",
    lastUpdate: "2024-01-15 14:30:22",
    batteryLevel: 85,
    signalStrength: 95,
  },
  {
    id: "sensor-002",
    name: "Occupancy Sensor Beta-1",
    type: "occupancy",
    room: "Innovation Lab Beta",
    status: "online",
    value: "15 people",
    lastUpdate: "2024-01-15 14:30:18",
    batteryLevel: 92,
    signalStrength: 88,
  },
  {
    id: "sensor-003",
    name: "Energy Monitor Gamma-1",
    type: "energy",
    room: "Research Center Gamma",
    status: "offline",
    value: "4.2 kW",
    lastUpdate: "2024-01-15 13:45:10",
    batteryLevel: 23,
    signalStrength: 0,
  },
  {
    id: "sensor-004",
    name: "HVAC Sensor Alpha-2",
    type: "hvac",
    room: "Conference Room Alpha",
    status: "online",
    value: "Auto Mode",
    lastUpdate: "2024-01-15 14:30:20",
    batteryLevel: null,
    signalStrength: 92,
  },
  {
    id: "sensor-005",
    name: "Security Camera Beta-2",
    type: "camera",
    room: "Innovation Lab Beta",
    status: "online",
    value: "Recording",
    lastUpdate: "2024-01-15 14:30:22",
    batteryLevel: null,
    signalStrength: 98,
  },
  {
    id: "sensor-006",
    name: "Air Quality Monitor Delta-1",
    type: "air",
    room: "Training Center Delta",
    status: "warning",
    value: "Fair",
    lastUpdate: "2024-01-15 14:28:15",
    batteryLevel: 67,
    signalStrength: 76,
  },
]

const mockControllers = [
  {
    id: "ctrl-001",
    name: "HVAC Central Controller",
    type: "hvac",
    rooms: ["Conference Room Alpha", "Innovation Lab Beta"],
    status: "online",
    mode: "Auto",
    enabled: true,
    lastUpdate: "2024-01-15 14:30:20",
  },
  {
    id: "ctrl-002",
    name: "Lighting Controller Zone-1",
    type: "lighting",
    rooms: ["Conference Room Alpha"],
    status: "online",
    mode: "Manual",
    enabled: true,
    lastUpdate: "2024-01-15 14:29:45",
  },
  {
    id: "ctrl-003",
    name: "Security System Controller",
    type: "security",
    rooms: ["All Rooms"],
    status: "online",
    mode: "Armed",
    enabled: true,
    lastUpdate: "2024-01-15 14:30:00",
  },
  {
    id: "ctrl-004",
    name: "Energy Management Controller",
    type: "energy",
    rooms: ["Data Center Core", "Server Room"],
    status: "maintenance",
    mode: "Eco Mode",
    enabled: false,
    lastUpdate: "2024-01-15 12:15:30",
  },
]

export default function SensorsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sensors, setSensors] = useState(mockSensors)
  const [controllers, setControllers] = useState(mockControllers)

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="h-4 w-4 text-blue-400" />
      case "occupancy":
        return <Users className="h-4 w-4 text-green-400" />
      case "energy":
        return <Zap className="h-4 w-4 text-yellow-400" />
      case "hvac":
        return <Wind className="h-4 w-4 text-cyan-400" />
      case "camera":
        return <Camera className="h-4 w-4 text-purple-400" />
      case "air":
        return <Activity className="h-4 w-4 text-orange-400" />
      case "lighting":
        return <Activity className="h-4 w-4 text-yellow-400" />
      case "security":
        return <Shield className="h-4 w-4 text-red-400" />
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "online":
        return "default"
      case "offline":
        return "destructive"
      case "warning":
        return "secondary"
      case "maintenance":
        return "outline"
      default:
        return "outline"
    }
  }

  const getBatteryColor = (level: number | null) => {
    if (level === null) return "outline"
    if (level > 50) return "default"
    if (level > 20) return "secondary"
    return "destructive"
  }

  const getSignalStrength = (strength: number) => {
    if (strength > 80) return "Excellent"
    if (strength > 60) return "Good"
    if (strength > 40) return "Fair"
    if (strength > 0) return "Poor"
    return "No Signal"
  }

  const filteredSensors = sensors.filter(
    (sensor) =>
      sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.room.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredControllers = controllers.filter((controller) =>
    controller.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleController = (id: string) => {
    setControllers((prev) => prev.map((ctrl) => (ctrl.id === id ? { ...ctrl, enabled: !ctrl.enabled } : ctrl)))
  }

  const onlineSensors = sensors.filter((s) => s.status === "online").length
  const onlineControllers = controllers.filter((c) => c.status === "online").length
  const lowBatterySensors = sensors.filter((s) => s.batteryLevel && s.batteryLevel < 30).length

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="glass-card-strong border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Sensors & Controllers
                </h1>
                <p className="text-sm text-gray-400">Monitor and manage all IoT devices</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 glass-card border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Online Sensors</p>
                  <p className="text-3xl font-bold text-white">{onlineSensors}</p>
                  <p className="text-xs text-green-400 mt-1">of {sensors.length} total</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Controllers</p>
                  <p className="text-3xl font-bold text-white">{onlineControllers}</p>
                  <p className="text-xs text-blue-400 mt-1">of {controllers.length} total</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Low Battery</p>
                  <p className="text-3xl font-bold text-white">{lowBatterySensors}</p>
                  <p className="text-xs text-red-400 mt-1">need attention</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Health</p>
                  <p className="text-3xl font-bold text-white">94%</p>
                  <p className="text-xs text-green-400 mt-1">excellent</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sensors" className="w-full">
          <TabsList className="glass-card-strong border border-white/10">
            <TabsTrigger value="sensors" className="data-[state=active]:bg-white/20">
              Sensors ({filteredSensors.length})
            </TabsTrigger>
            <TabsTrigger value="controllers" className="data-[state=active]:bg-white/20">
              Controllers ({filteredControllers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sensors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSensors.map((sensor) => (
                <Card
                  key={sensor.id}
                  className={`glass-card transition-all duration-300 hover:scale-105 ${
                    sensor.status === "online"
                      ? "success-glow"
                      : sensor.status === "warning"
                        ? "warning-glow"
                        : "alert-glow"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSensorIcon(sensor.type)}
                        <CardTitle className="text-lg text-white">{sensor.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        {sensor.status === "online" ? (
                          <Wifi className="h-4 w-4 text-green-400" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-red-400" />
                        )}
                        <Badge variant={getStatusColor(sensor.status) as any}>{sensor.status}</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-gray-400">{sensor.room}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Current Value</p>
                        <p className="text-2xl font-bold text-white">{sensor.value}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Signal</span>
                          <p className="text-white font-medium">{getSignalStrength(sensor.signalStrength)}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Updated</span>
                          <p className="text-white font-medium">{sensor.lastUpdate.split(" ")[1]}</p>
                        </div>
                      </div>

                      {sensor.batteryLevel !== null && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Battery</span>
                          <Badge variant={getBatteryColor(sensor.batteryLevel) as any}>{sensor.batteryLevel}%</Badge>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        className="w-full glass-card border-white/20 text-white hover:bg-white/10"
                      >
                        Configure Device
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="controllers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredControllers.map((controller) => (
                <Card
                  key={controller.id}
                  className={`glass-card transition-all duration-300 hover:scale-105 ${
                    controller.status === "online"
                      ? "success-glow"
                      : controller.status === "maintenance"
                        ? "warning-glow"
                        : "alert-glow"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSensorIcon(controller.type)}
                        <CardTitle className="text-lg text-white">{controller.name}</CardTitle>
                      </div>
                      <Badge variant={getStatusColor(controller.status) as any}>{controller.status}</Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      Controls: {Array.isArray(controller.rooms) ? controller.rooms.join(", ") : controller.rooms}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-400">Mode</span>
                        <Badge variant="outline" className="border-white/20 text-white">
                          {controller.mode}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-400">Status</span>
                        <Switch
                          checked={controller.enabled}
                          onCheckedChange={() => toggleController(controller.id)}
                          disabled={controller.status !== "online"}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>

                      <div className="text-sm text-gray-400">
                        <span>Last Update: </span>
                        <span className="text-white">{controller.lastUpdate.split(" ")[1]}</span>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full glass-card border-white/20 text-white hover:bg-white/10"
                      >
                        Advanced Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
