"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car } from "lucide-react"
import { Label } from "@/components/ui/label"

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
  onSelectionComplete: (selection: CarSelection) => void
  initialSelection?: CarSelection
  showTitle?: boolean
  compact?: boolean
  className?: string
  value?: { year: string; model: string; chassis: string; engine: string; transmission: string }
  onChange?: (next: { year: string; model: string; chassis: string; engine: string; transmission: string }) => void
}

const DATA = {
  years: Array.from({ length: 20 }, (_, i) => (2024 - i).toString()),
  modelsByYear: {
    "2024": ["G20 330i", "G20 M340i", "F40 M135i", "G87 M2"],
    "2023": ["G20 330i", "G20 M340i", "F40 M135i", "G87 M2"],
    "2022": ["G20 330i", "G20 M340i", "F40 M135i", "G87 M2"],
    "2021": ["G20 330i", "G20 M340i", "F40 M135i", "G87 M2"],
    "2020": ["G20 330i", "G20 M340i", "F40 M135i", "F87 M2"],
    "2019": ["G20 330i", "G20 M340i", "F40 M135i", "F87 M2"],
    "2018": ["F30 330i", "F30 340i", "F22 230i", "F87 M2 Competition"],
    "2017": ["F30 330i", "F30 340i", "F22 230i", "F87 M2"],
    "2016": ["F30 340i", "F22 230i", "F87 M2"],
    "2015": ["F30 328i", "F30 335i", "F22 228i", "F22 M235i", "F87 M2"],
    "2014": ["F30 328i", "F30 335i", "F22 228i", "F22 M235i"],
    "2013": ["F30 328i", "F30 335i", "F22 228i", "F22 M235i"],
    "2012": ["F30 328i", "F30 335i", "F22 228i"],
    "2011": ["E90 328i", "E90 335i", "E82 128i"],
    "2010": ["E90 328i", "E90 335i", "E82 128i"],
    "2009": ["E90 328i", "E90 335i", "E82 128i"],
    "2008": ["E90 328i", "E90 335i", "E82 128i"],
    "2007": ["E90 328i", "E90 335i", "E82 128i"],
    "2006": ["E90 325i", "E90 330i", "E82 128i"],
    "2005": ["E90 325i", "E90 330i"],
  } as Record<string, string[]>,
  chassisByModel: {
    // G20 3 Series
    "G20 330i": ["G20"],
    "G20 M340i": ["G20"],
    // F40 1 Series
    "F40 M135i": ["F40"],
    // G87/F87 M2
    "G87 M2": ["G87"],
    "F87 M2": ["F87"],
    "F87 M2 Competition": ["F87"],
    // F30 3 Series
    "F30 328i": ["F30"],
    "F30 335i": ["F30"],
    "F30 340i": ["F30"],
    "F30 330i": ["F30"],
    // F22 2 Series
    "F22 228i": ["F22"],
    "F22 230i": ["F22"],
    "F22 M235i": ["F22"],
    // E90 3 Series
    "E90 328i": ["E90"],
    "E90 335i": ["E90"],
    "E90 325i": ["E90"],
    "E90 330i": ["E90"],
    // E82 1 Series
    "E82 128i": ["E82"],
  } as Record<string, string[]>,
  enginesByChassis: {
    G20: ["B48", "B58"],
    F40: ["B48"],
    G87: ["S58"],
    F87: ["N55", "S55"],
    F30: ["N20", "N26", "N55", "B58"],
    F22: ["N20", "N55", "B48"],
    E90: ["N52", "N54", "N55"],
    E82: ["N52", "N54"],
  } as Record<string, string[]>,
  transmissionsByEngine: {
    B48: ["6MT", "8HP"],
    B58: ["6MT", "8HP"],
    S58: ["6MT", "8HP"],
    N20: ["6MT", "8HP"],
    N26: ["8HP"],
    N55: ["6MT", "8HP", "DCT"],
    S55: ["6MT", "DCT"],
    N52: ["6MT", "6HP"],
    N54: ["6MT", "6HP", "DCT"],
  } as Record<string, string[]>,
} as const

function HierarchicalCarSelectorInner({
  value,
  onChange,
}: {
  value?: { year: string; model: string; chassis: string; engine: string; transmission: string }
  onChange?: (next: { year: string; model: string; chassis: string; engine: string; transmission: string }) => void
}) {
  const val = {
    year: value?.year || "",
    model: value?.model || "",
    chassis: value?.chassis || "",
    engine: value?.engine || "",
    transmission: value?.transmission || "",
  }

  const models = useMemo(() => {
    if (!val.year) return []
    return DATA.modelsByYear[val.year] || []
  }, [val.year])

  const chassis = useMemo(() => {
    if (!val.model) return []
    return DATA.chassisByModel[val.model] || []
  }, [val.model])

  const engines = useMemo(() => {
    if (!val.chassis) return []
    return DATA.enginesByChassis[val.chassis] || []
  }, [val.chassis])

  const transmissions = useMemo(() => {
    if (!val.engine) return []
    return DATA.transmissionsByEngine[val.engine] || []
  }, [val.engine])

  function set<K extends keyof typeof val>(key: K, next: string) {
    const base = { ...val, [key]: next }
    if (key === "year") {
      base.model = ""
      base.chassis = ""
      base.engine = ""
      base.transmission = ""
    } else if (key === "model") {
      base.chassis = ""
      base.engine = ""
      base.transmission = ""
    } else if (key === "chassis") {
      base.engine = ""
      base.transmission = ""
    } else if (key === "engine") {
      base.transmission = ""
    }
    onChange?.(base)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-2">
        <Label>Year</Label>
        <Select value={val.year} onValueChange={(v) => set("year", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {DATA.years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Model</Label>
        <Select value={val.model} onValueChange={(v) => set("model", v)} disabled={!val.year}>
          <SelectTrigger>
            <SelectValue placeholder={val.year ? "Select model" : "Select year first"} />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Chassis</Label>
        <Select value={val.chassis} onValueChange={(v) => set("chassis", v)} disabled={!val.model}>
          <SelectTrigger>
            <SelectValue placeholder={val.model ? "Select chassis" : "Select model first"} />
          </SelectTrigger>
          <SelectContent>
            {chassis.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Engine</Label>
        <Select value={val.engine} onValueChange={(v) => set("engine", v)} disabled={!val.chassis}>
          <SelectTrigger>
            <SelectValue placeholder={val.chassis ? "Select engine" : "Select chassis first"} />
          </SelectTrigger>
          <SelectContent>
            {engines.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Transmission</Label>
        <Select value={val.transmission} onValueChange={(v) => set("transmission", v)} disabled={!val.engine}>
          <SelectTrigger>
            <SelectValue placeholder={val.engine ? "Select transmission" : "Select engine first"} />
          </SelectTrigger>
          <SelectContent>
            {transmissions.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function HierarchicalCarSelector({
  onSelectionComplete,
  initialSelection,
  showTitle = true,
  compact = false,
  className,
  value,
  onChange,
}: HierarchicalCarSelectorProps) {
  const [selection, setSelection] = useState<CarSelection>(initialSelection || {})

  if (value && onChange) {
    return (
      <div className={className}>
        {showTitle && !compact && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Select Your BMW
              </CardTitle>
              <CardDescription>Choose your vehicle specifications step by step.</CardDescription>
            </CardHeader>
            <CardContent>
              <HierarchicalCarSelectorInner value={value} onChange={onChange} />
            </CardContent>
          </Card>
        )}
        {(compact || !showTitle) && <HierarchicalCarSelectorInner value={value} onChange={onChange} />}
      </div>
    )
  }

  const handleSimpleChange = (simpleSelection: {
    year: string
    model: string
    chassis: string
    engine: string
    transmission: string
  }) => {
    const carSelection: CarSelection = {
      year: simpleSelection.year ? Number.parseInt(simpleSelection.year) : undefined,
      modelName: simpleSelection.model || undefined,
      chassisCode: simpleSelection.chassis || undefined,
      engineCode: simpleSelection.engine || undefined,
      transmissionCode: simpleSelection.transmission || undefined,
    }
    setSelection(carSelection)
    onSelectionComplete(carSelection)
  }

  const simpleValue = {
    year: selection.year?.toString() || "",
    model: selection.modelName || "",
    chassis: selection.chassisCode || "",
    engine: selection.engineCode || "",
    transmission: selection.transmissionCode || "",
  }

  if (compact) {
    return (
      <div className={className}>
        <HierarchicalCarSelectorInner value={simpleValue} onChange={handleSimpleChange} />
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Select Your BMW
        </CardTitle>
        <CardDescription>Choose your vehicle specifications step by step.</CardDescription>
      </CardHeader>
      <CardContent>
        <HierarchicalCarSelectorInner value={simpleValue} onChange={handleSimpleChange} />
      </CardContent>
    </Card>
  )
}

export default HierarchicalCarSelector
