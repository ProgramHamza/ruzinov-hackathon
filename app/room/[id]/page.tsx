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
import { useTranslation } from "@/lib/translations/TranslationContext"

// Mock room data
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
  const { t } = useTranslation()

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
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
          <h1 className="text-2xl font-bold mb-4 text-black">{t('error')}</h1>
          <Link href="/">
            <Button className="glass-card border-white/20 text-black hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('actions.backToDashboard')}
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
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-black hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('actions.backToDashboard')}
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
                  <span className="text-sm text-gray-400">{t('actions.lastMaintenance')}: {room.lastMaintenance}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">{t('efficiency')}: {room.efficiency}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-8">
          {/* Left Column - Controls */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Environmental Controls */}
            <Card className="glass-card-strong neon-glow">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-black text-base sm:text-lg">
                  <Wind className="h-5 w-5 text-blue-400" />
                  {t('roomProperties.environmentalControls')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-400" />
                    <span className="font-medium text-black text-sm sm:text-base">{t('roomProperties.hvacSystem')}</span>
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
                      <span className="font-medium text-black text-sm sm:text-base">{t('roomProperties.lightingLevel')}</span>
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

            {/* Quick Stats */}
            <Card className="glass-card-strong warning-glow">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-black text-base sm:text-lg">
                  <Activity className="h-5 w-5 text-purple-400" />
                  {t('roomProperties.quickStats')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:p-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm sm:text-base">{t('airQuality')}</span>
                  <Badge variant="default">{room.airQuality}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm sm:text-base">{t('humidity')}</span>
                  <span className="text-black font-medium">{room.humidity}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm sm:text-base">{t('efficiency')}</span>
                  <span className="text-black font-medium">{room.efficiency}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Data and Visualization */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass-card neon-glow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t('temperature')}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-black">{room.temperature.toFixed(1)}°C</p>
                      <p className="text-xs text-blue-400 mt-1">{t('roomProperties.target')}: 22.0°C</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Thermometer className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t('occupancy')}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-black">{room.occupancy}</p>
                      <Progress value={(room.occupancy / room.maxOccupancy) * 100} className="mt-2 h-2 bg-gray-800" />
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t('energyUsage')}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-black">{room.energyUsage.toFixed(1)} kW</p>
                      <p className="text-xs text-green-400 mt-1">{t('roomProperties.vsYesterday')}: -12%</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{t('efficiency')}</p>
                      <p className="text-2xl sm:text-3xl font-bold text-black">{room.efficiency}%</p>
                      <p className="text-xs text-purple-400 mt-1">{t('roomProperties.thisWeek')}: +3%</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="visualization" className="w-full">
              <TabsList className="glass-card-strong border border-white/10 overflow-x-auto">
                <TabsTrigger value="visualization" className="data-[state=active]:bg-white/20 whitespace-nowrap">
                  {t('roomProperties.visualization')}
                </TabsTrigger>
                
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 whitespace-nowrap">
                  {t('roomProperties.overview')}
                </TabsTrigger>

                <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20 whitespace-nowrap">
                  {t('roomProperties.analytics')}
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-white/20 whitespace-nowrap">
                  {t('roomProperties.history')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="visualization">
                <Card className="glass-card neon-glow">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-black text-base sm:text-lg">{t('roomProperties.visualization')}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {t('roomProperties.visualizationDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-64 sm:h-96 w-full rounded-lg overflow-hidden">
                      <RoomVisualization
                        temperature={room.temperature}
                        occupancy={room.occupancy}
                        maxOccupancy={room.maxOccupancy}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="glass-card neon-glow">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-black text-base sm:text-lg">{t('charts.energy')}</CardTitle>
                      <CardDescription className="text-gray-400 text-sm">{t('roomProperties.energyMonitoring')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <EnergyChart />
                    </CardContent>
                  </Card>

                  <Card className="glass-card neon-glow">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="text-black text-base sm:text-lg">{t('charts.temperature')}</CardTitle>
                      <CardDescription className="text-gray-400 text-sm">{t('roomProperties.temperatureHistory')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <TemperatureChart />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="glass-card neon-glow">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-black text-base sm:text-lg">{t('roomProperties.roomAnalytics')}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {t('roomProperties.performanceMetrics')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      <div className="text-center">
                        <h3 className="font-medium mb-2 text-black text-sm sm:text-base">{t('roomProperties.energyEfficiency')}</h3>
                        <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">{room.efficiency}%</div>
                        <Progress value={room.efficiency} className="h-2 bg-gray-800" />
                      </div>

                      <div className="text-center">
                        <h3 className="font-medium mb-2 text-black text-sm sm:text-base">{t('roomProperties.utilizationRate')}</h3>
                        <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
                          {Math.round((room.occupancy / room.maxOccupancy) * 100)}%
                        </div>
                        <Progress value={(room.occupancy / room.maxOccupancy) * 100} className="h-2 bg-gray-800" />
                      </div>

                      <div className="text-center">
                        <h3 className="font-medium mb-2 text-black text-sm sm:text-base">{t('roomProperties.climateControl')}</h3>
                        <div className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">{t('status.optimal')}</div>
                        <Progress value={92} className="h-2 bg-gray-800" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="glass-card neon-glow">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-black text-base sm:text-lg">{t('roomProperties.historicalData')}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">{t('roomProperties.metricsHistory')}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-center py-8 sm:py-12 text-gray-400">
                      <Activity className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">{t('roomProperties.historicalCharts')}</p>
                      <p className="text-xs sm:text-sm mt-2">
                        {t('roomProperties.historicalDataDescription')}
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