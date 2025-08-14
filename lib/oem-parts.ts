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
  year?: number
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

interface VehicleSpecificPart {
  part_number: string
  part_name: string
  description: string
  price_msrp: number
  category_name: string
  category_code: string
  is_discontinued: boolean
  superseded_by?: string | null
  // Vehicle compatibility
  years: number[]
  chassis_codes: string[]
  engine_codes: string[]
  transmission_types?: string[]
}

const YEAR_SPECIFIC_BMW_PARTS: VehicleSpecificPart[] = [
  // Oil Filters - Engine Specific
  {
    part_number: "11427953129", // N55 Oil Filter (2015 2 Series example)
    part_name: "Oil Filter - N55 Engine",
    description: "Engine oil filter for N55 turbocharged engines",
    price_msrp: 18.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2011, 2012, 2013, 2014, 2015, 2016],
    chassis_codes: ["F22", "F23", "F30", "F31", "F32", "F33", "F34", "F36", "F10", "F11", "F07", "F01", "F02"],
    engine_codes: ["N55"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "11427826799", // B58 Oil Filter (2016+ 2 Series example)
    part_name: "Oil Filter - B58 Engine",
    description: "Engine oil filter for B58 turbocharged engines",
    price_msrp: 19.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["F22", "F23", "G20", "G21", "G22", "G23", "G30", "G31", "G32", "G05", "G06", "G07"],
    engine_codes: ["B58"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "11427566327", // B48 Oil Filter
    part_name: "Oil Filter - B48 Engine",
    description: "Engine oil filter for B48 turbocharged engines",
    price_msrp: 16.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["F20", "F21", "F22", "F23", "F30", "F31", "F32", "F33", "F34", "F36", "G20", "G21", "G01", "G02"],
    engine_codes: ["B48"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "11427508969", // N20 Oil Filter
    part_name: "Oil Filter - N20 Engine",
    description: "Engine oil filter for N20 turbocharged engines",
    price_msrp: 17.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2011, 2012, 2013, 2014, 2015, 2016],
    chassis_codes: ["F20", "F21", "F22", "F23", "F30", "F31", "F32", "F33", "F34", "F36", "F10", "F11"],
    engine_codes: ["N20"],
    transmission_types: ["Manual", "Automatic"],
  },

  // Air Filters - Chassis and Engine Specific
  {
    part_number: "13717570261", // F22 2 Series Air Filter
    part_name: "Air Filter - F22 2 Series",
    description: "Engine air filter for F22 2 Series chassis",
    price_msrp: 28.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
    chassis_codes: ["F22", "F23"],
    engine_codes: ["N20", "N55", "B48", "B58"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "13718616427", // G20 3 Series Air Filter
    part_name: "Air Filter - G20 3 Series",
    description: "Engine air filter for G20 3 Series chassis",
    price_msrp: 32.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["G20", "G21"],
    engine_codes: ["B48", "B58"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },

  // Spark Plugs - Engine Specific
  {
    part_number: "12120037607", // N55 Spark Plugs
    part_name: "Spark Plugs - N55 Engine (Set of 6)",
    description: "Spark plug set for N55 6-cylinder turbocharged engines",
    price_msrp: 89.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2011, 2012, 2013, 2014, 2015, 2016],
    chassis_codes: ["F22", "F23", "F30", "F31", "F32", "F33", "F34", "F36", "F10", "F11", "F07"],
    engine_codes: ["N55"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "12120040516", // B58 Spark Plugs
    part_name: "Spark Plugs - B58 Engine (Set of 6)",
    description: "Spark plug set for B58 6-cylinder turbocharged engines",
    price_msrp: 94.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["F22", "F23", "G20", "G21", "G22", "G23", "G30", "G31", "G32", "G05", "G06"],
    engine_codes: ["B58"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "12120037244", // B48 Spark Plugs
    part_name: "Spark Plugs - B48 Engine (Set of 4)",
    description: "Spark plug set for B48 4-cylinder turbocharged engines",
    price_msrp: 67.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["F20", "F21", "F22", "F23", "F30", "F31", "F32", "F33", "F34", "F36", "G20", "G21", "G01", "G02"],
    engine_codes: ["B48"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },

  // Brake Pads - Chassis Specific
  {
    part_number: "34116794300", // F22 Front Brake Pads
    part_name: "Brake Pad Set Front - F22 2 Series",
    description: "Front brake pad set for F22/F23 2 Series",
    price_msrp: 94.99,
    category_name: "Brake System",
    category_code: "BRAKES",
    is_discontinued: false,
    years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
    chassis_codes: ["F22", "F23"],
    engine_codes: ["N20", "N55", "B48", "B58"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "34116858910", // G20 Front Brake Pads
    part_name: "Brake Pad Set Front - G20 3 Series",
    description: "Front brake pad set for G20/G21 3 Series",
    price_msrp: 109.99,
    category_name: "Brake System",
    category_code: "BRAKES",
    is_discontinued: false,
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["G20", "G21"],
    engine_codes: ["B48", "B58"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },

  // Water Pumps - Engine Specific
  {
    part_number: "11517586925", // N55 Water Pump
    part_name: "Water Pump - N55 Engine",
    description: "Engine water pump for N55 turbocharged engines",
    price_msrp: 189.99,
    category_name: "Cooling System",
    category_code: "COOLING",
    is_discontinued: false,
    years: [2011, 2012, 2013, 2014, 2015, 2016],
    chassis_codes: ["F22", "F23", "F30", "F31", "F32", "F33", "F34", "F36", "F10", "F11", "F07"],
    engine_codes: ["N55"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "11518635089", // B58 Water Pump
    part_name: "Water Pump - B58 Engine",
    description: "Engine water pump for B58 turbocharged engines",
    price_msrp: 219.99,
    category_name: "Cooling System",
    category_code: "COOLING",
    is_discontinued: false,
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["F22", "F23", "G20", "G21", "G22", "G23", "G30", "G31", "G32", "G05", "G06"],
    engine_codes: ["B58"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },

  // Fuel Injectors - Engine Specific
  {
    part_number: "13537585261", // N55 Fuel Injector
    part_name: "Fuel Injector - N55 Engine",
    description: "High-pressure fuel injector for N55 engines",
    price_msrp: 159.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2011, 2012, 2013, 2014, 2015, 2016],
    chassis_codes: ["F22", "F23", "F30", "F31", "F32", "F33", "F34", "F36", "F10", "F11"],
    engine_codes: ["N55"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "13538616079", // B58 Fuel Injector
    part_name: "Fuel Injector - B58 Engine",
    description: "High-pressure fuel injector for B58 engines",
    price_msrp: 179.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["F22", "F23", "G20", "G21", "G22", "G23", "G30", "G31", "G32"],
    engine_codes: ["B58"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },

  // Turbochargers - Engine Specific
  {
    part_number: "11657649290", // N55 Turbocharger
    part_name: "Turbocharger - N55 Engine",
    description: "Single turbocharger for N55 engines",
    price_msrp: 1899.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2011, 2012, 2013, 2014, 2015, 2016],
    chassis_codes: ["F22", "F23", "F30", "F31", "F32", "F33", "F34", "F36", "F10", "F11"],
    engine_codes: ["N55"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },
  {
    part_number: "11658635089", // B58 Turbocharger
    part_name: "Turbocharger - B58 Engine",
    description: "Single turbocharger for B58 engines",
    price_msrp: 2199.99,
    category_name: "Engine Components",
    category_code: "ENGINE",
    is_discontinued: false,
    years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["F22", "F23", "G20", "G21", "G22", "G23", "G30", "G31", "G32"],
    engine_codes: ["B58"],
    transmission_types: ["Manual", "Automatic", "DCT"],
  },

  // Transmission Specific Parts
  {
    part_number: "24007571227", // Manual Transmission Clutch Kit F22
    part_name: "Clutch Kit - F22 Manual Transmission",
    description: "Complete clutch kit for F22 manual transmission",
    price_msrp: 689.99,
    category_name: "Transmission",
    category_code: "TRANSMISSION",
    is_discontinued: false,
    years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
    chassis_codes: ["F22", "F23"],
    engine_codes: ["N20", "N55", "B48"],
    transmission_types: ["Manual"],
  },
  {
    part_number: "24007635089", // DCT Transmission Fluid G20
    part_name: "DCT Transmission Fluid - G20 Series",
    description: "Dual-clutch transmission fluid for G20 DCT",
    price_msrp: 89.99,
    category_name: "Transmission",
    category_code: "TRANSMISSION",
    is_discontinued: false,
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    chassis_codes: ["G20", "G21"],
    engine_codes: ["B48", "B58"],
    transmission_types: ["DCT"],
  },
]

export async function searchOEMParts(params: SearchOEMPartsParams): Promise<BMWOEMPart[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results: BMWOEMPart[] = []

      // Convert year-specific parts to BMWOEMPart format
      const convertedParts = YEAR_SPECIFIC_BMW_PARTS.map((part, index) => ({
        id: `ys-${index}`,
        part_number: part.part_number,
        part_name: part.part_name,
        description: part.description,
        price_msrp: part.price_msrp,
        is_discontinued: part.is_discontinued,
        superseded_by: part.superseded_by || null,
        category_name: part.category_name,
        category_code: part.category_code,
        compatible_chassis: part.chassis_codes,
        compatible_engines: part.engine_codes,
        compatible_body_types: ["Sedan", "Coupe", "Wagon", "Hatchback", "SUV"],
        earliest_year: Math.min(...part.years),
        latest_year: Math.max(...part.years),
      }))

      // Combine with existing parts
      results = [...convertedParts, ...INSTANT_OEM_PARTS]

      // Apply filters
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

      if (params.year) {
        results = results.filter((part) => {
          if (!part.earliest_year || !part.latest_year) return true
          return params.year! >= part.earliest_year && params.year! <= part.latest_year
        })
      }

      if (params.categoryCode) {
        results = results.filter((part) => part.category_code === params.categoryCode)
      }

      // Remove duplicates by part number (prefer year-specific parts)
      const uniqueParts = new Map<string, BMWOEMPart>()
      results.forEach((part) => {
        if (!uniqueParts.has(part.part_number) || part.id.startsWith("ys-")) {
          uniqueParts.set(part.part_number, part)
        }
      })

      resolve(Array.from(uniqueParts.values()).slice(0, params.limit || 50))
    }, 100)
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
    {
      id: "TRANSMISSION",
      category_name: "Transmission",
      category_code: "TRANSMISSION",
      description: "Transmission parts",
    },
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
  year?: number
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
    year: filters.year,
  })
}
