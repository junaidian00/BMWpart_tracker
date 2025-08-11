"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Car, Calendar, Cog, Zap, Settings, ChevronRight, Check, Factory } from "lucide-react"
import { Input } from "@/components/ui/input"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import {
  offlineModelsForYear,
  offlineChassisForModelYear,
  offlineEnginesForModelYearChassis,
  offlineBodyForModelYearChassis,
  offlineChassisByCode,
} from "@/lib/catalog-offline"
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
}

type DBVariantRow = {
  id: number
  model_name: string
  marketing_name: string | null
  body_type: string | null
  drivetrain: string | null
  production_start: number | null
  production_end: number | null
  chassis_id?: number | null
  engine_id?: number | null
  chassis?: { chassis_code: string; chassis_name: string } | null
  engine?: { engine_code: string; engine_name: string | null } | null
}

type TransmissionRow = {
  transmission_code: string
  transmission_name: string
  transmission_type: string | null
  gear_count: number | null
  manufacturer: string | null
}

// Simple demo dataset covering common BMW selections
const DATA = {
  years: ["2013", "2014", "2015", "2016", "2017", "2018"],
  modelsByYear: {
    "2013": ["F30 328i", "F30 335i", "F22 228i", "F22 M235i"],
    "2014": ["F30 328i", "F30 335i", "F22 228i", "F22 M235i"],
    "2015": ["F30 328i", "F30 335i", "F22 228i", "F22 M235i", "F87 M2"],
    "2016": ["F30 340i", "F22 230i", "F87 M2"],
    "2017": ["F30 330i", "F30 340i", "F22 230i", "F87 M2"],
    "2018": ["F30 330i", "F30 340i", "F22 230i", "F87 M2 Competition"],
  } as Record<string, string[]>,
  chassisByModel: {
    "F30 328i": ["F30"],
    "F30 335i": ["F30"],
    "F30 340i": ["F30"],
    "F30 330i": ["F30"],
    "F22 228i": ["F22"],
    "F22 230i": ["F22"],
    "F22 M235i": ["F22"],
    "F87 M2": ["F87"],
    "F87 M2 Competition": ["F87"],
  } as Record<string, string[]>,
  enginesByChassis: {
    F30: ["N20", "N26", "N55", "B58"],
    F22: ["N20", "N55", "B48"],
    F87: ["N55", "S55"],
  } as Record<string, string[]>,
  transmissionsByEngine: {
    N20: ["6MT", "8HP"],
    N26: ["8HP"],
    N55: ["6MT", "8HP", "DCT"],
    B58: ["6MT", "8HP"],
    B48: ["6MT", "8HP"],
    S55: ["6MT", "DCT"],
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

  const models = useMemo(() => DATA.modelsByYear[val.year] || [], [val.year])
  const chassis = useMemo(() => DATA.chassisByModel[val.model] || [], [val.model])
  const engines = useMemo(() => (val.chassis ? DATA.enginesByChassis[val.chassis] || [] : []), [val.chassis])
  const transmissions = useMemo(() => (val.engine ? DATA.transmissionsByEngine[val.engine] || [] : []), [val.engine])

  function set<K extends keyof typeof val>(key: K, next: string) {
    const base = { ...val, [key]: next }
    // Cascade resets
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
}: HierarchicalCarSelectorProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selection, setSelection] = useState<CarSelection>(initialSelection || {})
  const [loading, setLoading] = useState(false)
  const [debug, setDebug] = useState<string | null>(null)

  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [yearModels, setYearModels] = useState<Array<{ id: number; label: string; series: string }>>([])
  const [dbRowsForYear, setDbRowsForYear] = useState<DBVariantRow[]>([])
  const [availableChassis, setAvailableChassis] = useState<
    Array<{ chassis: string; body: string; drivetrain: string | null }>
  >([])
  const [availableEngines, setAvailableEngines] = useState<Array<{ code: string; name?: string | null }>>([])
  const [availableTransmissions, setAvailableTransmissions] = useState<TransmissionRow[]>([])

  // Refs to avoid stale state immediately after setState
  const selectedYearRef = useRef<number | undefined>(initialSelection?.year)
  const selectedModelRef = useRef<string | undefined>(initialSelection?.modelName)

  // Load production years
  useEffect(() => {
    async function loadYears() {
      const now = new Date().getFullYear()
      const fallback = Array.from({ length: 55 }, (_, i) => now - i)
      setAvailableYears(fallback)

      try {
        if (!isSupabaseConfigured) return
        setLoading(true)
        const { data, error } = await supabase.from("bmw_production_years").select("year").order("year", {
          ascending: false,
        })
        if (error) throw error
        const years = (data || []).map((r: { year: number }) => r.year)
        if (years.length > 0) setAvailableYears(years)
      } catch (e: any) {
        setDebug(`Years fallback: ${e?.message || String(e)}`)
      } finally {
        setLoading(false)
      }
    }
    loadYears()
  }, [])

  // Helper: enrich DB rows with chassis + engine
  async function enrichDbRows(rows: DBVariantRow[]): Promise<DBVariantRow[]> {
    if (!isSupabaseConfigured || rows.length === 0) return rows

    const chassisIds = Array.from(new Set(rows.map((r) => r.chassis_id).filter(Boolean))) as number[]
    const engineIds = Array.from(new Set(rows.map((r) => r.engine_id).filter(Boolean))) as number[]

    const chassisMap = new Map<number, { chassis_code: string; chassis_name: string }>()
    const engineMap = new Map<number, { engine_code: string; engine_name: string | null }>()

    try {
      if (chassisIds.length > 0) {
        const { data: cData } = await supabase
          .from("bmw_chassis")
          .select("id, chassis_code, chassis_name")
          .in("id", chassisIds)
        ;(cData || []).forEach((c: any) => {
          chassisMap.set(c.id, { chassis_code: c.chassis_code, chassis_name: c.chassis_name })
        })
      }
      if (engineIds.length > 0) {
        const { data: eData } = await supabase
          .from("bmw_engines")
          .select("id, engine_code, engine_name")
          .in("id", engineIds)
        ;(eData || []).forEach((e: any) => {
          engineMap.set(e.id, { engine_code: e.engine_code, engine_name: e.engine_name ?? null })
        })
      }
    } catch (e: any) {
      setDebug(`Enrich error: ${e?.message || String(e)}`)
    }

    return rows.map((r) => ({
      ...r,
      chassis: r.chassis_id ? chassisMap.get(r.chassis_id) || null : null,
      engine: r.engine_id ? engineMap.get(r.engine_id) || null : null,
    }))
  }

  // Load models for a specific year
  async function loadModelsForYear(year: number) {
    selectedYearRef.current = year

    // Reset downstream
    setSelection({ year })
    setCurrentStep(2)
    setAvailableChassis([])
    setAvailableEngines([])
    setYearModels([])
    setDbRowsForYear([])

    // DB first
    try {
      if (isSupabaseConfigured) {
        setLoading(true)
        const { data, error } = await supabase
          .from("bmw_model_variants")
          .select(
            "id, model_name, marketing_name, body_type, drivetrain, production_start, production_end, chassis_id, engine_id",
          )
          .lte("production_start", year)
          .or(`production_end.is.null,production_end.gte.${year}`)
          .order("model_name", { ascending: true })
        if (error) throw error
        const rows = await enrichDbRows((data || []) as DBVariantRow[])
        setDbRowsForYear(rows)
        const modelLabels = getUniqueModelLabelsFromDbRows(rows)
        if (modelLabels.length > 0) {
          setYearModels(modelLabels)
          return
        }
      }
    } catch (e: any) {
      setDebug(`DB models error: ${e?.message || String(e)}`)
    } finally {
      setLoading(false)
    }

    // Offline fallback
    const offline = offlineModelsForYear(year)
    setYearModels(offline)
  }

  function getUniqueModelLabelsFromDbRows(rows: DBVariantRow[]): Array<{ id: number; label: string; series: string }> {
    const set = new Map<string, { id: number; label: string; series: string }>()
    for (const r of rows) {
      const label = r.marketing_name || r.model_name
      const series = r.chassis?.chassis_name || "BMW"
      const key = `${label}::${series}`
      if (!set.has(key)) set.set(key, { id: r.id, label, series })
    }
    return Array.from(set.values()).sort((a, b) => (a.series + a.label).localeCompare(b.series + b.label))
  }

  // When a model is selected, calculate its chassis/body options for that year
  async function loadChassisForModel(modelLabel: string) {
    selectedModelRef.current = modelLabel

    setSelection((prev) => ({
      ...prev,
      modelName: modelLabel,
      chassisCode: undefined,
      bodyType: undefined,
      engineCode: undefined,
    }))
    setAvailableEngines([])
    setCurrentStep(3)

    const year = selectedYearRef.current ?? selection.year

    // From DB rows if present
    if (dbRowsForYear.length > 0) {
      const options = getChassisOptionsFromDb(modelLabel, dbRowsForYear)
      if (options.length > 0) {
        setAvailableChassis(options)
        return
      }
    }

    // Offline fallback
    if (year) {
      const fallback = offlineChassisForModelYear(modelLabel, year)
      setAvailableChassis(fallback)
    } else {
      setAvailableChassis([])
    }
  }

  function getChassisOptionsFromDb(
    modelLabel: string,
    rows: DBVariantRow[],
  ): Array<{ chassis: string; body: string; drivetrain: string | null }> {
    const set = new Map<string, { chassis: string; body: string; drivetrain: string | null }>()
    rows
      .filter((r) => (r.marketing_name || r.model_name) === modelLabel)
      .forEach((r) => {
        const chassis = r.chassis?.chassis_code || "Unknown"
        const body = r.body_type || "Body"
        const drivetrain = r.drivetrain || null
        const key = `${chassis}::${body}::${drivetrain ?? ""}`
        if (!set.has(key)) set.set(key, { chassis, body, drivetrain })
      })
    return Array.from(set.values()).sort((a, b) => (a.chassis + a.body).localeCompare(b.chassis + b.body))
  }

  // On chassis pick, compute engines available for model+year+chassis
  async function selectChassis(chassisCode: string) {
    const chassisInfo = offlineChassisByCode(chassisCode)
    const modelName = selectedModelRef.current ?? selection.modelName
    const year = selectedYearRef.current ?? selection.year

    const bodyFromOffline = year && modelName ? offlineBodyForModelYearChassis(modelName, year, chassisCode) : undefined
    const chosen = availableChassis.find((c) => c.chassis === chassisCode)
    setSelection((prev) => ({
      ...prev,
      chassisCode,
      chassisName: chassisInfo?.chassis_name || prev.chassisName,
      bodyType: chosen?.body || bodyFromOffline || prev.bodyType,
      engineCode: undefined,
    }))
    setAvailableEngines([])
    setCurrentStep(4)

    // DB path
    if (dbRowsForYear.length > 0 && modelName) {
      const engines = getEnginesFromDb(modelName, chassisCode, dbRowsForYear)
      if (engines.length > 0) {
        setAvailableEngines(engines)
        return
      }
    }

    // Offline fallback
    if (year && modelName) {
      const engines = offlineEnginesForModelYearChassis(modelName, year, chassisCode)
      setAvailableEngines(engines)
    }
  }

  function getEnginesFromDb(
    modelLabel: string,
    chassisCode: string,
    rows: DBVariantRow[],
  ): Array<{ code: string; name?: string | null }> {
    const map = new Map<string, { code: string; name?: string | null }>()
    rows
      .filter((r) => (r.marketing_name || r.model_name) === modelLabel && r.chassis?.chassis_code === chassisCode)
      .forEach((r) => {
        if (r.engine?.engine_code) {
          map.set(r.engine.engine_code, { code: r.engine.engine_code, name: r.engine.engine_name ?? null })
        }
      })
    return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code))
  }

  const handleEngine = (engineCode: string) => {
    const eng = availableEngines.find((e) => e.code === engineCode)
    setSelection((prev) => ({ ...prev, engineCode, engineName: eng?.name || prev.engineName }))
    setCurrentStep(5)
  }

  // Load transmissions (best-effort)
  useEffect(() => {
    async function loadTransmissions() {
      try {
        if (!selection.engineCode && !selection.modelName) return
        if (!isSupabaseConfigured) {
          // Mock when DB is not available
          setAvailableTransmissions([
            {
              transmission_code: "ZF8HP",
              transmission_name: "ZF 8HP Automatic",
              transmission_type: "Automatic",
              gear_count: 8,
              manufacturer: "ZF",
            },
            {
              transmission_code: "GS6",
              transmission_name: "GS6 Manual",
              transmission_type: "Manual",
              gear_count: 6,
              manufacturer: "Getrag",
            },
          ])
          return
        }
        const { data, error } = await supabase
          .from("bmw_transmissions")
          .select("*")
          .order("transmission_name", { ascending: true })
        if (error) throw error
        setAvailableTransmissions((data || []) as TransmissionRow[])
      } catch (e: any) {
        setAvailableTransmissions([])
        setDebug(`Transmissions load error: ${e?.message || String(e)}`)
      }
    }
    loadTransmissions()
  }, [selection.engineCode, selection.modelName])

  const handleTransmission = (transmissionCode: string) => {
    const t = availableTransmissions.find((tr) => tr.transmission_code === transmissionCode)
    setSelection((prev) => ({ ...prev, transmissionCode, transmissionName: t?.transmission_name }))
    setCurrentStep(6)
  }

  const handleBuildDate = (value: string) => {
    setSelection((prev) => ({ ...prev, buildDate: value }))
  }

  const finish = () => onSelectionComplete(selection)

  const reset = () => {
    setSelection({})
    selectedYearRef.current = undefined
    selectedModelRef.current = undefined
    setYearModels([])
    setAvailableChassis([])
    setAvailableEngines([])
    setAvailableTransmissions([])
    setCurrentStep(1)
    setDebug(null)
  }

  const steps = useMemo(
    () => [
      { number: 1, title: "Year", icon: Calendar, description: "Production year" },
      { number: 2, title: "Model", icon: Car, description: "Offered that year" },
      { number: 3, title: "Chassis", icon: Cog, description: "Pick exact chassis/body" },
      { number: 4, title: "Engine", icon: Zap, description: "Engine code" },
      { number: 5, title: "Transmission", icon: Settings, description: "Gearbox" },
      { number: 6, title: "Build Date", icon: Factory, description: "Optional month/year" },
    ],
    [],
  )

  const getStepStatus = (step: number) => {
    if (step < currentStep) return "completed"
    if (step === currentStep) return "current"
    return "pending"
  }

  const renderProgress = (small = false) => (
    <div className={small ? "flex items-center space-x-2" : "flex items-center justify-between"}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={small ? "" : "flex flex-col items-center"}>
            <div
              className={`${small ? "w-8 h-8" : "w-12 h-12"} rounded-full flex items-center justify-center ${
                getStepStatus(step.number) === "completed"
                  ? "bg-green-500 text-white"
                  : getStepStatus(step.number) === "current"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {getStepStatus(step.number) === "completed" ? (
                <Check className={small ? "w-4 h-4" : "w-6 h-6"} />
              ) : (
                <step.icon className={small ? "w-4 h-4" : "w-6 h-6"} />
              )}
            </div>
            {!small && (
              <div className="mt-2 text-center">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={
                small
                  ? ""
                  : `flex-1 h-0.5 mx-4 ${getStepStatus(step.number + 1) !== "pending" ? "bg-green-500" : "bg-gray-200"}`
              }
            >
              {small && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" aria-hidden="true" />}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  // Compact UI
  if (compact) {
    return (
      <div className={["space-y-4", className].filter(Boolean).join(" ")}>
        {renderProgress(true)}
        <div className="space-y-3">
          {currentStep === 1 && (
            <Select onValueChange={(v) => loadModelsForYear(Number.parseInt(v, 10))}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {currentStep === 2 && (
            <Select onValueChange={(v) => loadChassisForModel(v)} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={selection.year ? `Models in ${selection.year}` : "Select year first"} />
              </SelectTrigger>
              <SelectContent>
                {yearModels.map((m) => (
                  <SelectItem key={`${m.series}-${m.label}`} value={m.label}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{m.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{m.series}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {currentStep === 3 && (
            <Select onValueChange={(v) => selectChassis(v)} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select chassis/body" />
              </SelectTrigger>
              <SelectContent>
                {availableChassis.map((c) => (
                  <SelectItem key={`${c.chassis}-${c.body}-${c.drivetrain ?? ""}`} value={c.chassis}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{c.chassis}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {c.body}
                        {c.drivetrain ? ` • ${c.drivetrain}` : ""}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {currentStep === 4 && (
            <Select onValueChange={handleEngine} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select engine code" />
              </SelectTrigger>
              <SelectContent>
                {availableEngines.map((e) => (
                  <SelectItem key={e.code} value={e.code}>
                    <div className="flex flex-col">
                      <span className="font-medium">{e.code}</span>
                      {e.name && <span className="text-xs text-gray-500">{e.name}</span>}
                    </div>
                  </SelectItem>
                ))}
                {availableEngines.length === 0 && <div className="p-2 text-xs text-gray-500">No engines found</div>}
              </SelectContent>
            </Select>
          )}

          {currentStep === 5 && (
            <Select onValueChange={handleTransmission} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                {availableTransmissions.map((t) => (
                  <SelectItem key={t.transmission_code} value={t.transmission_code}>
                    <div className="flex flex-col">
                      <span className="font-medium">{t.transmission_name}</span>
                      <span className="text-xs text-gray-500">
                        {t.transmission_type || "Transmission"} • {t.gear_count || "?"}-Speed
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {currentStep === 6 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Build Date (optional)</label>
              <Input type="month" value={selection.buildDate || ""} onChange={(e) => handleBuildDate(e.target.value)} />
              <Button className="w-full mt-2" onClick={finish}>
                Done
              </Button>
            </div>
          )}
        </div>

        {/* Summary */}
        {selection.year && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm space-y-1">
              <div>
                <strong>Year:</strong> {selection.year}
              </div>
              {selection.modelName && (
                <div>
                  <strong>Model:</strong> {selection.modelName}
                </div>
              )}
              {selection.chassisCode && (
                <div>
                  <strong>Chassis:</strong> {selection.chassisCode}
                </div>
              )}
              {selection.bodyType && (
                <div>
                  <strong>Body:</strong> {selection.bodyType}
                </div>
              )}
              {selection.engineCode && (
                <div>
                  <strong>Engine:</strong> {selection.engineCode}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent" onClick={reset}>
            Reset
          </Button>
        </div>

        {debug && <div className="text-[11px] text-gray-500">Debug: {debug}</div>}
      </div>
    )
  }

  // Full UI
  const years = DATA.years
  const models = selection.year ? DATA.modelsByYear[selection.year.toString()] || [] : []
  const current = selection.year && selection.modelName ? DATA.modelsByYear[selection.year.toString()] : null

  function emit(next: Partial<CarSelection>) {
    const sel: CarSelection = {
      year: next.year ?? selection.year,
      modelId: next.modelId ?? selection.modelId,
      modelName: next.modelName ?? selection.modelName,
      chassisCode: next.chassisCode ?? selection.chassisCode,
      chassisName: next.chassisName ?? selection.chassisName,
      bodyType: next.bodyType ?? selection.bodyType,
      engineCode: next.engineCode ?? selection.engineCode,
      engineName: next.engineName ?? selection.engineName,
      transmissionCode: next.transmissionCode ?? selection.transmissionCode,
      transmissionName: next.transmissionName ?? selection.transmissionName,
      buildDate: next.buildDate ?? selection.buildDate,
    }
    onSelectionComplete(sel)
  }

  return (
    <Card className={["w-full", className].filter(Boolean).join(" ")}>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            BMW Vehicle Selection
          </CardTitle>
          <CardDescription>Year → Model → Chassis/Body → Engine → Transmission → Build</CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {renderProgress(false)}

        <Separator />

        <div className="min-h-[220px] space-y-4">
          {currentStep === 1 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Production Year</label>
              <Select
                onValueChange={(v) => {
                  const y = Number.parseInt(v, 10)
                  setSelection({ year: y })
                  emit({ year: y })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Models offered in {selection.year}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {models.map((m) => (
                  <Card
                    key={m}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelection({ modelName: m })
                      emit({ modelName: m })
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-1">
                        <div className="font-semibold">{m}</div>
                        <div className="text-xs text-gray-600">BMW</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {models.length === 0 && <div className="text-sm text-gray-500">No models found for this year.</div>}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Chassis & Body</label>
              <input
                className="border rounded-md p-2 bg-gray-50"
                value={current?.includes(selection.modelName || "") ? selection.modelName : ""}
                readOnly
                placeholder="-"
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Engine Code</label>
              <input
                className="border rounded-md p-2 bg-gray-50"
                value={current?.includes(selection.modelName || "") ? selection.modelName : ""}
                readOnly
                placeholder="-"
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Transmission</label>
              <Select
                onValueChange={(v) => {
                  setSelection({ transmissionCode: v })
                  emit({ transmissionCode: v })
                }}
                disabled={!current}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {current?.includes(selection.modelName || "") ? (
                    <SelectItem key={selection.modelName} value={selection.modelName}>
                      {selection.modelName}
                    </SelectItem>
                  ) : (
                    <div className="p-2 text-xs text-gray-500">No transmissions found</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Build Date (optional)</label>
              <Input type="month" value={selection.buildDate || ""} onChange={(e) => handleBuildDate(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={finish}>Finish</Button>
                <Button variant="outline" className="bg-transparent" onClick={() => setCurrentStep(5)}>
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {selection.year && (
          <>
            <Separator />
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Current Selection</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Year</div>
                  <div className="font-medium">{selection.year}</div>
                </div>
                {selection.modelName && (
                  <div>
                    <div className="text-gray-500">Model</div>
                    <div className="font-medium">{selection.modelName}</div>
                  </div>
                )}
                {selection.chassisCode && (
                  <div>
                    <div className="text-gray-500">Chassis</div>
                    <div className="font-medium">{selection.chassisCode}</div>
                  </div>
                )}
                {selection.bodyType && (
                  <div>
                    <div className="text-gray-500">Body</div>
                    <div className="font-medium">{selection.bodyType}</div>
                  </div>
                )}
                {selection.engineCode && (
                  <div>
                    <div className="text-gray-500">Engine</div>
                    <div className="font-medium">{selection.engineCode}</div>
                  </div>
                )}
                {selection.transmissionCode && (
                  <div>
                    <div className="text-gray-500">Trans</div>
                    <div className="font-medium">{selection.transmissionCode}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
          {currentStep > 1 && (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
              Previous Step
            </Button>
          )}
        </div>
        {debug && <div className="text-[11px] text-gray-500">Debug: {debug}</div>}
      </CardContent>
    </Card>
  )
}

// Keep named export compatibility and add default export to satisfy importer expecting default.
export default HierarchicalCarSelector
