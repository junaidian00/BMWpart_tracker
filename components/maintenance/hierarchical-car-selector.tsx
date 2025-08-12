"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export interface CarSelection {
  year?: number
  modelId?: number
  modelName?: string
  chassisCode?: string
  chassisName?: string
  bodyType?: string
  engineCode?: string
  engineName?: string
  transmissionCode?: string
  transmissionName?: string
  buildDate?: string // yyyy-mm
}

interface HierarchicalCarSelectorProps {
  onSelectionChange?: (selection: CarSelection) => void
  value?: CarSelection
  className?: string
}

const MINIMAL_BMW_DATA = {
  years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"],

  models: ["3 Series", "4 Series", "5 Series", "M3", "M4", "M5", "X3", "X5"],

  chassisByModel: {
    "3 Series": ["G20", "F30"],
    "4 Series": ["G22", "F32"],
    "5 Series": ["G30", "F10"],
    M3: ["G80", "F80"],
    M4: ["G82", "F82"],
    M5: ["F90"],
    X3: ["G01", "F25"],
    X5: ["G05", "F15"],
  } as Record<string, string[]>,

  engines: ["B48", "B58", "N55", "S55", "S58"],

  transmissions: ["6MT", "8AT", "8HP"],
}

export function HierarchicalCarSelector({ onSelectionChange, value, className }: HierarchicalCarSelectorProps) {
  const [selection, setSelection] = useState<CarSelection>(value || {})

  const handleSelectionChange = (field: keyof CarSelection, newValue: string | number) => {
    const newSelection = { ...selection, [field]: newValue }

    if (field === "year") {
      newSelection.modelName = undefined
      newSelection.chassisCode = undefined
      newSelection.engineCode = undefined
      newSelection.transmissionCode = undefined
    } else if (field === "modelName") {
      newSelection.chassisCode = undefined
      newSelection.engineCode = undefined
      newSelection.transmissionCode = undefined
    } else if (field === "chassisCode") {
      newSelection.engineCode = undefined
      newSelection.transmissionCode = undefined
    } else if (field === "engineCode") {
      newSelection.transmissionCode = undefined
    }

    setSelection(newSelection)
    onSelectionChange?.(newSelection)
  }

  const availableModels = selection.year ? MINIMAL_BMW_DATA.models : []
  const availableChassis = selection.modelName ? MINIMAL_BMW_DATA.chassisByModel[selection.modelName] || [] : []
  const availableEngines = selection.chassisCode ? MINIMAL_BMW_DATA.engines : []
  const availableTransmissions = selection.engineCode ? MINIMAL_BMW_DATA.transmissions : []

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Select Your BMW</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Year Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Select
              value={selection.year?.toString() || ""}
              onValueChange={(value) => handleSelectionChange("year", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {MINIMAL_BMW_DATA.years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Select
              value={selection.modelName || ""}
              onValueChange={(value) => handleSelectionChange("modelName", value)}
              disabled={!selection.year}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chassis Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Chassis Code</label>
            <Select
              value={selection.chassisCode || ""}
              onValueChange={(value) => handleSelectionChange("chassisCode", value)}
              disabled={!selection.modelName}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chassis" />
              </SelectTrigger>
              <SelectContent>
                {availableChassis.map((chassis) => (
                  <SelectItem key={chassis} value={chassis}>
                    {chassis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Engine Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Engine Code</label>
            <Select
              value={selection.engineCode || ""}
              onValueChange={(value) => handleSelectionChange("engineCode", value)}
              disabled={!selection.chassisCode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select engine" />
              </SelectTrigger>
              <SelectContent>
                {availableEngines.map((engine) => (
                  <SelectItem key={engine} value={engine}>
                    {engine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transmission Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Transmission</label>
            <Select
              value={selection.transmissionCode || ""}
              onValueChange={(value) => handleSelectionChange("transmissionCode", value)}
              disabled={!selection.engineCode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                {availableTransmissions.map((transmission) => (
                  <SelectItem key={transmission} value={transmission}>
                    {transmission}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selection Summary */}
        {(selection.year ||
          selection.modelName ||
          selection.chassisCode ||
          selection.engineCode ||
          selection.transmissionCode) && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {selection.year && <Badge variant="secondary">{selection.year}</Badge>}
            {selection.modelName && <Badge variant="secondary">{selection.modelName}</Badge>}
            {selection.chassisCode && <Badge variant="secondary">{selection.chassisCode}</Badge>}
            {selection.engineCode && <Badge variant="secondary">{selection.engineCode}</Badge>}
            {selection.transmissionCode && <Badge variant="secondary">{selection.transmissionCode}</Badge>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default HierarchicalCarSelector
