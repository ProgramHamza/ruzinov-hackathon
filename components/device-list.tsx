import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/translations/TranslationContext"

export function DeviceList() {
  const { t } = useTranslation()

  const devices = [
    { id: 1, name: "HVAC System", status: "active", type: "climate" },
    { id: 2, name: "Lighting Control", status: "active", type: "lighting" },
    { id: 3, name: "Security Camera 1", status: "active", type: "security" },
    { id: 4, name: "Security Camera 2", status: "active", type: "security" },
  ]

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>{t('devices')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <h3 className="font-medium">{device.name}</h3>
                <p className="text-sm text-gray-400">{t(`deviceTypes.${device.type}`)}</p>
              </div>
              <Badge variant="default">{t(`status.${device.status}`)}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 