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

// Simplified BMW data structure with universal compatibility
const BMW_DATA = {
  years: Array.from({ length: 57 }, (_, i) => (2026 - i).toString()),

  modelsByYear: {
    "2026": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "7 Series",
      "8 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i4",
      "iX",
      "XM",
      "M2",
      "M3",
      "M4",
      "M5",
      "M8",
    ],
    "2025": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "7 Series",
      "8 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i4",
      "iX",
      "XM",
      "M2",
      "M3",
      "M4",
      "M5",
      "M8",
    ],
    "2024": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "7 Series",
      "8 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i4",
      "iX",
      "XM",
      "M2",
      "M3",
      "M4",
      "M5",
      "M8",
    ],
    "2023": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "7 Series",
      "8 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i4",
      "iX",
      "M2",
      "M3",
      "M4",
      "M5",
      "M8",
    ],
    "2022": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "7 Series",
      "8 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i4",
      "iX",
      "M2",
      "M3",
      "M4",
      "M5",
      "M8",
    ],
    "2021": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "7 Series",
      "8 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i4",
      "iX",
      "M2",
      "M3",
      "M4",
      "M5",
      "M8",
    ],
    "2020": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "8 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i3",
      "i8",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M8",
    ],
    "2019": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "8 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i3",
      "i8",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M8",
    ],
    "2018": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "Z4",
      "i3",
      "i8",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
    ],
    "2017": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "Z4",
      "i3",
      "i8",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
    ],
    "2016": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X3",
      "X4",
      "X5",
      "X6",
      "Z4",
      "i3",
      "i8",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
    ],
    "2015": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X3",
      "X4",
      "X5",
      "X6",
      "Z4",
      "i3",
      "i8",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
    ],
    "2014": [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X3",
      "X4",
      "X5",
      "X6",
      "Z4",
      "i3",
      "i8",
      "M3",
      "M4",
      "M5",
      "M6",
    ],
    "2013": [
      "1 Series",
      "2 Series",
      "3 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X3",
      "X6",
      "Z4",
      "i3",
      "M3",
      "M5",
      "M6",
    ],
    "2012": [
      "1 Series",
      "3 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X3",
      "X5",
      "X6",
      "Z4",
      "M3",
      "M5",
      "M6",
    ],
    "2011": [
      "1 Series",
      "3 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X3",
      "X5",
      "X6",
      "Z4",
      "M3",
      "M5",
      "M6",
    ],
    "2010": ["1 Series", "3 Series", "5 Series", "6 Series", "7 Series", "X1", "X3", "X5", "X6", "Z4", "M3", "M6"],
    "2009": [
      "1 Series",
      "3 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X3",
      "X5",
      "X6",
      "Z4",
      "M3",
      "M5",
      "M6",
    ],
    "2008": [
      "1 Series",
      "3 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "X1",
      "X3",
      "X5",
      "X6",
      "Z4",
      "M3",
      "M5",
      "M6",
    ],
    "2007": ["1 Series", "3 Series", "5 Series", "6 Series", "7 Series", "X1", "X3", "X5", "Z4", "M3", "M5", "M6"],
    "2006": ["1 Series", "3 Series", "5 Series", "6 Series", "7 Series", "X1", "X3", "X5", "Z4", "M3", "M5", "M6"],
    "2005": ["1 Series", "3 Series", "5 Series", "6 Series", "7 Series", "X1", "X3", "X5", "Z4", "M3", "M5", "M6"],
    "2004": ["1 Series", "3 Series", "5 Series", "6 Series", "7 Series", "X1", "X3", "X5", "Z4", "M3"],
    "2003": ["3 Series", "5 Series", "6 Series", "7 Series", "X3", "X5", "Z4", "M3", "M5"],
    "2002": ["3 Series", "5 Series", "7 Series", "X3", "X5", "Z3", "Z4", "Z8", "M3"],
    "2001": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "Z8", "M3"],
    "2000": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "Z4", "Z8", "M3", "M5"],
    "1999": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "Z4", "8 Series", "M3"],
    "1998": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "Z4", "8 Series", "M3"],
    "1997": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "Z4", "8 Series", "M3"],
    "1996": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "Z4", "8 Series", "M3"],
    "1995": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "Z4", "8 Series", "M3"],
    "1994": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "8 Series", "M3"],
    "1993": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "8 Series", "M3"],
    "1992": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "8 Series", "M3"],
    "1991": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "8 Series", "M3"],
    "1990": ["3 Series", "5 Series", "7 Series", "X5", "Z3", "Z4", "8 Series", "M3"],
    "1989": ["3 Series", "5 Series", "7 Series", "X5", "M3"],
    "1988": ["3 Series", "5 Series", "7 Series", "X5", "M3"],
    "1987": ["3 Series", "5 Series", "7 Series", "M3"],
    "1986": ["3 Series", "5 Series", "7 Series", "M3"],
    "1985": ["3 Series", "5 Series", "7 Series", "M3"],
    "1984": ["3 Series", "5 Series", "7 Series", "M3"],
    "1983": ["3 Series", "5 Series", "7 Series", "M3"],
    "1982": ["3 Series", "5 Series", "7 Series", "M3"],
    "1981": ["3 Series", "5 Series", "7 Series", "M3"],
    "1980": ["3 Series", "5 Series", "7 Series", "M3"],
    "1979": ["3 Series", "5 Series", "7 Series"],
    "1978": ["3 Series", "5 Series", "7 Series"],
    "1977": ["3 Series", "5 Series", "7 Series"],
    "1976": ["3 Series", "5 Series"],
    "1975": ["3 Series", "5 Series"],
    "1974": ["3 Series", "5 Series"],
    "1973": ["5 Series"],
    "1972": ["5 Series"],
    "1971": ["5 Series"],
    "1970": ["5 Series"],
  } as Record<string, string[]>,

  // Universal chassis mapping - every model has chassis codes for every year it's available
  chassisByModel: {
    "1 Series": ["F40", "F20", "F21", "E82", "E87", "E88"],
    "2 Series": ["F44", "F45", "F46", "F22", "F23"],
    "3 Series": ["G20", "G21", "F30", "F31", "F34", "E90", "E91", "E92", "E93", "E46", "E36", "E30", "E21"],
    "4 Series": ["G22", "G23", "G26", "F32", "F33", "F36"],
    "5 Series": ["G30", "G31", "F10", "F11", "F07", "E60", "E61", "E39", "E34", "E28", "E12"],
    "6 Series": ["F12", "F13", "F06", "E63", "E64"],
    "7 Series": ["G70", "G11", "G12", "F01", "F02", "E65", "E66", "E38", "E23"],
    "8 Series": ["G14", "G15", "G16", "E31"],
    X1: ["U11", "F48", "E84"],
    X2: ["U10", "F39"],
    X3: ["G01", "F25", "E83"],
    X4: ["G02", "F26"],
    X5: ["G05", "F15", "E70", "E53"],
    X6: ["G06", "F16", "E71"],
    X7: ["G07"],
    Z3: ["E36"],
    Z4: ["G29", "E89", "E85", "E86"],
    Z8: ["E52"],
    i3: ["I01"],
    i4: ["G26"],
    i8: ["I12"],
    iX: ["I20"],
    XM: ["G09"],
    M2: ["G87", "F87"],
    M3: ["G80", "F80", "E92", "E90", "E46", "E36", "E30"],
    M4: ["G82", "G83", "F82", "F83"],
    M5: ["F90", "F10", "E60", "E39"],
    M6: ["F12", "F13", "F06", "E63", "E64"],
    M8: ["F91", "F92", "F93"],
  } as Record<string, string[]>,

  // Universal engine mapping - every chassis has common BMW engines
  enginesByChassis: {
    // Modern engines for all current chassis
    G20: ["B48", "B58", "N20", "N55"],
    G21: ["B48", "B58", "N20", "N55"],
    G22: ["B48", "B58", "N20", "N55"],
    G23: ["B48", "B58", "N20", "N55"],
    G26: ["B48", "B58", "N20", "N55"],
    G30: ["B48", "B58", "N20", "N55"],
    G31: ["B48", "B58", "N20", "N55"],
    G70: ["B58", "N63", "V8"],
    G80: ["S58"],
    G82: ["S58"],
    G83: ["S58"],
    G87: ["S58"],
    F30: ["N20", "N55", "B48", "B58"],
    F31: ["N20", "N55", "B48", "B58"],
    F32: ["N20", "N55", "B48", "B58"],
    F33: ["N20", "N55", "B48", "B58"],
    F36: ["N20", "N55", "B48", "B58"],
    F40: ["B38", "B48"],
    F44: ["B38", "B48"],
    F22: ["N20", "N55", "B48"],
    F23: ["N20", "N55", "B48"],
    F10: ["N52", "N54", "N55", "S63"],
    F11: ["N52", "N54", "N55", "S63"],
    F80: ["S55"],
    F82: ["S55"],
    F83: ["S55"],
    F87: ["N55", "S55"],
    F90: ["S63", "V8"],
    E90: ["N52", "N54", "N55"],
    E91: ["N52", "N54", "N55"],
    E92: ["N52", "N54", "N55", "S65"],
    E93: ["N52", "N54", "N55"],
    E46: ["M52", "M54", "S54"],
    E36: ["M50", "M52", "S50", "S52"],
    E30: ["M20", "M30", "S14"],
    E21: ["M10", "M20"],
    E60: ["N52", "N54", "S85"],
    E61: ["N52", "N54"],
    E39: ["M52", "M54", "S62"],
    E34: ["M50", "M60"],
    E28: ["M20", "M30", "S38"],
    E12: ["M10", "M30"],
    // X-Series engines
    G01: ["B48", "B58"],
    G02: ["B48", "B58"],
    G05: ["B58", "N63", "V8"],
    G06: ["B58", "N63", "V8"],
    G07: ["B58", "N63", "V8"],
    F25: ["N20", "N55"],
    F26: ["N20", "N55"],
    F15: ["N55", "N63", "S63"],
    F16: ["N55", "N63", "S63"],
    E70: ["N52", "N55", "S63"],
    E71: ["N54", "N63", "S63"],
    E83: ["M54", "N52"],
    E53: ["M54", "N62"],
    F48: ["B38", "B48"],
    U11: ["B38", "B48"],
    F39: ["B38", "B48"],
    U10: ["B38", "B48"],
    E84: ["N20", "N52"],
    // Z-Series engines
    G29: ["B58"],
    E89: ["N20", "N54", "N55"],
    E85: ["M54", "S54"],
    E86: ["M54", "S54"],
    E52: ["S62"],
    // i-Series engines
    I01: ["Electric", "I3"],
    I12: ["B38", "Electric"],
    I20: ["Electric"],
    G09: ["S68", "V8"],
    // Classic engines for older chassis
    E63: ["N52", "S85"],
    E64: ["N52", "S85"],
    F12: ["N63", "S63"],
    F13: ["N63", "S63"],
    F06: ["N63", "S63"],
    E65: ["N62", "N73"],
    E66: ["N62", "N73"],
    F01: ["N63", "N74"],
    F02: ["N63", "N74"],
    G11: ["B58", "N63"],
    G12: ["B58", "N63"],
    E38: ["M60", "M62", "M73"],
    E23: ["M30", "M60"],
    G14: ["B58", "N63", "S63"],
    G15: ["B58", "N63", "S63"],
    G16: ["B58", "N63", "S63"],
    E31: ["M60", "M70", "S70"],
    F91: ["S63"],
    F92: ["S63"],
    F93: ["S63"],
  } as Record<string, string[]>,

  transmissionsByEngine: {
    B38: ["6MT", "7AT", "8AT"],
    B48: ["6MT", "8AT", "8HP"],
    B58: ["6MT", "8AT", "8HP"],
    N20: ["6MT", "8AT"],
    N52: ["6MT", "6AT"],
    N54: ["6MT", "7DCT"],
    N55: ["6MT", "8AT", "7DCT"],
    N63: ["8AT", "8HP"],
    S55: ["6MT", "7DCT"],
    S58: ["6MT", "8AT"],
    S63: ["7DCT", "8AT"],
    S65: ["6MT", "7DCT"],
    S85: ["6MT"],
    M52: ["5MT", "5AT"],
    M54: ["5MT", "5AT"],
    S54: ["6MT"],
    M50: ["5MT", "4AT"],
    S50: ["5MT"],
    S52: ["5MT"],
    M20: ["5MT", "4AT"],
    M30: ["5MT", "4AT"],
    S14: ["5MT"],
    M10: ["4MT", "3AT"],
    S62: ["6MT"],
    M60: ["5MT", "5AT"],
    S38: ["5MT"],
    N74: ["8AT"],
    M62: ["5AT"],
    M73: ["5AT"],
    M70: ["5MT", "4AT"],
    S70: ["6MT"],
    I3: ["Single Speed"],
    Electric: ["Single Speed"],
    S68: ["8AT"],
    V8: ["8AT", "8HP"],
  } as Record<string, string[]>,
}

export function HierarchicalCarSelector({ onSelectionChange, value, className }: HierarchicalCarSelectorProps) {
  const [selection, setSelection] = useState<CarSelection>(value || {})

  const handleSelectionChange = (field: keyof CarSelection, newValue: string | number) => {
    const newSelection = { ...selection, [field]: newValue }

    // Reset dependent fields when parent changes
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

  // Simplified data access with universal compatibility
  const availableModels = selection.year ? BMW_DATA.modelsByYear[selection.year.toString()] || [] : []
  const availableChassis = selection.modelName ? BMW_DATA.chassisByModel[selection.modelName] || [] : []
  const availableEngines = selection.chassisCode ? BMW_DATA.enginesByChassis[selection.chassisCode] || [] : []
  const availableTransmissions = selection.engineCode ? BMW_DATA.transmissionsByEngine[selection.engineCode] || [] : []

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
                {BMW_DATA.years.map((year) => (
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
