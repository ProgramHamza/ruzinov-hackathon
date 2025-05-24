"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Thermometer, Users, Lightbulb, Wind } from "lucide-react"
import { useTranslation } from "@/lib/translations/TranslationContext"

export function DeviceSearch() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const allDevices = [
    {
      id: "temp-001",
      name: "Temperature Sensor",
      type: "sensor",
      location: "Living Room",
      status: "online",
      icon: Thermometer,
    },
    {
      id: "temp-002",
      name: "Temperature Sensor",
      type: "sensor",
      location: "Kitchen",
      status: "online",
      icon: Thermometer,
    },
    {
      id: "temp-003",
      name: "Temperature Sensor",
      type: "sensor",
      location: "Bedroom",
      status: "offline",
      icon: Thermometer,
    },
    { id: "occ-001", name: "Occupancy Sensor", type: "sensor", location: "Living Room", status: "online", icon: Users },
    { id: "occ-002", name: "Occupancy Sensor", type: "sensor", location: "Kitchen", status: "online", icon: Users },
    {
      id: "light-001",
      name: "Smart Light",
      type: "device",
      location: "Living Room",
      status: "online",
      icon: Lightbulb,
    },
    { id: "light-002", name: "Smart Light", type: "device", location: "Kitchen", status: "online", icon: Lightbulb },
    { id: "light-003", name: "Smart Light", type: "device", location: "Bedroom", status: "offline", icon: Lightbulb },
    { id: "hvac-001", name: "HVAC Controller", type: "device", location: "Living Room", status: "online", icon: Wind },
    { id: "hvac-002", name: "HVAC Controller", type: "device", location: "Bedroom", status: "online", icon: Wind },
  ]

  const filteredDevices = allDevices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || device.type === filterType
    const matchesStatus = filterStatus === "all" || device.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('searchDevices')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="search"
            placeholder={t('searchDevicesPlaceholder')}
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  )
}
