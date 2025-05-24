"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingDown, TrendingUp, DollarSign, Zap, Calendar, Activity, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { EnergyChart } from "@/components/energy-chart"
import { TemperatureChart } from "@/components/temperature-chart"
import { OccupancyChart } from "@/components/occupancy-chart"

import { EfficiencyChart } from "@/components/efficiency-chart"
import { CostAnalysisChart } from "@/components/cost-analysis-chart"
import { PredictiveChart } from "@/components/predictive-chart"
import { useTranslation } from '@/lib/translations/TranslationContext'

export default function AnalyticsPage() {
  const { t } = useTranslation()
  
  const energyData = {
    totalConsumption: 156.7,
    previousMonth: 178.3,
    savings: 21.6,
    costSavings: 1247.5,
    efficiency: 87,
  }

  const financialData = {
    monthlyCost: 4532.8,
    projectedSavings: 15678.9,
    roi: 23.4,
    paybackPeriod: 18,
  }

  const roomEfficiency = [
    { name: "Vstupná hala", efficiency: 94, cost: 234.5, trend: "up" },
    { name: "Zasadacia miestnosť", efficiency: 78, cost: 456.8, trend: "down" },
    { name: "Kancelária starostu", efficiency: 91, cost: 345.2, trend: "up" },
    { name: "Serverová miestnosť", efficiency: 67, cost: 1234.6, trend: "stable" },
    { name: "Zastupiteľská sála", efficiency: 96, cost: 789.3, trend: "up" },
    { name: "Kancelárske priestory", efficiency: 72, cost: 567.4, trend: "down" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="glass-card-strong border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={102}
                height={102}
                className="rounded"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-black">
                  Ružinov Internet of Things
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
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Ušetrená energia</p>
                  <p className="text-3xl font-bold text-black">{energyData.savings} kWh</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">12.1% oproti minulému mesiacu</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Úspora nákladov</p>
                  <p className="text-3xl font-bold text-black">${energyData.costSavings.toFixed(0)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">8.7% oproti minulému mesiacu</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Efektivita systému</p>
                  <p className="text-3xl font-bold text-black">{energyData.efficiency}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">3.2% zlepšenie</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card neon-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">ROI</p>
                  <p className="text-3xl font-bold text-black">{financialData.roi}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-blue-400">Doba návratnosti {financialData.paybackPeriod} mesiacov</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="glass-card-strong border border-white/10 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              {t('analytics.overview')}
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-white/20">
              {t('analytics.energyAnalysis')}
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-white/20">
              {t('analytics.financial')}
            </TabsTrigger>
            <TabsTrigger value="predictive" className="data-[state=active]:bg-white/20">
              {t('analytics.predictive')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">{t('analytics.energyConsumption')}</CardTitle>
                  <CardDescription className="text-gray-400">24-hodinový vzor spotreby energie</CardDescription>
                </CardHeader>
                <CardContent>
                  <EnergyChart />
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">{t('analytics.temperatureDistribution')}</CardTitle>
                  <CardDescription className="text-gray-400">Monitorovanie teploty vo viacerých miestnostiach</CardDescription>
                </CardHeader>
                <CardContent>
                  <TemperatureChart />
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">{t('analytics.occupancyAnalysis')}</CardTitle>
                  <CardDescription className="text-gray-400">Aktuálne vs. kapacitné využitie</CardDescription>
                </CardHeader>
                <CardContent>
                  <OccupancyChart />
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">{t('analytics.efficiencyMetrics')}</CardTitle>
                  <CardDescription className="text-gray-400">Ukazovatele výkonu systému</CardDescription>
                </CardHeader>
                <CardContent>
                  <EfficiencyChart />
                </CardContent>
              </Card>
            </div>

            {/* Room Performance Table */}
            <Card className="glass-card-strong">
              <CardHeader>
                <CardTitle className="text-black">{t('analytics.roomPerformance')}</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailná analýza efektivity a nákladov podľa miestností
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roomEfficiency.map((room) => (
                    <div key={room.name} className="glass-card p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-black">{room.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              room.efficiency > 90 ? "default" : room.efficiency > 75 ? "secondary" : "destructive"
                            }
                            className="text-xs"
                          >
                            {room.efficiency}% efektívne
                          </Badge>
                          {room.trend === "up" && <TrendingUp className="h-4 w-4 text-green-400" />}
                          {room.trend === "down" && <TrendingDown className="h-4 w-4 text-red-400" />}
                          {room.trend === "stable" && <Activity className="h-4 w-4 text-gray-400" />}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">{t('efficiency')}</p>
                          <Progress value={room.efficiency} className="h-2 bg-gray-800 mt-1" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{t('analytics.monthlyCost')}</p>
                          <p className="text-lg font-bold text-black">${room.cost}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{t('analytics.performanceStatus')}</p>
                          <p className="text-sm text-black capitalize">{room.trend}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="energy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">Energy Consumption</CardTitle>
                  <CardDescription className="text-gray-400">Detailed energy usage analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <EnergyChart />
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">Peak Usage Analysis</CardTitle>
                  <CardDescription className="text-gray-400">Identifying peak consumption periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Peak Hour</span>
                      <span className="font-bold text-black">2:00 PM - 3:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Peak Consumption</span>
                      <span className="font-bold text-black">25.1 kWh</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Off-Peak Average</span>
                      <span className="font-bold text-black">8.7 kWh</span>
                    </div>
                    <div className="flex justify-between items-center text-green-400">
                      <span>Optimization Potential</span>
                      <span className="font-bold">-18.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">Cost Analysis</CardTitle>
                  <CardDescription className="text-gray-400">Financial impact breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <CostAnalysisChart />
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">Savings Breakdown</CardTitle>
                  <CardDescription className="text-gray-400">Sources of cost reduction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">HVAC Optimization</span>
                        <span className="font-medium text-black">45%</span>
                      </div>
                      <Progress value={45} className="h-2 bg-gray-800" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Lighting Control</span>
                        <span className="font-medium text-black">30%</span>
                      </div>
                      <Progress value={30} className="h-2 bg-gray-800" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Occupancy Management</span>
                        <span className="font-medium text-black">25%</span>
                      </div>
                      <Progress value={25} className="h-2 bg-gray-800" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">Predictive Analytics</CardTitle>
                  <CardDescription className="text-gray-400">AI-powered consumption forecasting</CardDescription>
                </CardHeader>
                <CardContent>
                  <PredictiveChart />
                </CardContent>
              </Card>

              <Card className="glass-card neon-glow">
                <CardHeader>
                  <CardTitle className="text-black">Maintenance Predictions</CardTitle>
                  <CardDescription className="text-gray-400">Predictive maintenance scheduling</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="glass-card p-3 rounded-lg border-yellow-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-black font-medium">HVAC System A1</span>
                        <Badge variant="secondary">7 days</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Filter replacement recommended</p>
                    </div>

                    <div className="glass-card p-3 rounded-lg border-blue-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-black font-medium">Lighting Controller B2</span>
                        <Badge variant="outline">14 days</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Calibration due</p>
                    </div>

                    <div className="glass-card p-3 rounded-lg border-green-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-black font-medium">Temperature Sensors</span>
                        <Badge variant="default">30 days</Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Battery replacement cycle</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
