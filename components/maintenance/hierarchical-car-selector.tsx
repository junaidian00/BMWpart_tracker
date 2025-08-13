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

const YEAR_ACCURATE_BMW_DATA = {
  // All years from 1970 to 2024
  years: Array.from({ length: 55 }, (_, i) => 2024 - i),

  // Models available by year
  modelsByYear: {
    2024: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "7 Series",
      "8 Series",
      "M2",
      "M3",
      "M4",
      "M5",
      "M8",
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
    ],
    2023: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "7 Series",
      "8 Series",
      "M2",
      "M3",
      "M4",
      "M5",
      "M8",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i3",
      "i4",
      "i8",
      "iX",
    ],
    2022: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "8 Series",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M8",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i3",
      "i4",
      "i8",
      "iX",
    ],
    2021: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "8 Series",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M8",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4",
      "i3",
      "i4",
      "i8",
    ],
    2020: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "8 Series",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M8",
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
    ],
    2019: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "8 Series",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M8",
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
    ],
    2018: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
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
    ],
    2017: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "Z4",
      "i3",
      "i8",
    ],
    2016: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "X1",
      "X2",
      "X3",
      "X4",
      "X5",
      "X6",
      "Z4",
      "i3",
      "i8",
    ],
    2015: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "M3",
      "M4",
      "M5",
      "M6",
      "X1",
      "X3",
      "X4",
      "X5",
      "X6",
      "Z4",
      "i3",
      "i8",
    ],
    2014: [
      "1 Series",
      "2 Series",
      "3 Series",
      "4 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "M3",
      "M4",
      "M5",
      "M6",
      "X1",
      "X3",
      "X4",
      "X5",
      "X6",
      "Z4",
      "i3",
      "i8",
    ],
    2013: [
      "1 Series",
      "3 Series",
      "5 Series",
      "6 Series",
      "7 Series",
      "M3",
      "M5",
      "M6",
      "X1",
      "X3",
      "X5",
      "X6",
      "Z4",
      "i3",
    ],
    2012: ["1 Series", "3 Series", "5 Series", "6 Series", "7 Series", "M3", "M5", "M6", "X1", "X3", "X5", "X6", "Z4"],
    2011: ["1 Series", "3 Series", "5 Series", "6 Series", "7 Series", "M3", "M5", "M6", "X1", "X3", "X5", "X6", "Z4"],
    2010: ["1 Series", "3 Series", "5 Series", "6 Series", "7 Series", "M3", "M5", "M6", "X1", "X3", "X5", "X6", "Z4"],
    // ... continuing pattern for older years
  } as Record<number, string[]>,

  // Chassis codes by model and year
  chassisByModelAndYear: {
    "1 Series": {
      2024: ["F40"],
      2023: ["F40"],
      2022: ["F40"],
      2021: ["F40"],
      2020: ["F40", "F20", "F21"],
      2019: ["F20", "F21"],
      2018: ["F20", "F21"],
      2017: ["F20", "F21"],
      2016: ["F20", "F21"],
      2015: ["F20", "F21"],
      2014: ["F20", "F21"],
      2013: ["F20", "F21"],
      2012: ["F20", "F21"],
      2011: ["E87", "E82"],
      2010: ["E87", "E82"],
    },
    "2 Series": {
      2024: ["F44", "F45", "F46"],
      2023: ["F44", "F45", "F46"],
      2022: ["F22", "F23", "F44", "F45", "F46"],
      2021: ["F22", "F23", "F44", "F45", "F46"],
      2020: ["F22", "F23", "F44", "F45", "F46"],
      2019: ["F22", "F23", "F45", "F46"],
      2018: ["F22", "F23", "F45", "F46"],
      2017: ["F22", "F23", "F45", "F46"],
      2016: ["F22", "F23", "F45", "F46"],
      2015: ["F22", "F23", "F45", "F46"],
      2014: ["F22", "F23", "F45", "F46"],
    },
    "3 Series": {
      2024: ["G20", "G21"],
      2023: ["G20", "G21"],
      2022: ["G20", "G21"],
      2021: ["G20", "G21"],
      2020: ["G20", "G21"],
      2019: ["G20", "F30", "F31"],
      2018: ["F30", "F31", "F34"],
      2017: ["F30", "F31", "F34"],
      2016: ["F30", "F31", "F34"],
      2015: ["F30", "F31", "F34"],
      2014: ["F30", "F31", "F34"],
      2013: ["F30", "F31"],
      2012: ["F30", "E90", "E91", "E92", "E93"],
      2011: ["E90", "E91", "E92", "E93"],
      2010: ["E90", "E91", "E92", "E93"],
    },
    "4 Series": {
      2024: ["G22", "G23", "G26"],
      2023: ["G22", "G23", "G26"],
      2022: ["G22", "G23", "G26"],
      2021: ["G22", "G23", "G26"],
      2020: ["F32", "F33", "F36"],
      2019: ["F32", "F33", "F36"],
      2018: ["F32", "F33", "F36"],
      2017: ["F32", "F33", "F36"],
      2016: ["F32", "F33", "F36"],
      2015: ["F32", "F33", "F36"],
      2014: ["F32", "F33", "F36"],
    },
    M2: {
      2024: ["G87"],
      2023: ["G87"],
      2022: ["G87", "F87"],
      2021: ["F87"],
      2020: ["F87"],
      2019: ["F87"],
      2018: ["F87"],
      2017: ["F87"],
      2016: ["F87"],
    },
    M3: {
      2024: ["G80"],
      2023: ["G80"],
      2022: ["G80"],
      2021: ["G80"],
      2020: ["F80"],
      2019: ["F80"],
      2018: ["F80"],
      2017: ["F80"],
      2016: ["F80"],
      2015: ["F80"],
      2014: ["F80"],
      2013: ["E90", "E92", "E93"],
      2012: ["E90", "E92", "E93"],
      2011: ["E90", "E92", "E93"],
      2010: ["E90", "E92", "E93"],
    },
    M4: {
      2024: ["G82", "G83"],
      2023: ["G82", "G83"],
      2022: ["G82", "G83"],
      2021: ["G82", "G83"],
      2020: ["F82", "F83", "G82", "G83"],
      2019: ["F82", "F83", "G82", "G83"],
      2018: ["F82", "F83"],
      2017: ["F82", "F83"],
      2016: ["F82", "F83"],
      2015: ["F82", "F83"],
      2014: ["F82", "F83"],
    },
    // ... continuing for all other models
  } as Record<string, Record<number, string[]>>,

  // Engine codes by chassis and year
  enginesByChassisAndYear: {
    // 1 Series engines
    F40: {
      2024: ["B38", "B48"],
      2023: ["B38", "B48"],
      2022: ["B38", "B48"],
      2021: ["B38", "B48"],
      2020: ["B38", "B48"],
    },
    F20: {
      2020: ["B38", "B48", "N20"],
      2019: ["B38", "B48", "N20"],
      2018: ["B38", "B48", "N20"],
      2017: ["B38", "B48", "N20"],
      2016: ["B38", "B48", "N20"],
      2015: ["B38", "B48", "N20"],
      2014: ["B38", "N20"],
      2013: ["N20", "N13"],
      2012: ["N20", "N13"],
    },
    F21: {
      2020: ["B38", "B48", "N20"],
      2019: ["B38", "B48", "N20"],
      2018: ["B38", "B48", "N20"],
      2017: ["B38", "B48", "N20"],
      2016: ["B38", "B48", "N20"],
      2015: ["B38", "B48", "N20"],
      2014: ["B38", "N20"],
      2013: ["N20", "N13"],
      2012: ["N20", "N13"],
    },
    // 2 Series engines
    F22: {
      2022: ["B38", "B48", "B58"],
      2021: ["B38", "B48", "B58"],
      2020: ["B38", "B48", "B58"],
      2019: ["B38", "B48", "B58"],
      2018: ["B38", "B48", "B58"],
      2017: ["B38", "B48", "B58"],
      2016: ["B38", "B48", "B58"],
      2015: ["B38", "B48", "B58"],
      2014: ["B38", "N20", "N55"],
    },
    F23: {
      2022: ["B38", "B48", "B58"],
      2021: ["B38", "B48", "B58"],
      2020: ["B38", "B48", "B58"],
      2019: ["B38", "B48", "B58"],
      2018: ["B38", "B48", "B58"],
      2017: ["B38", "B48", "B58"],
      2016: ["B38", "B48", "B58"],
      2015: ["B38", "B48", "B58"],
      2014: ["B38", "N20", "N55"],
    },
    // 3 Series engines
    G20: {
      2024: ["B48", "B58"],
      2023: ["B48", "B58"],
      2022: ["B48", "B58"],
      2021: ["B48", "B58"],
      2020: ["B48", "B58"],
      2019: ["B48", "B58"],
    },
    F30: {
      2019: ["B48", "B58", "N20", "N26", "N55"],
      2018: ["B48", "B58", "N20", "N26", "N55"],
      2017: ["B48", "B58", "N20", "N26", "N55"],
      2016: ["B48", "B58", "N20", "N26", "N55"],
      2015: ["B48", "N20", "N26", "N55"],
      2014: ["N20", "N26", "N55"],
      2013: ["N20", "N26", "N55"],
      2012: ["N20", "N26", "N55"],
    },
    // M3 engines
    G80: {
      2024: ["S58"],
      2023: ["S58"],
      2022: ["S58"],
      2021: ["S58"],
    },
    F80: {
      2020: ["S55"],
      2019: ["S55"],
      2018: ["S55"],
      2017: ["S55"],
      2016: ["S55"],
      2015: ["S55"],
      2014: ["S55"],
    },
    // M4 engines
    G82: {
      2024: ["S58"],
      2023: ["S58"],
      2022: ["S58"],
      2021: ["S58"],
      2020: ["S58"],
      2019: ["S58"],
    },
    F82: {
      2020: ["S55"],
      2019: ["S55"],
      2018: ["S55"],
      2017: ["S55"],
      2016: ["S55"],
      2015: ["S55"],
      2014: ["S55"],
    },
    // ... continuing for all chassis codes
  } as Record<string, Record<number, string[]>>,

  // Transmissions by engine code
  transmissionsByEngine: {
    // Modern engines
    B38: ["6MT", "7DCT", "8AT"],
    B46: ["6MT", "7DCT", "8AT"],
    B48: ["6MT", "8AT", "8HP"],
    B58: ["6MT", "8AT", "8HP"],

    // Performance engines
    S55: ["6MT", "7DCT"],
    S58: ["6MT", "8AT"],
    S63: ["8AT", "8HP"],
    S68: ["8AT"],

    // Legacy engines
    N20: ["6MT", "8AT"],
    N26: ["8AT"],
    N52: ["6MT", "6AT"],
    N54: ["6MT", "7DCT"],
    N55: ["6MT", "8AT"],
    N63: ["8AT"],

    // Classic engines
    M54: ["5MT", "5AT"],
    M52: ["5MT", "5AT"],
    M50: ["5MT"],
    S54: ["6MT", "SMG"],
    S62: ["6MT", "5AT"],

    // Electric
    eDrive: ["Single-Speed"],
  } as Record<string, string[]>,
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

  const availableModels = selection.year ? YEAR_ACCURATE_BMW_DATA.modelsByYear[selection.year] || [] : []

  const availableChassis =
    selection.modelName && selection.year
      ? YEAR_ACCURATE_BMW_DATA.chassisByModelAndYear[selection.modelName]?.[selection.year] || []
      : []

  const availableEngines =
    selection.chassisCode && selection.year
      ? YEAR_ACCURATE_BMW_DATA.enginesByChassisAndYear[selection.chassisCode]?.[selection.year] || []
      : []

  const availableTransmissions = selection.engineCode
    ? YEAR_ACCURATE_BMW_DATA.transmissionsByEngine[selection.engineCode] || []
    : []

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
                {YEAR_ACCURATE_BMW_DATA.years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
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
