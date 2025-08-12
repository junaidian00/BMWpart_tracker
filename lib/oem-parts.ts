export interface BMWOEMPart {
  id: string
  part_number: string
  part_name: string
  description: string | null
  price_msrp: number | null
  is_discontinued: boolean
  superseded_by: string | null

  category_name?: string | null
  category_code?: string | null

  compatible_chassis?: string[]
  compatible_engines?: string[]
  compatible_body_types?: string[]
  earliest_year?: number | null
  latest_year?: number | null

  category?: {
    category_name: string
    category_code: string
  }
}

export interface BMWModel {
  id: string
  model_name: string
  chassis_code: string
  production_start: number
  production_end: number | null
  series_name: string
}

export interface BMWPartCategory {
  id: string
  category_name: string
  category_code: string
  description: string | null
}

export interface BMWChassis {
  id: string
  chassis_code: string
  chassis_name: string
  production_start: number
  production_end: number | null
}

export interface BMWEngine {
  id: string
  engine_code: string
  engine_name: string
  displacement: number | null
  fuel_type: string | null
}

export interface SearchOEMPartsParams {
  query?: string
  partNumber?: string
  categoryCode?: string
  chassisCode?: string
  seriesCode?: string
  engineCode?: string
  bodyType?: string
  includeDiscontinued?: boolean
  limit?: number
  offset?: number
}

export type SearchFilters = SearchOEMPartsParams

const INSTANT_OEM_PARTS: BMWOEMPart[] = [
  {
    id: "1",
    part_number: "11427566327",
    part_name: "Oil Filter",
    description: "Engine oil filter for BMW vehicles",
    price_msrp: 15.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Engine Components",
    category_code: "ENGINE",
    compatible_chassis: [
      "G20",
      "F30",
      "G22",
      "F32",
      "G30",
      "F10",
      "G80",
      "F80",
      "G82",
      "F82",
      "F90",
      "G01",
      "F25",
      "G05",
      "F15",
    ],
    compatible_engines: ["B48", "B58", "N55", "S55", "S58"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon", "SUV"],
    earliest_year: 2015,
    latest_year: 2024,
  },
  {
    id: "2",
    part_number: "34116794300",
    part_name: "Brake Pad Set Front",
    description: "Front brake pad set for BMW vehicles",
    price_msrp: 89.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Brake System",
    category_code: "BRAKES",
    compatible_chassis: ["G20", "F30", "G22", "F32", "G30", "F10"],
    compatible_engines: ["B48", "B58", "N55"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon"],
    earliest_year: 2015,
    latest_year: 2024,
  },
  {
    id: "3",
    part_number: "31336752735",
    part_name: "Front Shock Absorber",
    description: "Front shock absorber for BMW vehicles",
    price_msrp: 245.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Suspension & Steering",
    category_code: "SUSPENSION",
    compatible_chassis: ["G20", "F30", "G22", "F32"],
    compatible_engines: ["B48", "B58", "N55"],
    compatible_body_types: ["Sedan", "Coupe"],
    earliest_year: 2015,
    latest_year: 2024,
  },
  {
    id: "4",
    part_number: "17117570261",
    part_name: "Radiator",
    description: "Engine cooling radiator for BMW vehicles",
    price_msrp: 389.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Cooling System",
    category_code: "COOLING",
    compatible_chassis: ["G20", "F30", "G30", "F10"],
    compatible_engines: ["B48", "B58", "N55"],
    compatible_body_types: ["Sedan", "Wagon"],
    earliest_year: 2015,
    latest_year: 2024,
  },
  {
    id: "5",
    part_number: "51117237045",
    part_name: "Front Bumper Cover",
    description: "Front bumper cover for BMW vehicles",
    price_msrp: 599.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Exterior Parts",
    category_code: "EXTERIOR",
    compatible_chassis: ["G20", "F30", "G22", "F32"],
    compatible_engines: ["B48", "B58", "N55"],
    compatible_body_types: ["Sedan", "Coupe"],
    earliest_year: 2015,
    latest_year: 2024,
  },
]

export async function searchOEMParts(params: SearchOEMPartsParams): Promise<BMWOEMPart[]> {
  // Return instant results without any database queries or complex filtering
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...INSTANT_OEM_PARTS]

      // Simple filtering
      if (params.query) {
        const q = params.query.toLowerCase()
        results = results.filter(
          (part) =>
            part.part_name.toLowerCase().includes(q) ||
            part.part_number.toLowerCase().includes(q) ||
            (part.description && part.description.toLowerCase().includes(q)),
        )
      }

      if (params.chassisCode) {
        results = results.filter((part) => part.compatible_chassis?.includes(params.chassisCode!))
      }

      if (params.engineCode) {
        results = results.filter((part) => part.compatible_engines?.includes(params.engineCode!))
      }

      if (params.categoryCode) {
        results = results.filter((part) => part.category_code === params.categoryCode)
      }

      resolve(results.slice(0, params.limit || 50))
    }, 100) // Minimal delay to show it's working
  })
}

export async function getPartByNumber(partNumber: string): Promise<BMWOEMPart | null> {
  const part = INSTANT_OEM_PARTS.find((p) => p.part_number === partNumber)
  return part || null
}

export async function getBMWModels(): Promise<BMWModel[]> {
  return [
    {
      id: "1",
      model_name: "3 Series",
      chassis_code: "G20",
      production_start: 2019,
      production_end: null,
      series_name: "G20 3 Series",
    },
    {
      id: "2",
      model_name: "4 Series",
      chassis_code: "G22",
      production_start: 2021,
      production_end: null,
      series_name: "G22 4 Series",
    },
    {
      id: "3",
      model_name: "5 Series",
      chassis_code: "G30",
      production_start: 2017,
      production_end: null,
      series_name: "G30 5 Series",
    },
    {
      id: "4",
      model_name: "M3",
      chassis_code: "G80",
      production_start: 2021,
      production_end: null,
      series_name: "G80 M3",
    },
    {
      id: "5",
      model_name: "M4",
      chassis_code: "G82",
      production_start: 2021,
      production_end: null,
      series_name: "G82 M4",
    },
  ]
}

export async function getPartCategories(): Promise<BMWPartCategory[]> {
  return [
    { id: "ENGINE", category_name: "Engine Components", category_code: "ENGINE", description: "Engine components" },
    { id: "BRAKES", category_name: "Brake System", category_code: "BRAKES", description: "Brake system parts" },
    {
      id: "SUSPENSION",
      category_name: "Suspension & Steering",
      category_code: "SUSPENSION",
      description: "Suspension parts",
    },
    { id: "COOLING", category_name: "Cooling System", category_code: "COOLING", description: "Cooling system parts" },
    { id: "EXTERIOR", category_name: "Exterior Parts", category_code: "EXTERIOR", description: "Exterior parts" },
  ]
}

export async function getBMWChassis(): Promise<BMWChassis[]> {
  return [
    { id: "1", chassis_code: "G20", chassis_name: "G20 3 Series", production_start: 2019, production_end: null },
    { id: "2", chassis_code: "G22", chassis_name: "G22 4 Series", production_start: 2021, production_end: null },
    { id: "3", chassis_code: "G30", chassis_name: "G30 5 Series", production_start: 2017, production_end: null },
    { id: "4", chassis_code: "G80", chassis_name: "G80 M3", production_start: 2021, production_end: null },
    { id: "5", chassis_code: "G82", chassis_name: "G82 M4", production_start: 2021, production_end: null },
  ]
}

export async function getBMWEngines(): Promise<BMWEngine[]> {
  return [
    { id: "1", engine_code: "B48", engine_name: "B48 2.0L Turbo", displacement: 2.0, fuel_type: "Gasoline" },
    { id: "2", engine_code: "B58", engine_name: "B58 3.0L Turbo", displacement: 3.0, fuel_type: "Gasoline" },
    { id: "3", engine_code: "S55", engine_name: "S55 3.0L Twin Turbo", displacement: 3.0, fuel_type: "Gasoline" },
    { id: "4", engine_code: "S58", engine_name: "S58 3.0L Twin Turbo", displacement: 3.0, fuel_type: "Gasoline" },
  ]
}

export type VehiclePartFilters = {
  chassisCode?: string
  seriesCode?: string
  engineCode?: string
  bodyType?: string
  categoryCode?: string
  query?: string
  includeDiscontinued?: boolean
  limit?: number
  offset?: number
}

export async function getVehicleSpecificParts(filters: VehiclePartFilters): Promise<BMWOEMPart[]> {
  return searchOEMParts({
    query: filters.query,
    categoryCode: filters.categoryCode,
    chassisCode: filters.chassisCode,
    seriesCode: filters.seriesCode,
    engineCode: filters.engineCode,
    bodyType: filters.bodyType,
    includeDiscontinued: filters.includeDiscontinued,
    limit: filters.limit,
    offset: filters.offset,
  })
}
