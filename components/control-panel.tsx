"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, Lightbulb, Thermometer } from "lucide-react"

export function ControlPanel() {
  const [hvacEnabled, setHvacEnabled] = useState(true)
  const [lightLevel, setLightLevel] = useState([80])
  const [targetTemp, setTargetTemp] = useState([22])

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Wind className="w-4 h-4 text-blue-500" />
            Environment Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">HVAC System</span>
            <Switch checked={hvacEnabled} onCheckedChange={setHvacEnabled} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Target Temperature
              </span>
              <span className="text-sm font-medium">{targetTemp[0]}°C</span>
            </div>
            <Slider value={targetTemp} onValueChange={setTargetTemp} max={30} min={15} step={0.5} className="w-full" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Lighting Level
              </span>
              <span className="text-sm font-medium">{lightLevel[0]}%</span>
            </div>
            <Slider value={lightLevel} onValueChange={setLightLevel} max={100} min={0} step={5} className="w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
