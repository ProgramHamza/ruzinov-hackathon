"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Settings, Edit3, Save, X } from "lucide-react"
import { useTranslation } from "@/lib/translations/TranslationContext"

export function RulesPanel() {
  const { t } = useTranslation()
  const [editingRule, setEditingRule] = useState<number | null>(null)
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

  const [editValues, setEditValues] = useState({
    target: "",
    threshold: "",
  })

  const startEditing = (rule: any) => {
    setEditingRule(rule.id)
    setEditValues({
      target: rule.target,
      threshold: rule.threshold,
    })
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

  return (
    <Card className="glass-card mt-4">
      <CardHeader>
        <CardTitle>{t('automationRules')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="p-3 rounded-lg bg-white/5">
              <h3 className="font-medium">{rule.name}</h3>
              <p className="text-sm text-gray-400">{rule.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
