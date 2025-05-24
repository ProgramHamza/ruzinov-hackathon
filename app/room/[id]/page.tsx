"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TemperatureChart } from "@/components/temperature-chart"
import { EnergyChart } from "@/components/energy-chart"
import Link from 'next/link'

import {
  ArrowLeft,
  Thermometer,
  Users,
  Zap,
  TrendingUp,
  AlertTriangle,
  Target,
  TrendingDown,
  Wind,
  Lightbulb,
  Settings,
  Edit3,
  Save,
  X,
  CheckCircle,
  Wifi,
  Battery,
  Info,
} from "lucide-react"

export default function SmartHomeDashboard() {
  const [room] = useState({
    id: "room-001",
    name: "Vstupná hala",
    temperature: 22.5,
    targetTemperature: 22.0,
    occupancy: 3,
    maxOccupancy: 8,
    humidity: 45,
    airQuality: "Výborná",
    energyUsage: 2.3,
    status: "optimal",
    hvacEnabled: true,
    lightingLevel: 80,
    lastMaintenance: "2024-01-10",
    efficiency: 94,
  })

  const [hvacEnabled, setHvacEnabled] = useState(room.hvacEnabled)
  const [lightLevel, setLightLevel] = useState([room.lightingLevel])
  const [targetTemp, setTargetTemp] = useState([room.targetTemperature])
  const [isPortrait, setIsPortrait] = useState(false)
  const [activeTab, setActiveTab] = useState("3d")
  const [editingRule, setEditingRule] = useState<number | null>(null)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const [rules, setRules] = useState([
    {
      id: 1,
      name: "Temperature Control",
      target: "22",
      current: "22.5",
      unit: "°C",
      status: "warning",
      message: "Temperature 0.5°C above target. Heating system active.",
      threshold: "0.5",
    },
    {
      id: 2,
      name: "Energy Efficiency",
      target: "3",
      current: "2.3",
      unit: "kW",
      status: "good",
      message: "Energy usage within optimal range.",
      threshold: "0.5",
    },
    {
      id: 3,
      name: "Air Quality",
      target: "90",
      current: "94",
      unit: "%",
      status: "excellent",
      message: "Air quality excellent.",
      threshold: "5",
    },
  ])

  const [editValues, setEditValues] = useState({ target: "", threshold: "" })

  const devices = [
    {
      id: "temp-001",
      name: "Temperature Sensor",
      type: "sensor",
      location: "Living Room",
      status: "online",
      value: "22.5°C",
      battery: 85,
      icon: Thermometer,
      lastUpdate: "2 min ago",
      specs: {
        model: "TempSense Pro 3000",
        range: "-40°C to 85°C",
        accuracy: "±0.1°C",
        connectivity: "Zigbee 3.0",
      },
      history: [
        { time: "14:00", value: 22.5 },
        { time: "13:00", value: 22.3 },
        { time: "12:00", value: 22.1 },
        { time: "11:00", value: 21.8 },
      ],
    },
    
    {
      id: "hvac-001",
      name: "HVAC Controller",
      type: "device",
      location: "Living Room",
      status: "online",
      value: "Heating",
      battery: null,
      icon: Wind,
      lastUpdate: "1 min ago",
      specs: {
        model: "ClimateControl Pro",
        power: "2.3kW",
        efficiency: "A+++",
        connectivity: "Ethernet",
      },
      history: [
        { time: "14:00", value: "Heating" },
        { time: "13:00", value: "Heating" },
        { time: "12:00", value: "Off" },
        { time: "11:00", value: "Off" },
      ],
    },
  ]

  const heatmapData = [
    [18.5, 19.2, 20.1, 21.0, 21.8, 22.5, 23.1, 23.8],
    [19.1, 19.8, 20.5, 21.2, 21.9, 22.6, 23.3, 24.0],
    [19.7, 20.4, 21.1, 21.8, 22.5, 23.2, 23.9, 24.6],
    [20.3, 21.0, 21.7, 22.4, 23.1, 23.8, 24.5, 25.2],
    [20.9, 21.6, 22.3, 23.0, 23.7, 24.4, 25.1, 25.8],
    [21.5, 22.2, 22.9, 23.6, 24.3, 25.0, 25.7, 26.4],
  ]

  const heatmapDevices = [
    { id: "temp-1", x: 15, y: 20, type: "temperature", value: "22.5°C", icon: Thermometer, color: "bg-blue-500" },
    { id: "occ-1", x: 75, y: 25, type: "occupancy", value: "3", icon: Users, color: "bg-green-500" },
    { id: "light-1", x: 50, y: 15, type: "light", value: "80%", icon: Lightbulb, color: "bg-yellow-500" },
    { id: "hvac-1", x: 25, y: 70, type: "hvac", value: "ON", icon: Wind, color: "bg-blue-600" },
  ]

  const stats = [
    { label: "Air Quality", value: "Excellent", percentage: 45 },
    { label: "Humidity", value: "45%", percentage: 45 },
    { label: "Efficiency", value: "94%", percentage: 94 },
  ]

  useEffect(() => {
    const checkOrientation = () => setIsPortrait(window.innerHeight > window.innerWidth)
    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    return () => window.removeEventListener("resize", checkOrientation)
  }, [])

  const getHeatmapColor = (temp: number) => {
    if (temp < 20) return "bg-blue-500"
    if (temp < 21) return "bg-blue-400"
    if (temp < 22) return "bg-green-400"
    if (temp < 23) return "bg-yellow-400"
    if (temp < 24) return "bg-orange-400"
    if (temp < 25) return "bg-red-400"
    return "bg-red-500"
  }

  const startEditing = (rule: any) => {
    setEditingRule(rule.id)
    setEditValues({ target: rule.target, threshold: rule.threshold })
  }

  const saveRule = (ruleId: number) => {
    setRules(
      rules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              target: editValues.target,
              threshold: editValues.threshold,
              status: calculateStatus(
                Number.parseFloat(editValues.target),
                Number.parseFloat(rule.current),
                Number.parseFloat(editValues.threshold),
              ),
            }
          : rule,
      ),
    )
    setEditingRule(null)
  }

  const calculateStatus = (target: number, current: number, threshold: number) => {
    const diff = Math.abs(target - current)
    if (diff <= threshold * 0.5) return "excellent"
    if (diff <= threshold) return "good"
    return "warning"
  }

  const cancelEdit = () => {
    setEditingRule(null)
    setEditValues({ target: "", threshold: "" })
  }

  if (isPortrait) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-lg max-w-md">
          <div className="animate-spin mb-4 mx-auto w-12 h-12">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 text-white">Otočte zariadenie</h2>
          <p className="text-gray-300 mb-4">
            Pre lepší zážitok z používania aplikácie otočte zariadenie do horizontálnej polohy.
          </p>
          <div className="flex justify-center">
            <svg className="w-16 h-16 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" passHref>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Späť na prehľad
              </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{room.name}</h1>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <Badge variant="secondary" className="capitalize bg-green-100 text-green-800">
                    Optimálny
                  </Badge>
                  <span className="text-sm text-gray-400">Posledná údržba: {room.lastMaintenance}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">Efektívita: {room.efficiency}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white border-r">
          {/* Control Panel */}
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-500" />
                  Kontrola prostredia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">HVAC systém</span>
                  <Switch checked={hvacEnabled} onCheckedChange={setHvacEnabled} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Cieľová teplota
                    </span>
                    <span className="text-sm font-medium">{targetTemp[0]}°C</span>
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
                    <span className="text-sm flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Úroveň osvetlenia
                    </span>
                    <span className="text-sm font-medium">{lightLevel[0]}%</span>
                  </div>
                  <Slider
                    value={lightLevel}
                    onValueChange={setLightLevel}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  Rýchle štatistiky
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
                  Výborná
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Rules Panel */}
          <div className="p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  Pravidlá automatizácie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="space-y-3 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{rule.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            rule.status === "warning" ? "destructive" : rule.status === "good" ? "secondary" : "default"
                          }
                          className={
                            rule.status === "good"
                              ? "bg-green-100 text-green-800"
                              : rule.status === "excellent"
                                ? "bg-blue-100 text-blue-800"
                                : ""
                          }
                        >
                          {rule.status === "warning" && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {rule.status !== "warning" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {rule.status.toUpperCase()}
                        </Badge>
                        {editingRule !== rule.id && (
                          <Button variant="ghost" size="sm" onClick={() => startEditing(rule)}>
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {editingRule === rule.id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-600">Cieľová hodnota</label>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={editValues.target}
                                onChange={(e) => setEditValues({ ...editValues, target: e.target.value })}
                                className="h-8 text-sm"
                              />
                              <span className="text-xs text-gray-500">{rule.unit}</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Prah</label>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                step="0.1"
                                value={editValues.threshold}
                                onChange={(e) => setEditValues({ ...editValues, threshold: e.target.value })}
                                className="h-8 text-sm"
                              />
                              <span className="text-xs text-gray-500">{rule.unit}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveRule(rule.id)} className="flex-1">
                            <Save className="w-3 h-3 mr-1" />
                            Uložiť
                          </Button>
                          <Button variant="outline" size="sm" onClick={cancelEdit} className="flex-1">
                            <X className="w-3 h-3 mr-1" />
                            Zrušiť
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-600">Cieľ: </span>
                            <span className="font-medium">
                              {rule.target}
                              {rule.unit}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Aktuálne: </span>
                            <span className="font-medium">
                              {rule.current}
                              {rule.unit}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-600">Prah: ±</span>
                          <span className="font-medium">
                            {rule.threshold}
                            {rule.unit}
                          </span>
                        </div>
                      </div>
                    )}

                    {rule.status === "warning" && editingRule !== rule.id && (
                      <Alert className="py-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">{rule.message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}

                <Button variant="outline" className="w-full" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Pridať nové pravidlo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Temperature Card */}
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Teplota
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
                      Cieľová hodnota
                    </span>
                    <span className="font-medium">22.0°C</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Odchýlka</span>
                    <span className="font-medium text-red-600">+0.5°C</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <Badge variant="destructive" className="w-full justify-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Upozornenie na teplotu
                </Badge>
              </CardContent>
            </Card>

            {/* Occupancy Card */}
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Obsadenosť
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">3</span>
                  <span className="text-lg text-gray-500 mb-1">ľudia</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Kapacita</span>
                    <span className="font-medium">8 ľudí</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Využitie</span>
                    <span className="font-medium text-green-600">37.5%</span>
                  </div>
                  <Progress value={37.5} className="h-2" />
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 flex-1 justify-center">
                    Normálne
                  </Badge>
                  <Badge variant="outline" className="flex-1 justify-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +1 vs pred 1h
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Energy Usage Card */}
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Spotreba energie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">2.3</span>
                  <span className="text-lg text-gray-500 mb-1">kW</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Oproti verejnému priemeru</span>
                    <span className="font-medium text-green-600 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      -12%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Denný rozpočet</span>
                    <span className="font-medium">55.2 kWh</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <Badge variant="secondary" className="w-full justify-center bg-green-100 text-green-800">
                  Efektívne
                </Badge>
              </CardContent>
            </Card>

            {/* Efficiency Card */}
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Efektívita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">94</span>
                  <span className="text-lg text-gray-500 mb-1">%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tento týždeň</span>
                    <span className="font-medium text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +3%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cieľ</span>
                    <span className="font-medium">90%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <Badge variant="secondary" className="w-full justify-center bg-blue-100 text-blue-800">
                  Výborná
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="3d">3D vizualizácia</TabsTrigger>
              <TabsTrigger value="overview">Prehľad</TabsTrigger>
              <TabsTrigger value="analytics">Analytika</TabsTrigger>
              <TabsTrigger value="history">História</TabsTrigger>
            </TabsList>

            <TabsContent value="3d" className="mt-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-2">3D vizualizácia</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Interaktívny 3D model s prekrývajúcimi sa dátami v reálnom čase
                </p>

                {/* Heatmap Visualization */}
                <div className="w-full">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    {/* Heatmap Grid */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-0">
                      {heatmapData.map((row, rowIndex) =>
                        row.map((temp, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`${getHeatmapColor(temp)} opacity-30 hover:opacity-50 transition-opacity cursor-pointer`}
                            title={`${temp}°C`}
                            onClick={() => setSelectedZone(`Zóna ${rowIndex}-${colIndex}: ${temp}°C`)}
                          />
                        )),
                      )}
                    </div>

                    {/* Room Layout Overlay */}
                    <div className="absolute inset-4 border-2 border-gray-400 rounded-lg bg-white/10">
                      {/* Room label */}
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium">
                        Obývacia izba
                      </div>

                      {/* Devices */}
                      {heatmapDevices.map((device) => (
                        <div
                          key={device.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          style={{ left: `${device.x}%`, top: `${device.y}%` }}
                          onClick={() => setSelectedZone(`${device.type}: ${device.value}`)}
                        >
                          <div
                            className={`w-8 h-8 ${device.color} rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
                          >
                            <device.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg min-w-max">
                            <div className="text-xs font-medium flex items-center gap-1">
                              <Wifi className="w-3 h-3 text-green-500" />
                              {device.value}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* People indicators */}
                      <div className="absolute" style={{ left: "30%", top: "40%" }}>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Osoba 1" />
                      </div>
                      <div className="absolute" style={{ left: "60%", top: "50%" }}>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Osoba 2" />
                      </div>
                      <div className="absolute" style={{ left: "45%", top: "65%" }}>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Osoba 3" />
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="text-xs font-medium mb-2">Teplota (°C)</div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded" />
                        <span className="text-xs">18-20</span>
                        <div className="w-3 h-3 bg-green-400 rounded ml-2" />
                        <span className="text-xs">21-22</span>
                        <div className="w-3 h-3 bg-yellow-400 rounded ml-2" />
                        <span className="text-xs">23-24</span>
                        <div className="w-3 h-3 bg-red-400 rounded ml-2" />
                        <span className="text-xs">25+</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Zone Info */}
                  {selectedZone && (
                    <Card className="mt-4 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{selectedZone}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Aktívne
                        </Badge>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Zariadenia a senzory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {devices.map((device) => (
                        <div
                          key={device.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <device.icon className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{device.name}</span>
                                <Badge
                                  variant={device.status === "online" ? "secondary" : "destructive"}
                                  className={device.status === "online" ? "bg-green-100 text-green-800" : ""}
                                >
                                  <Wifi className="w-3 h-3 mr-1" />
                                  {device.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 flex items-center gap-2">
                                <span>{device.location}</span>
                                <span>•</span>
                                <span>{device.lastUpdate}</span>
                                {device.battery && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                      <Battery className="w-3 h-3" />
                                      <span>{device.battery}%</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{device.value}</span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Info className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <device.icon className="w-5 h-5" />
                                    {device.name}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Špecifikácie</h4>
                                    <div className="space-y-1 text-sm">
                                      {Object.entries(device.specs).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                          <span className="text-gray-600 capitalize">{key}:</span>
                                          <span>{value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Nedávna história</h4>
                                    <div className="space-y-1 text-sm">
                                      {device.history.map((entry, index) => (
                                        <div key={index} className="flex justify-between">
                                          <span className="text-gray-600">{entry.time}</span>
                                          <span>
                                            {entry.value}
                                            {typeof entry.value === "number" && device.type === "sensor"
                                              ? device.name.includes("Temperature")
                                                ? "°C"
                                                : device.name.includes("Light")
                                                  ? "%"
                                                  : ""
                                              : ""}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              
                <div className="grid grid-cols-1 gap-6">
  <Card className="glass-card neon-glow flex flex-col justify-center items-center text-center">
    <CardHeader>
      <CardTitle className="text-black">Trendy teploty</CardTitle>
      <CardDescription className="text-gray-400"> </CardDescription>
    </CardHeader>

    <CardContent className="w-full flex justify-center items-center">
      <TemperatureChart />
      
  
    </CardContent>
    </Card>
      <Card className="glass-card neon-glow flex flex-col justify-center items-center text-center">
    <CardHeader>
      <CardTitle className="text-black">Spotreba energie</CardTitle>
      <CardDescription className="text-gray-400"> </CardDescription>
    </CardHeader>
    
    <CardContent className="w-full flex justify-center items-center">
      <EnergyChart />
      
    </CardContent>
  </Card>
</div>

            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold mb-4">Historické údaje</h3>
                <p className="text-gray-600">Historické trendy a údaje už čoskoro...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
