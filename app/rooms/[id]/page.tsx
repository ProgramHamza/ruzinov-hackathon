"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Thermometer, Users, Zap, Wind, Camera, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { RoomVisualization } from "@/components/room-visualization"

// Mock room data
const roomData = {
  id: "room-001",
  name: "Conference Room A",
  temperature: 22.5,
  targetTemperature: 23.0,
  occupancy: 8,
  maxOccupancy: 12,
  status: "normal",
  energyUsage: 2.3,
  humidity: 45,
  airQuality: "Good",
  lighting: 75,
  hvacStatus: "Auto",
  lastUpdated: "2 minutes ago",
}

const sensors = [
  { id: 1, name: "Temperature Sensor", type: "Environmental", status: "Active", value: "22.5°C" },
  { id: 2, name: "Occupancy Sensor", type: "Motion", status: "Active", value: "8 people" },
  { id: 3, name: "Air Quality Monitor", type: "Environmental", status: "Active", value: "Good" },
  { id: 4, name: "Light Sensor", type: "Lighting", status: "Active", value: "75%" },
]

const controllers = [
  { id: 1, name: "HVAC Controller", type: "Climate", status: "Auto", controllable: true },
  { id: 2, name: "Lighting Controller", type: "Lighting", status: "Manual", controllable: true },
  { id: 3, name: "Security System", type: "Security", status: "Armed", controllable: true },
]

export default function RoomDetail({ params }: { params: { id: string } }) {
  const [targetTemp, setTargetTemp] = useState([roomData.targetTemperature])
  const [lightingLevel, setLightingLevel] = useState([roomData.lighting])
  const [hvacAuto, setHvacAuto] = useState(true)
  const [lightingAuto, setLightingAuto] = useState(false)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{roomData.name}</h2>
            <p className="text-muted-foreground">Room ID: {params.id}</p>
          </div>
        </div>
        <Badge
          variant={
            roomData.status === "critical" ? "destructive" : roomData.status === "warning" ? "default" : "secondary"
          }
        >
          {roomData.status}
        </Badge>
      </div>

      {/* Real-time Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roomData.temperature}°C</div>
            <p className="text-xs text-muted-foreground">Target: {targetTemp[0]}°C</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roomData.occupancy}/{roomData.maxOccupancy}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((roomData.occupancy / roomData.maxOccupancy) * 100)}% capacity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roomData.energyUsage} kW</div>
            <p className="text-xs text-muted-foreground">Real-time consumption</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Air Quality</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roomData.airQuality}</div>
            <p className="text-xs text-muted-foreground">Humidity: {roomData.humidity}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Room Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Target Temperature</label>
                <span className="text-sm text-muted-foreground">{targetTemp[0]}°C</span>
              </div>
              <Slider
                value={targetTemp}
                onValueChange={setTargetTemp}
                max={30}
                min={15}
                step={0.5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Lighting Level</label>
                <span className="text-sm text-muted-foreground">{lightingLevel[0]}%</span>
              </div>
              <Slider
                value={lightingLevel}
                onValueChange={setLightingLevel}
                max={100}
                min={0}
                step={5}
                className="w-full"
                disabled={lightingAuto}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">HVAC Auto Mode</label>
                  <p className="text-xs text-muted-foreground">Automatic climate control</p>
                </div>
                <Switch checked={hvacAuto} onCheckedChange={setHvacAuto} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auto Lighting</label>
                  <p className="text-xs text-muted-foreground">Occupancy-based lighting</p>
                </div>
                <Switch checked={lightingAuto} onCheckedChange={setLightingAuto} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3D Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>3D Room Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <RoomVisualization rooms={[roomData]} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensors and Controllers */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Sensors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sensors.map((sensor) => (
                <div key={sensor.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{sensor.name}</p>
                    <p className="text-sm text-muted-foreground">{sensor.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{sensor.value}</p>
                    <Badge variant="secondary">{sensor.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Controllers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {controllers.map((controller) => (
                <div key={controller.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{controller.name}</p>
                    <p className="text-sm text-muted-foreground">{controller.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{controller.status}</Badge>
                    {controller.controllable && (
                      <Button size="sm" variant="outline">
                        Control
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
