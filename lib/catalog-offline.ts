// Normalized offline BMW catalog with precise Year -> Model -> Chassis -> Engine mapping.
// This enables a fully functional selector even when your DB is empty.
// Note: This covers the most common BMW models and generations with correct engine splits
// (e.g., 35i vs 40i mapped to N55 vs B58) and is structured to be extended easily.

export type EngineSpec = { code: string; name?: string | null }
export type Entry = {
  from: number
  to: number | null
  chassis: string
  body: string
  drivetrain?: string | null
  engines: EngineSpec[]
}

export type Variant = {
  id: number
  model_name: string // e.g., 335i, 340i, 230i, M240i
  marketing_name?: string | null // e.g., BMW 335i
  series: string // e.g., 3 Series
  entries: Entry[]
}

function v(id: number, model_name: string, series: string, entries: Entry[], marketing_name?: string | null): Variant {
  return { id, model_name, series, entries, marketing_name: marketing_name ?? null }
}

function e(from: number, to: number | null, chassis: string, body: string, engines: EngineSpec[], drivetrain?: string) {
  return { from, to, chassis, body, engines, drivetrain: drivetrain ?? null }
}

// Engines quick helpers
const N20 = { code: "N20", name: "N20 2.0T" }
const N26 = { code: "N26", name: "N26 SULEV 2.0T" }
const B48 = { code: "B48", name: "B48 2.0T" }
const N55 = { code: "N55", name: "N55 3.0T" }
const B58 = { code: "B58", name: "B58 3.0T" }
const S55 = { code: "S55", name: "S55 3.0TT" }
const S58 = { code: "S58", name: "S58 3.0TT" }
const N63 = { code: "N63", name: "N63 4.4TT V8" }
const B58PHEV = { code: "B48H", name: "B48 PHEV" }
const N52 = { code: "N52", name: "N52 3.0 N/A" }
const M54B30 = { code: "M54B30", name: "M54 3.0" }
const S65 = { code: "S65", name: "S65 4.0 V8" }
const S54 = { code: "S54", name: "S54 3.2" }
const M20B25 = { code: "M20B25", name: "M20 2.5" }
const S14 = { code: "S14", name: "S14 2.3" }
const N54 = { code: "N54", name: "N54 3.2" } // Added N54 variable

// Catalog
const VARIANTS: Variant[] = [
  // 2 Series (F22/F23/G42)
  v(2001, "228i", "2 Series", [e(2014, 2016, "F22", "Coupe", [N20]), e(2015, 2016, "F23", "Convertible", [N20])]),
  v(2002, "230i", "2 Series", [e(2017, 2021, "F22", "Coupe", [B48]), e(2017, 2021, "F23", "Convertible", [B48])]),
  v(2003, "M235i", "2 Series", [e(2014, 2016, "F22", "Coupe", [N55]), e(2015, 2016, "F23", "Convertible", [N55])]),
  v(2004, "M240i", "2 Series", [e(2017, 2021, "F22", "Coupe", [B58]), e(2017, 2021, "F23", "Convertible", [B58])]),
  v(2005, "230i", "2 Series", [e(2022, null, "G42", "Coupe", [B48])], "230i"),
  v(2006, "M240i", "2 Series", [e(2022, null, "G42", "Coupe", [B58])], "M240i"),

  // 3 Series (E46/E90/F30/G20)
  v(3001, "330i", "3 Series", [
    e(2000, 2005, "E46", "Sedan", [M54B30]),
    e(2016, 2019, "F30", "Sedan", [B48]),
    e(2019, null, "G20", "Sedan", [B48]),
  ]),
  v(3002, "335i", "3 Series", [e(2006, 2011, "E90", "Sedan", [N54, N55]), e(2012, 2015, "F30", "Sedan", [N55])]),
  v(3003, "340i", "3 Series", [e(2016, 2019, "F30", "Sedan", [B58]), e(2019, null, "G20", "Sedan", [B58])]),
  v(3004, "320i", "3 Series", [e(2012, 2015, "F30", "Sedan", [N20, N26]), e(2016, 2018, "F30", "Sedan", [B48])]),
  v(3005, "M3", "3 Series", [
    e(2008, 2013, "E90", "Sedan", [S65]),
    e(2014, 2020, "F80", "Sedan", [S55]),
    e(2021, null, "G80", "Sedan", [S58]),
  ]),

  // 4 Series (F32/F33/F36/G22/G23/G26)
  v(4001, "428i", "4 Series", [
    e(2013, 2016, "F32", "Coupe", [N20]),
    e(2014, 2016, "F33", "Convertible", [N20]),
    e(2014, 2016, "F36", "Gran Coupe", [N20]),
  ]),
  v(4002, "430i", "4 Series", [
    e(2016, 2020, "F32", "Coupe", [B48]),
    e(2016, 2020, "F33", "Convertible", [B48]),
    e(2016, 2020, "F36", "Gran Coupe", [B48]),
    e(2021, null, "G22", "Coupe", [B48]),
    e(2021, null, "G23", "Convertible", [B48]),
    e(2021, null, "G26", "Gran Coupe", [B48]),
  ]),
  v(4003, "435i", "4 Series", [
    e(2013, 2016, "F32", "Coupe", [N55]),
    e(2014, 2016, "F33", "Convertible", [N55]),
    e(2014, 2016, "F36", "Gran Coupe", [N55]),
  ]),
  v(4004, "440i", "4 Series", [
    e(2016, 2020, "F32", "Coupe", [B58]),
    e(2016, 2020, "F33", "Convertible", [B58]),
    e(2016, 2020, "F36", "Gran Coupe", [B58]),
  ]),

  // 5 Series (E60/F10/G30)
  v(5001, "528i", "5 Series", [e(2011, 2016, "F10", "Sedan", [N20])]),
  v(5002, "535i", "5 Series", [e(2011, 2016, "F10", "Sedan", [N55])]),
  v(5003, "540i", "5 Series", [e(2016, 2017, "F10", "Sedan", [B58]), e(2017, null, "G30", "Sedan", [B58])]),

  // 7 Series (F01/G11/G70)
  v(7001, "740i", "7 Series", [
    e(2011, 2015, "F01", "Sedan", [N55]),
    e(2016, 2022, "G11", "Sedan", [B58]),
    e(2022, null, "G70", "Sedan", [B58]),
  ]),
  v(7002, "750i", "7 Series", [e(2009, 2015, "F01", "Sedan", [N63]), e(2016, 2022, "G11", "Sedan", [N63])]),

  // X3 (E83/F25/G01)
  v(8001, "xDrive28i", "X3", [e(2012, 2017, "F25", "SUV", [N20])]),
  v(8002, "xDrive35i", "X3", [e(2011, 2017, "F25", "SUV", [N55])]),
  v(8003, "xDrive30i", "X3", [e(2018, null, "G01", "SUV", [B48])]),
  v(8004, "M40i", "X3", [e(2018, null, "G01", "SUV", [B58])]),

  // X5 (E70/F15/G05)
  v(9001, "xDrive35i", "X5", [e(2014, 2018, "F15", "SUV", [N55])]),
  v(9002, "xDrive40e", "X5", [e(2016, 2018, "F15", "SUV", [B58PHEV])]),
  v(9003, "xDrive50i", "X5", [e(2014, 2018, "F15", "SUV", [N63])]),
  v(9004, "xDrive40i", "X5", [e(2019, null, "G05", "SUV", [B58])]),
  v(9005, "M50i", "X5", [e(2020, null, "G05", "SUV", [N63])]),
]

// Utility functions

export function offlineModelsForYear(year: number): { id: number; label: string; series: string }[] {
  // Return unique model labels available in that year, e.g., 335i, 340i, 330i, etc.
  const list = VARIANTS.filter((v) => v.entries.some((en) => en.from <= year && (en.to == null || en.to >= year)))
  // De-dupe by model_name (we keep multiple variants under same model in later steps)
  const seen = new Set<string>()
  const out: { id: number; label: string; series: string }[] = []
  list.forEach((v) => {
    const key = `${v.model_name}::${v.series}`
    if (seen.has(key)) return
    seen.add(key)
    out.push({ id: v.id, label: v.model_name, series: v.series })
  })
  // Sort by series then label
  out.sort((a, b) => (a.series + a.label).localeCompare(b.series + b.label))
  return out
}

export function offlineChassisForModelYear(
  modelLabel: string,
  year: number,
): Array<{
  chassis: string
  body: string
  drivetrain: string | null
}> {
  const combos = VARIANTS.flatMap((v) =>
    v.model_name === modelLabel
      ? v.entries
          .filter((en) => en.from <= year && (en.to == null || en.to >= year))
          .map((en) => ({ chassis: en.chassis, body: en.body, drivetrain: en.drivetrain ?? null }))
      : [],
  )
  const set = new Set<string>()
  const out: Array<{ chassis: string; body: string; drivetrain: string | null }> = []
  combos.forEach((c) => {
    const k = `${c.chassis}::${c.body}::${c.drivetrain ?? ""}`
    if (set.has(k)) return
    set.add(k)
    out.push(c)
  })
  // Sort by chassis then body
  out.sort((a, b) => (a.chassis + a.body).localeCompare(b.chassis + b.body))
  return out
}

export function offlineEnginesForModelYearChassis(modelLabel: string, year: number, chassis: string): EngineSpec[] {
  const engines = VARIANTS.flatMap((v) =>
    v.model_name === modelLabel
      ? v.entries
          .filter((en) => en.chassis === chassis && en.from <= year && (en.to == null || en.to >= year))
          .flatMap((en) => en.engines)
      : [],
  )
  // De-dupe by code
  const map = new Map<string, EngineSpec>()
  engines.forEach((e) => map.set(e.code, e))
  return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code))
}

export function offlineBodyForModelYearChassis(modelLabel: string, year: number, chassis: string): string | undefined {
  const entry = VARIANTS.find((v) =>
    v.model_name === modelLabel
      ? v.entries.some((en) => en.chassis === chassis && en.from <= year && (en.to == null || en.to >= year))
      : false,
  )
  if (!entry) return undefined
  const e = entry.entries.find((en) => en.chassis === chassis && en.from <= year && (en.to == null || en.to >= year))
  return e?.body
}

export function offlineChassisByCode(code: string): { chassis_code: string; chassis_name: string } | undefined {
  // Simple mapping of code to readable name; extend as needed
  const map: Record<string, string> = {
    E46: "3 Series",
    E90: "3 Series",
    F30: "3 Series",
    G20: "3 Series",
    F22: "2 Series",
    F23: "2 Series",
    G42: "2 Series",
    F32: "4 Series",
    F33: "4 Series",
    F36: "4 Series",
    G22: "4 Series",
    G23: "4 Series",
    G26: "4 Series",
    F10: "5 Series",
    G30: "5 Series",
    F01: "7 Series",
    G11: "7 Series",
    G70: "7 Series",
    F25: "X3",
    G01: "X3",
    F15: "X5",
    G05: "X5",
    F80: "M3",
    G80: "M3",
  }
  const name = map[code]
  if (!name) return undefined
  return { chassis_code: code, chassis_name: name }
}
