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
  // Engine Components
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
      "E90",
      "E92",
      "E60",
      "F20",
      "F22",
    ],
    compatible_engines: ["B48", "B58", "N55", "S55", "S58", "N54", "N52", "M54", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon", "SUV", "Hatchback"],
    earliest_year: 2005,
    latest_year: 2024,
  },
  {
    id: "2",
    part_number: "11427837997",
    part_name: "Air Filter",
    description: "Engine air filter for BMW vehicles",
    price_msrp: 24.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Engine Components",
    category_code: "ENGINE",
    compatible_chassis: ["G20", "F30", "G22", "F32", "G30", "F10", "F20", "F22", "E90", "E92"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon", "Hatchback"],
    earliest_year: 2005,
    latest_year: 2024,
  },
  {
    id: "3",
    part_number: "11517586925",
    part_name: "Spark Plugs (Set of 4)",
    description: "Spark plug set for 4-cylinder BMW engines",
    price_msrp: 45.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Engine Components",
    category_code: "ENGINE",
    compatible_chassis: ["G20", "F30", "F20", "F22", "E90"],
    compatible_engines: ["B48", "N20", "N52"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon", "Hatchback"],
    earliest_year: 2005,
    latest_year: 2024,
  },
  {
    id: "4",
    part_number: "11517586926",
    part_name: "Spark Plugs (Set of 6)",
    description: "Spark plug set for 6-cylinder BMW engines",
    price_msrp: 68.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Engine Components",
    category_code: "ENGINE",
    compatible_chassis: ["G20", "F30", "G22", "F32", "G30", "F10", "G80", "F80", "G82", "F82", "E90", "E92", "E60"],
    compatible_engines: ["B58", "N55", "S55", "S58", "N54", "M54"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon"],
    earliest_year: 2005,
    latest_year: 2024,
  },

  // Brake System
  {
    id: "5",
    part_number: "34116794300",
    part_name: "Brake Pad Set Front",
    description: "Front brake pad set for BMW vehicles",
    price_msrp: 89.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Brake System",
    category_code: "BRAKES",
    compatible_chassis: ["G20", "F30", "G22", "F32", "G30", "F10", "F20", "F22", "E90", "E92"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon", "Hatchback"],
    earliest_year: 2005,
    latest_year: 2024,
  },
  {
    id: "6",
    part_number: "34216794301",
    part_name: "Brake Pad Set Rear",
    description: "Rear brake pad set for BMW vehicles",
    price_msrp: 79.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Brake System",
    category_code: "BRAKES",
    compatible_chassis: ["G20", "F30", "G22", "F32", "G30", "F10", "F20", "F22", "E90", "E92"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon", "Hatchback"],
    earliest_year: 2005,
    latest_year: 2024,
  },
  {
    id: "7",
    part_number: "34116855152",
    part_name: "Brake Rotor Front",
    description: "Front brake rotor for BMW vehicles",
    price_msrp: 125.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Brake System",
    category_code: "BRAKES",
    compatible_chassis: ["G20", "F30", "G22", "F32", "E90", "E92"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon"],
    earliest_year: 2005,
    latest_year: 2024,
  },

  // Suspension & Steering
  {
    id: "8",
    part_number: "31336752735",
    part_name: "Front Shock Absorber",
    description: "Front shock absorber for BMW vehicles",
    price_msrp: 245.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Suspension & Steering",
    category_code: "SUSPENSION",
    compatible_chassis: ["G20", "F30", "G22", "F32", "E90", "E92"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon"],
    earliest_year: 2005,
    latest_year: 2024,
  },
  {
    id: "9",
    part_number: "33526785748",
    part_name: "Rear Shock Absorber",
    description: "Rear shock absorber for BMW vehicles",
    price_msrp: 225.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Suspension & Steering",
    category_code: "SUSPENSION",
    compatible_chassis: ["G20", "F30", "G22", "F32", "E90", "E92"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon"],
    earliest_year: 2005,
    latest_year: 2024,
  },
  {
    id: "10",
    part_number: "31126758510",
    part_name: "Control Arm Front Lower",
    description: "Front lower control arm for BMW vehicles",
    price_msrp: 189.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Suspension & Steering",
    category_code: "SUSPENSION",
    compatible_chassis: ["G20", "F30", "E90", "E92"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon"],
    earliest_year: 2005,
    latest_year: 2024,
  },

  // Cooling System
  {
    id: "11",
    part_number: "17117570261",
    part_name: "Radiator",
    description: "Engine cooling radiator for BMW vehicles",
    price_msrp: 389.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Cooling System",
    category_code: "COOLING",
    compatible_chassis: ["G20", "F30", "G30", "F10", "E90", "E92", "E60"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "M54"],
    compatible_body_types: ["Sedan", "Wagon"],
    earliest_year: 2005,
    latest_year: 2024,
  },
  {
    id: "12",
    part_number: "11517586781",
    part_name: "Water Pump",
    description: "Engine water pump for BMW vehicles",
    price_msrp: 159.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Cooling System",
    category_code: "COOLING",
    compatible_chassis: ["G20", "F30", "G22", "F32", "G30", "F10", "E90", "E92", "E60"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "M54", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon"],
    earliest_year: 2005,
    latest_year: 2024,
  },
  {
    id: "13",
    part_number: "17117519209",
    part_name: "Thermostat",
    description: "Engine thermostat for BMW vehicles",
    price_msrp: 45.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Cooling System",
    category_code: "COOLING",
    compatible_chassis: ["G20", "F30", "G22", "F32", "G30", "F10", "F20", "F22", "E90", "E92", "E60"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N52", "M54", "N20"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon", "Hatchback"],
    earliest_year: 2005,
    latest_year: 2024,
  },

  // Exterior Parts
  {
    id: "14",
    part_number: "51117237045",
    part_name: "Front Bumper Cover",
    description: "Front bumper cover for BMW vehicles",
    price_msrp: 599.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Exterior Parts",
    category_code: "EXTERIOR",
    compatible_chassis: ["G20", "F30", "G22", "F32"],
    compatible_engines: ["B48", "B58", "N55", "N20"],
    compatible_body_types: ["Sedan", "Coupe"],
    earliest_year: 2012,
    latest_year: 2024,
  },
  {
    id: "15",
    part_number: "51127237046",
    part_name: "Rear Bumper Cover",
    description: "Rear bumper cover for BMW vehicles",
    price_msrp: 549.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Exterior Parts",
    category_code: "EXTERIOR",
    compatible_chassis: ["G20", "F30", "G22", "F32"],
    compatible_engines: ["B48", "B58", "N55", "N20"],
    compatible_body_types: ["Sedan", "Coupe"],
    earliest_year: 2012,
    latest_year: 2024,
  },

  // Performance Parts for M Models
  {
    id: "16",
    part_number: "13717570261",
    part_name: "M Performance Air Intake",
    description: "M Performance cold air intake system",
    price_msrp: 899.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Performance Parts",
    category_code: "PERFORMANCE",
    compatible_chassis: ["G80", "F80", "G82", "F82", "F90"],
    compatible_engines: ["S55", "S58"],
    compatible_body_types: ["Sedan", "Coupe"],
    earliest_year: 2014,
    latest_year: 2024,
  },
  {
    id: "17",
    part_number: "18307845903",
    part_name: "M Performance Exhaust",
    description: "M Performance exhaust system",
    price_msrp: 2499.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Performance Parts",
    category_code: "PERFORMANCE",
    compatible_chassis: ["G80", "F80", "G82", "F82"],
    compatible_engines: ["S55", "S58"],
    compatible_body_types: ["Sedan", "Coupe"],
    earliest_year: 2014,
    latest_year: 2024,
  },

  // X-Series SUV Parts
  {
    id: "18",
    part_number: "31316785748",
    part_name: "X-Drive Transfer Case",
    description: "All-wheel drive transfer case for BMW X-Series",
    price_msrp: 1899.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Drivetrain",
    category_code: "DRIVETRAIN",
    compatible_chassis: ["G01", "F25", "G05", "F15", "G02", "F26"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N20"],
    compatible_body_types: ["SUV"],
    earliest_year: 2010,
    latest_year: 2024,
  },
  {
    id: "19",
    part_number: "34116855999",
    part_name: "X-Series Brake Kit",
    description: "Heavy-duty brake kit for BMW X-Series",
    price_msrp: 459.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Brake System",
    category_code: "BRAKES",
    compatible_chassis: ["G01", "F25", "G05", "F15", "G02", "F26"],
    compatible_engines: ["B48", "B58", "N55", "N54", "N20"],
    compatible_body_types: ["SUV"],
    earliest_year: 2010,
    latest_year: 2024,
  },

  // Classic BMW Parts (E-Series)
  {
    id: "20",
    part_number: "11421427525",
    part_name: "E-Series Oil Pan Gasket",
    description: "Oil pan gasket for classic BMW E-Series",
    price_msrp: 35.99,
    is_discontinued: false,
    superseded_by: null,
    category_name: "Engine Components",
    category_code: "ENGINE",
    compatible_chassis: ["E90", "E92", "E60", "E46", "E36"],
    compatible_engines: ["N52", "M54", "M52", "S54"],
    compatible_body_types: ["Sedan", "Coupe", "Wagon"],
    earliest_year: 1990,
    latest_year: 2013,
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
    {
      id: "PERFORMANCE",
      category_name: "Performance Parts",
      category_code: "PERFORMANCE",
      description: "Performance parts",
    },
    { id: "DRIVETRAIN", category_name: "Drivetrain", category_code: "DRIVETRAIN", description: "Drivetrain parts" },
  ]
}

export async function getBMWChassis(): Promise<BMWChassis[]> {
  return [
    { id: "1", chassis_code: "G20", chassis_name: "G20 3 Series", production_start: 2019, production_end: null },
    { id: "2", chassis_code: "G22", chassis_name: "G22 4 Series", production_start: 2021, production_end: null },
    { id: "3", chassis_code: "G30", chassis_name: "G30 5 Series", production_start: 2017, production_end: null },
    { id: "4", chassis_code: "G80", chassis_name: "G80 M3", production_start: 2021, production_end: null },
    { id: "5", chassis_code: "G82", chassis_name: "G82 M4", production_start: 2021, production_end: null },
    { id: "6", chassis_code: "G01", chassis_name: "G01 X-Series", production_start: 2010, production_end: null },
    { id: "7", chassis_code: "F25", chassis_name: "F25 X-Series", production_start: 2010, production_end: null },
    { id: "8", chassis_code: "G05", chassis_name: "G05 X-Series", production_start: 2010, production_end: null },
    { id: "9", chassis_code: "F15", chassis_name: "F15 X-Series", production_start: 2010, production_end: null },
    { id: "10", chassis_code: "G02", chassis_name: "G02 X-Series", production_start: 2010, production_end: null },
    { id: "11", chassis_code: "F26", chassis_name: "F26 X-Series", production_start: 2010, production_end: null },
    { id: "12", chassis_code: "E90", chassis_name: "E90 Classic", production_start: 1990, production_end: 2013 },
    { id: "13", chassis_code: "E92", chassis_name: "E92 Classic", production_start: 1990, production_end: 2013 },
    { id: "14", chassis_code: "E60", chassis_name: "E60 Classic", production_start: 1990, production_end: 2013 },
    { id: "15", chassis_code: "E46", chassis_name: "E46 Classic", production_start: 1990, production_end: 2013 },
    { id: "16", chassis_code: "E36", chassis_name: "E36 Classic", production_start: 1990, production_end: 2013 },
  ]
}

export async function getBMWEngines(): Promise<BMWEngine[]> {
  return [
    { id: "1", engine_code: "B48", engine_name: "B48 2.0L Turbo", displacement: 2.0, fuel_type: "Gasoline" },
    { id: "2", engine_code: "B58", engine_name: "B58 3.0L Turbo", displacement: 3.0, fuel_type: "Gasoline" },
    { id: "3", engine_code: "S55", engine_name: "S55 3.0L Twin Turbo", displacement: 3.0, fuel_type: "Gasoline" },
    { id: "4", engine_code: "S58", engine_name: "S58 3.0L Twin Turbo", displacement: 3.0, fuel_type: "Gasoline" },
    { id: "5", engine_code: "N54", engine_name: "N54 3.0L Turbo", displacement: 3.0, fuel_type: "Gasoline" },
    { id: "6", engine_code: "N52", engine_name: "N52 3.0L Turbo", displacement: 3.0, fuel_type: "Gasoline" },
    { id: "7", engine_code: "M54", engine_name: "M54 3.0L Turbo", displacement: 3.0, fuel_type: "Gasoline" },
    { id: "8", engine_code: "N20", engine_name: "N20 2.0L Turbo", displacement: 2.0, fuel_type: "Gasoline" },
    { id: "9", engine_code: "S54", engine_name: "S54 3.0L Turbo", displacement: 3.0, fuel_type: "Gasoline" },
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
