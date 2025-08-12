import { supabase } from "./supabase"
import type { Vehicle } from "./maintenance"
import type { BMWOEMPart } from "./oem-parts"

// Enhanced vehicle-specific parts lookup
export async function getVehicleSpecificParts(
  vehicle: Vehicle,
  category?: string,
  searchQuery?: string,
): Promise<BMWOEMPart[]> {
  // Map vehicle to series code
  const seriesCode = mapVehicleToSeriesCode(vehicle)

  let query = supabase.from("bmw_oem_parts").select(`
      *,
      category:bmw_part_categories(*),
      compatibility:bmw_part_compatibility(
        *,
        model:bmw_models(*)
      )
    `)

  // Filter by compatibility with the specific vehicle
  if (seriesCode) {
    query = query.eq("compatibility.model.series_code", seriesCode)
  }

  // Filter by category if specified
  if (category && category !== "all") {
    query = query.eq("category.category_code", category)
  }

  // Text search if specified
  if (searchQuery) {
    query = query.or(`part_name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  }

  // Filter by production year
  query = query
    .gte("compatibility.production_start", vehicle.year - 2)
    .lte("compatibility.production_end", vehicle.year + 2)

  const { data, error } = await query.order("part_name").limit(100)

  if (error) {
    console.error("Vehicle parts lookup error:", error)
    throw error
  }

  return data || []
}

// Get maintenance-specific parts for a vehicle
export async function getMaintenanceParts(vehicle: Vehicle): Promise<{
  oilChange: BMWOEMPart[]
  brakes: BMWOEMPart[]
  filters: BMWOEMPart[]
  ignition: BMWOEMPart[]
}> {
  const [oilChange, brakes, filters, ignition] = await Promise.all([
    getVehicleSpecificParts(vehicle, "ENGINE", "oil filter"),
    getVehicleSpecificParts(vehicle, "BRAKES", "brake pad"),
    getVehicleSpecificParts(vehicle, "ENGINE", "air filter"),
    getVehicleSpecificParts(vehicle, "ELECTRICAL", "spark plug"),
  ])

  return { oilChange, brakes, filters, ignition }
}

// Get performance parts for a vehicle
export async function getPerformanceParts(vehicle: Vehicle): Promise<{
  intake: BMWOEMPart[]
  exhaust: BMWOEMPart[]
  suspension: BMWOEMPart[]
  braking: BMWOEMPart[]
}> {
  const [intake, exhaust, suspension, braking] = await Promise.all([
    getVehicleSpecificParts(vehicle, "ENGINE", "intake"),
    getVehicleSpecificParts(vehicle, "EXHAUST"),
    getVehicleSpecificParts(vehicle, "SUSPENSION"),
    getVehicleSpecificParts(vehicle, "BRAKES", "performance"),
  ])

  return { intake, exhaust, suspension, braking }
}

// Map vehicle model/year to BMW series code
function mapVehicleToSeriesCode(vehicle: Vehicle): string | null {
  const { model, year } = vehicle

  // Comprehensive mapping based on model and year
  const mappings: Record<string, (year: number) => string | null> = {
    "335i": (year) => {
      if (year <= 2012) return "E90"
      if (year <= 2015) return "F30"
      return null
    },
    "328i": (year) => {
      if (year <= 2012) return "E90"
      if (year <= 2019) return "F30"
      return null
    },
    "330i": (year) => {
      if (year <= 2006) return "E46"
      if (year >= 2019) return "G20"
      return "F30"
    },
    M3: (year) => {
      if (year <= 2013) return "E90"
      if (year <= 2018) return "F80"
      return "G80"
    },
    "435i": () => "F32",
    M4: (year) => (year <= 2020 ? "F82" : "G82"),
    "228i": () => "F22",
    "230i": (year) => (year <= 2021 ? "F22" : "G42"),
    "235i": () => "F22",
    M235i: () => "F22",
    "240i": (year) => (year <= 2021 ? "F22" : "G42"),
    M240i: (year) => (year <= 2021 ? "F22" : "G42"),
    M2: (year) => {
      if (year <= 2020) return "F87"
      return "G87"
    },
    "220i": (year) => {
      if (year <= 2021) return "F22"
      return "G42"
    },
    "218i": (year) => {
      if (year <= 2021) return "F45" // Active Tourer
      return "U06"
    },
  }

  const mapper = mappings[model]
  return mapper ? mapper(year) : null
}

// Get parts by diagram section (like RealOEM)
export async function getPartsByDiagramSection(vehicle: Vehicle, section: string): Promise<BMWOEMPart[]> {
  const seriesCode = mapVehicleToSeriesCode(vehicle)

  if (!seriesCode) return []

  const { data, error } = await supabase
    .from("bmw_oem_parts")
    .select(`
      *,
      category:bmw_part_categories(*),
      compatibility:bmw_part_compatibility(
        *,
        model:bmw_models(*)
      )
    `)
    .eq("category.diagram_section", section)
    .eq("compatibility.model.series_code", seriesCode)
    .gte("compatibility.production_start", vehicle.year - 1)
    .lte("compatibility.production_end", vehicle.year + 1)
    .order("diagram_position")

  if (error) {
    console.error("Diagram section lookup error:", error)
    throw error
  }

  return data || []
}

// Create a parts shopping list for maintenance
export async function createMaintenanceShoppingList(vehicle: Vehicle, maintenanceType: string): Promise<BMWOEMPart[]> {
  const maintenanceItems: Record<string, string[]> = {
    oil_change: ["oil filter", "drain plug", "oil"],
    brake_service: ["brake pad", "brake rotor", "brake fluid"],
    air_filter: ["air filter", "cabin filter"],
    spark_plugs: ["spark plug", "ignition coil"],
    coolant_flush: ["coolant", "thermostat", "radiator cap"],
    transmission_service: ["transmission fluid", "transmission filter"],
  }

  const items = maintenanceItems[maintenanceType] || []
  const parts: BMWOEMPart[] = []

  for (const item of items) {
    const itemParts = await getVehicleSpecificParts(vehicle, undefined, item)
    parts.push(...itemParts.slice(0, 3)) // Limit to top 3 results per item
  }

  return parts
}

export type { BMWOEMPart } from "./oem-parts"
