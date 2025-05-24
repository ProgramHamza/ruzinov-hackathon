"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Button, Badge, Tabs, TabsContent, TabsList, TabsTrigger,
  Progress, Switch, Slider
} from "@/components/ui"
import {
  ArrowLeft, Thermometer, Users, Zap, Wind, Lightbulb, Camera, Activity
} from "lucide-react"

import { RoomVisualization } from "@/components/room-visualization"
import { ControlPanel } from "@/components/control-panel"
import { MetricsCards } from "@/components/metrics-cards"
import { QuickStats } from "@/components/quick-stats"
import { DeviceList } from "@/components/device-list"
import { RulesPanel } from "@/components/rules-panel"
import { DeviceSearch } from "@/components/device-search"
import { useTranslation } from "@/lib/translations/TranslationContext"

// Mock data
const mockRoomData = {
  "room-001": {
    id: "room-001",
    name: "Vstupná hala",
    temperature: 22.5,
    occupancy: 8,
    maxOccupancy: 20,
    humidity: 45,
    airQuality: "Výborná",
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
  const [isPortrait, setIsPortrait] = useState(false)
  const [activeTab, setActiveTab] = useState("3d")
  const [showDeviceSearch, setShowDeviceSearch] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth)
    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    return () => window.removeEventListener("resize", checkOrientation)
  }, [])

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
          <h1 className="text-2xl font-bold mb-4 text-black">{t("error")}</h1>
          <Link href="/">
            <Button className="glass-card border-white/20 text-black hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("actions.backToDashboard")}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isPortrait) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center glass-card p-8 rounded-lg max-w-md">
          <div className="animate-spin mb-4">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">Otočte zariadenie</h2>
          <p className="text-gray-300 mb-4">Pre lepší zážitok z používania aplikácie otočte zariadenie do horizontálnej polohy.</p>
          <div className="flex justify-center">
            <svg className="w-16 h-16 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "critical": return "destructive"
      case "warning": return "secondary"
      case "optimal": return "default"
      default: return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="glass-card-strong border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-black hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("actions.backToDashboard")}
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-black">
                  {room.name}
                </h1>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <Badge variant={getStatusColor(room.status) as any} className="capitalize">
                    {t(`status.${room.status}`)}
                  </Badge>
                  <span className="text-sm text-gray-400">{t("actions.lastMaintenance")}: {room.lastMaintenance}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">{t("efficiency")}: {room.efficiency}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {showDeviceSearch && <DeviceSearch />}

      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-80 bg-white border-r">
          <ControlPanel />
          <QuickStats />
          <RulesPanel />
        </div>

        <div className="flex-1 p-4">
          <MetricsCards />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="3d">3D Visualization</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="3d" className="mt-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-2">3D Visualization</h3>
                <p className="text-sm text-gray-600 mb-4">Interactive 3D model with real-time data overlay</p>
                <RoomVisualization />
              </div>
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <DeviceList />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold mb-4">Analytics Dashboard</h3>
                <p className="text-gray-600">Analytics and insights coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold mb-4">Historical Data</h3>
                <p className="text-gray-600">Historical trends and data coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
