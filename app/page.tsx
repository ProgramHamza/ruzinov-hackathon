"use client"


import React, { useEffect, useRef, Suspense, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, useProgress } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Thermometer, Users, Zap, Eye, TrendingUp, Activity, Wifi } from "lucide-react"

import { RoomVisualization } from "@/components/room-visualization"
import { EnergyChart } from "@/components/energy-chart"
import { TemperatureChart } from "@/components/temperature-chart"
import { OccupancyChart } from "@/components/occupancy-chart"


function HeatmapCloth({ width = 3, height = 3, segmentsX = 30, segmentsY = 30, heatData }) {
  const meshRef = useRef()

  // Create plane geometry with vertex colors
  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY)
    
    // Create a color attribute for vertices
    const colors = []

    // Initialize all colors blue
    for (let i = 0; i < geom.attributes.position.count; i++) {
      colors.push(0, 0, 1) // blue
    }

    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    return geom
  }, [width, height, segmentsX, segmentsY])

  // Update colors based on heatData every frame (or when heatData changes)
  useFrame(() => {
    if (!meshRef.current) return
    const colors = meshRef.current.geometry.attributes.color.array

    // heatData should be a 2D array or function giving heat per vertex index
    for (let i = 0; i < colors.length / 3; i++) {
      // Simple example: heatData is an array matching vertex count
      const heat = heatData ? heatData[i] ?? 0 : 0

      // Map heat (0 to 1) to color blue → red
      const color = new THREE.Color()
      color.setHSL((1 - heat) * 0.7, 1, 0.5)  // from blue(h=0.7) to red(h=0)

      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    meshRef.current.geometry.attributes.color.needsUpdate = true
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[0, 0, 0.01]} // slightly above the model surface
      rotation={[-Math.PI / 2, 0, 0]} // flat on XZ plane
    >
      <meshBasicMaterial vertexColors={true} side={THREE.DoubleSide} transparent opacity={0.8} />
    </mesh>
  )
}

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
  // {
  //   id: "alert-004",
  //   type: "warning",
  //   title: "Energy Spike",
  //   message: "Unusual energy consumption detected in Innovation Lab Beta",
  //   timestamp: "22 minutes ago",
  //   room: "Innovation Lab Beta",
  //   severity: "medium",
  // },
]


// Prevent server-side rendering
const Viewer = dynamic(() => Promise.resolve(ThreeDViewer), { ssr: false });

function Pinpoint({
  position,
  size = [0.5, 0.5, 0.5], // width, height, depth of the cuboid hitbox
  label,
  targetUrl,
}: {
  position: [number, number, number];
  size?: [number, number, number];
  label?: string;
  targetUrl: string;
}) {
  const router = useRouter();

  return (
    <group position={position}>
      {/* Invisible clickable box */}
      <mesh
        onClick={() => router.push(targetUrl)}
        scale={size}
        position={[0, 0, 0]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Optional visible indicator */}
      <mesh position={[0, size[1] / 2 + 0.05, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Label above the hitbox */}
      {label && (
        <Html position={[0, size[1] + 0.1, 0]} distanceFactor={2}>
          <div
            style={{
              background: 'white',
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '12px',
              pointerEvents: 'none',
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}




function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % loaded</Html>;
}

function Model({ path }) {
  const obj = useLoader(OBJLoader, path);
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      // Center the object
      const box = new THREE.Box3().setFromObject(ref.current);
      const center = box.getCenter(new THREE.Vector3());
      ref.current.position.sub(center);
    }
  }, [obj]);

  return (
    <primitive
      ref={ref}
      object={obj}
      scale={[0.000074, 0.000074, 0.000074]} // Adjust for Blender export scale
      position={[0, -31.951, 0]}             // Y-offset from Blender
      rotation={[0, 0, 0]}
         // Rotate model upright
    />
  );
}

function ThreeDViewer() {
  const heatData = React.useMemo(() => {
    const count = 31 * 31;
    return Array.from({ length: count }, () => Math.random());
  }, []);

  return (
    <div style={{ width: '600px', height: '300px', margin: '40px auto', border: '2px solid #ccc', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(255, 255, 255, 0.1)' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Suspense fallback={<Loader />}>
          <Model path="/model.obj" />

                    {/* Clickable Pinpoints */}
          <Pinpoint position={[0, -0.3, 0]} size={[0.6, 0.5, 0.6]} label="Vstupná hala" targetUrl="/room/room-001" />
          <Pinpoint position={[1, -0.3, -1]} size={[0.5, 0.5, 0.5]} label="Zasadacia miestnosť" targetUrl="/room/room-002" />
          <Pinpoint position={[-1, 0.25, 1]} size={[0.4, 0.4, 0.4]} label="Laboratórium" targetUrl="/room/room-003" />

        </Suspense>
        <OrbitControls target={[0, 0, 0]} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}




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
    <div className="min-h-screen bg-white">
      {/* Animated Header */}
      <header className="glass-card-strong border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center neon-glow">
                <Activity className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-black">
                  Digital Twin Control System
                </h1>
                <p className="text-sm text-gray-400">Real-time facility management</p>
              </div>
            </div>
            <nav className="flex space-x-2">
              <Link href="/">
                <Button variant="ghost" className="text-black hover:bg-white/10">
                  Dashboard
                </Button>
              </Link>
              <Link href="/sensors">
                <Button variant="ghost" className="text-black hover:bg-white/10">
                  Sensors
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="text-black hover:bg-white/10">
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
                  <p className="text-3xl font-bold text-black">{totalEnergy.toFixed(1)}</p>
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    -12% vs yesterday
                  </p>
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
                  <p className="text-sm text-gray-400">Occupancy</p>
                  <p className="text-3xl font-bold text-black">{totalOccupancy}</p>
                  <p className="text-xs text-blue-400 flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    across {rooms.length} rooms
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Temperature</p>
                  <p className="text-3xl font-bold text-black">{avgTemperature.toFixed(1)}°C</p>
                  <p className="text-xs text-green-400 flex items-center mt-1">
                    <Thermometer className="h-3 w-3 mr-1" />
                    optimal range
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Thermometer className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">System Efficiency</p>
                  <p className="text-3xl font-bold text-black">{avgEfficiency.toFixed(0)}%</p>
                  <p className="text-xs text-purple-400 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    +5% this week
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-black" />
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
                <CardTitle className="flex items-center gap-2 text-black">
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
                          <h4 className="font-medium text-black">{alert.title}</h4>
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
                <CardTitle className="text-black">Energy Consumption</CardTitle>
                <CardDescription className="text-gray-400">Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyChart />
              </CardContent>
            </Card>
                {/* Analytics Section */}
      
<div className="grid grid-cols-1 gap-6">
  <Card className="glass-card neon-glow flex flex-col justify-center items-center text-center">
    <CardHeader>
      <CardTitle className="text-black">Temperature Trends</CardTitle>
      <CardDescription className="text-gray-400">Real-time temperature monitoring</CardDescription>
    </CardHeader>
    <CardContent className="w-full flex justify-center items-center">
      <TemperatureChart />
    </CardContent>
  </Card>


        {/* <Card className="glass-card neon-glow flex flex-col justify-center items-center text-center">
          <CardHeader>
            <CardTitle className="text-black">Occupancy Patterns</CardTitle>
            <CardDescription className="text-gray-400">Daily occupancy distribution</CardDescription>
          </CardHeader>
          <CardContent className="w-full flex justify-center items-center">
            <OccupancyChart />
          </CardContent>
        </Card> */}
      </div>
          </div>


  {/* Main Content Area */}
  <div className="xl:col-span-2 space-y-6">

    {/* Room Overview */}
    


    {/* 3D Visualization Section */}
    <section>
      <Card className="glass-card neon-glow flex flex-col items-top text-center">
        <CardHeader>
          <CardTitle className="text-black">Interactive 3D model of {selectedRoom?.name}</CardTitle>
          <CardDescription className="text-gray-400">Explore the room in 3D</CardDescription>
        </CardHeader>
        <CardContent className="w-full flex justify-center items-top p-0">
          <div className="h-96 w-full max-w-4xl rounded-lg overflow-hidden">
            <Viewer />
          </div>
        </CardContent>
      </Card>
    </section>

    <section>
      <h2 className="text-xl font-semibold text-black mb-4 text-center">Room Overview</h2>
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
                <CardTitle className="text-lg text-black">{room.name}</CardTitle>
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
                  <p className="text-xl font-bold text-black">{room.temperature.toFixed(1)}°C</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-400">Occupancy</span>
                  </div>
                  <p className="text-xl font-bold text-black">
                    {room.occupancy}/{room.maxOccupancy}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Energy Usage</span>
                  <span className="text-black font-medium">{room.energyUsage.toFixed(1)} kW</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Efficiency</span>
                  <span className="text-black font-medium">{room.efficiency}%</span>
                </div>
                <Progress value={room.efficiency} className="h-2 bg-gray-800" />
              </div>

              <Link href={`/room/${room.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full glass-card border-white/20 text-black hover:bg-white/10"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>


  </div>
</div>
      </div>
    </div>
  )
}
