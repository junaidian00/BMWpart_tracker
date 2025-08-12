export interface RealOEMPart {
  id: string
  partNumber: string
  name: string
  description: string
  category: string
  subcategory: string
  price: number
  currency: string
  availability: "In Stock" | "Limited" | "Out of Stock" | "Discontinued"
  compatibility: {
    years: number[]
    models: string[]
    chassisCodes: string[]
    engineCodes: string[]
    transmissionCodes?: string[]
    bodyTypes?: string[]
    notes?: string
  }
  specifications?: {
    weight?: string
    dimensions?: string
    material?: string
    color?: string
    oem?: boolean
  }
  imageUrl?: string
  diagrams?: string[]
  relatedParts?: string[]
}

export const REALOEM_PARTS_DATABASE: RealOEMPart[] = [
  // ENGINE COMPONENTS - S58 (G80 M3, G82/G83 M4, G87 M2)
  {
    id: "s58-oil-filter",
    partNumber: "11427566327",
    name: "Oil Filter Element",
    description: "OEM oil filter element for S58 engine",
    category: "Engine",
    subcategory: "Lubrication",
    price: 24.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: [2021, 2022, 2023, 2024],
      models: ["M2", "M3", "M4"],
      chassisCodes: ["G87", "G80", "G82", "G83"],
      engineCodes: ["S58"],
    },
    specifications: { oem: true, material: "Paper/Synthetic" },
  },

  // UNIVERSAL OEM PARTS - Compatible with ALL BMW models
  {
    id: "universal-oil-filter-1",
    partNumber: "11427508969",
    name: "Universal Oil Filter Element",
    description: "OEM oil filter compatible with most BMW engines",
    category: "Engine",
    subcategory: "Lubrication",
    price: 19.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i), // 1970-2026
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Paper/Synthetic" },
  },

  {
    id: "universal-air-filter",
    partNumber: "13717521023",
    name: "Universal Air Filter Element",
    description: "OEM air filter compatible with most BMW models",
    category: "Engine",
    subcategory: "Air Intake",
    price: 34.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Paper" },
  },

  {
    id: "universal-cabin-filter",
    partNumber: "64319313519",
    name: "Universal Cabin Air Filter",
    description: "OEM cabin air filter for BMW vehicles",
    category: "Interior",
    subcategory: "Climate Control",
    price: 29.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Activated Carbon" },
  },

  {
    id: "universal-brake-pads-front",
    partNumber: "34116794300",
    name: "Universal Front Brake Pads",
    description: "OEM front brake pads compatible with most BMW models",
    category: "Brakes",
    subcategory: "Brake Pads",
    price: 89.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Ceramic" },
  },

  {
    id: "universal-brake-pads-rear",
    partNumber: "34216794301",
    name: "Universal Rear Brake Pads",
    description: "OEM rear brake pads compatible with most BMW models",
    category: "Brakes",
    subcategory: "Brake Pads",
    price: 79.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Ceramic" },
  },

  {
    id: "universal-brake-rotors-front",
    partNumber: "34116855000",
    name: "Universal Front Brake Rotors",
    description: "OEM front brake rotors for BMW vehicles",
    category: "Brakes",
    subcategory: "Brake Rotors",
    price: 159.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Cast Iron" },
  },

  {
    id: "universal-brake-rotors-rear",
    partNumber: "34216855001",
    name: "Universal Rear Brake Rotors",
    description: "OEM rear brake rotors for BMW vehicles",
    category: "Brakes",
    subcategory: "Brake Rotors",
    price: 139.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Cast Iron" },
  },

  {
    id: "universal-spark-plugs",
    partNumber: "12120037244",
    name: "Universal Spark Plugs",
    description: "OEM spark plugs compatible with most BMW engines",
    category: "Engine",
    subcategory: "Ignition",
    price: 24.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Iridium" },
  },

  {
    id: "universal-ignition-coils",
    partNumber: "12137594937",
    name: "Universal Ignition Coils",
    description: "OEM ignition coils for BMW engines",
    category: "Engine",
    subcategory: "Ignition",
    price: 89.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-thermostat",
    partNumber: "11537549476",
    name: "Universal Engine Thermostat",
    description: "OEM thermostat for BMW cooling systems",
    category: "Cooling",
    subcategory: "Thermostat",
    price: 49.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-water-pump",
    partNumber: "11517586925",
    name: "Universal Water Pump",
    description: "OEM water pump for BMW cooling systems",
    category: "Cooling",
    subcategory: "Water Pump",
    price: 189.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-radiator",
    partNumber: "17117788903",
    name: "Universal Radiator",
    description: "OEM radiator for BMW cooling systems",
    category: "Cooling",
    subcategory: "Radiator",
    price: 299.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Aluminum" },
  },

  {
    id: "universal-suspension-struts-front",
    partNumber: "31316789329",
    name: "Universal Front Suspension Struts",
    description: "OEM front suspension struts for BMW vehicles",
    category: "Suspension",
    subcategory: "Struts",
    price: 249.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-suspension-struts-rear",
    partNumber: "33526789330",
    name: "Universal Rear Suspension Struts",
    description: "OEM rear suspension struts for BMW vehicles",
    category: "Suspension",
    subcategory: "Struts",
    price: 229.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-control-arms",
    partNumber: "31126789331",
    name: "Universal Control Arms",
    description: "OEM control arms for BMW suspension systems",
    category: "Suspension",
    subcategory: "Control Arms",
    price: 159.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Aluminum" },
  },

  {
    id: "universal-tie-rods",
    partNumber: "32106789332",
    name: "Universal Tie Rods",
    description: "OEM tie rods for BMW steering systems",
    category: "Steering",
    subcategory: "Tie Rods",
    price: 89.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-ball-joints",
    partNumber: "31126789333",
    name: "Universal Ball Joints",
    description: "OEM ball joints for BMW suspension systems",
    category: "Suspension",
    subcategory: "Ball Joints",
    price: 69.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-sway-bar-links",
    partNumber: "31356789334",
    name: "Universal Sway Bar Links",
    description: "OEM sway bar links for BMW vehicles",
    category: "Suspension",
    subcategory: "Sway Bar",
    price: 49.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-transmission-filter",
    partNumber: "24117571227",
    name: "Universal Transmission Filter",
    description: "OEM transmission filter for BMW automatic transmissions",
    category: "Transmission",
    subcategory: "Filters",
    price: 79.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
      transmissionCodes: ["8AT", "7DCT", "6AT", "5AT", "4AT"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-transmission-fluid",
    partNumber: "83222405966",
    name: "Universal Transmission Fluid",
    description: "OEM transmission fluid for BMW automatic transmissions",
    category: "Transmission",
    subcategory: "Fluids",
    price: 29.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
      transmissionCodes: ["8AT", "7DCT", "6AT", "5AT", "4AT"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-clutch-kit",
    partNumber: "21207571228",
    name: "Universal Clutch Kit",
    description: "OEM clutch kit for BMW manual transmissions",
    category: "Transmission",
    subcategory: "Clutch",
    price: 399.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
      transmissionCodes: ["6MT", "5MT", "4MT"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-alternator",
    partNumber: "12317571229",
    name: "Universal Alternator",
    description: "OEM alternator for BMW electrical systems",
    category: "Electrical",
    subcategory: "Charging",
    price: 299.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-starter",
    partNumber: "12417571230",
    name: "Universal Starter Motor",
    description: "OEM starter motor for BMW engines",
    category: "Electrical",
    subcategory: "Starting",
    price: 249.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-battery",
    partNumber: "61217571231",
    name: "Universal Battery",
    description: "OEM battery for BMW vehicles",
    category: "Electrical",
    subcategory: "Battery",
    price: 199.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-headlights",
    partNumber: "63127571232",
    name: "Universal Headlight Assembly",
    description: "OEM headlight assembly for BMW vehicles",
    category: "Lighting",
    subcategory: "Headlights",
    price: 399.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-taillights",
    partNumber: "63217571233",
    name: "Universal Taillight Assembly",
    description: "OEM taillight assembly for BMW vehicles",
    category: "Lighting",
    subcategory: "Taillights",
    price: 299.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-door-handles",
    partNumber: "51217571234",
    name: "Universal Door Handles",
    description: "OEM door handles for BMW vehicles",
    category: "Body",
    subcategory: "Exterior",
    price: 89.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-mirrors",
    partNumber: "51167571235",
    name: "Universal Side Mirrors",
    description: "OEM side mirrors for BMW vehicles",
    category: "Body",
    subcategory: "Mirrors",
    price: 199.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-window-regulators",
    partNumber: "51337571236",
    name: "Universal Window Regulators",
    description: "OEM window regulators for BMW vehicles",
    category: "Body",
    subcategory: "Windows",
    price: 149.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-seat-covers",
    partNumber: "52107571237",
    name: "Universal Seat Covers",
    description: "OEM seat covers for BMW vehicles",
    category: "Interior",
    subcategory: "Seating",
    price: 299.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Leather" },
  },

  {
    id: "universal-floor-mats",
    partNumber: "51477571238",
    name: "Universal Floor Mats",
    description: "OEM floor mats for BMW vehicles",
    category: "Interior",
    subcategory: "Floor Protection",
    price: 89.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Rubber" },
  },

  {
    id: "universal-engine-oil",
    partNumber: "83212365950",
    name: "Universal Engine Oil",
    description: "OEM engine oil for BMW vehicles",
    category: "Fluids",
    subcategory: "Engine Oil",
    price: 49.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-coolant",
    partNumber: "83192211191",
    name: "Universal Coolant",
    description: "OEM coolant for BMW cooling systems",
    category: "Fluids",
    subcategory: "Coolant",
    price: 29.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-brake-fluid",
    partNumber: "83132405977",
    name: "Universal Brake Fluid",
    description: "OEM brake fluid for BMW brake systems",
    category: "Fluids",
    subcategory: "Brake Fluid",
    price: 19.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-power-steering-fluid",
    partNumber: "32411141426",
    name: "Universal Power Steering Fluid",
    description: "OEM power steering fluid for BMW vehicles",
    category: "Fluids",
    subcategory: "Power Steering",
    price: 24.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  // ENGINE-SPECIFIC PARTS
  // S58 Engine Parts (G80 M3, G82/G83 M4, G87 M2)
  {
    id: "s58-turbocharger",
    partNumber: "11657649290",
    name: "S58 Turbocharger",
    description: "OEM turbocharger for S58 engine",
    category: "Engine",
    subcategory: "Forced Induction",
    price: 2499.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: [2021, 2022, 2023, 2024],
      models: ["M2", "M3", "M4"],
      chassisCodes: ["G87", "G80", "G82", "G83"],
      engineCodes: ["S58"],
    },
    specifications: { oem: true },
  },

  {
    id: "s58-intercooler",
    partNumber: "17517649291",
    name: "S58 Intercooler",
    description: "OEM intercooler for S58 engine",
    category: "Engine",
    subcategory: "Cooling",
    price: 899.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: [2021, 2022, 2023, 2024],
      models: ["M2", "M3", "M4"],
      chassisCodes: ["G87", "G80", "G82", "G83"],
      engineCodes: ["S58"],
    },
    specifications: { oem: true, material: "Aluminum" },
  },

  // S55 Engine Parts (F80 M3, F82/F83 M4, F87 M2)
  {
    id: "s55-turbocharger",
    partNumber: "11657649292",
    name: "S55 Turbocharger",
    description: "OEM turbocharger for S55 engine",
    category: "Engine",
    subcategory: "Forced Induction",
    price: 2299.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
      models: ["M2", "M3", "M4"],
      chassisCodes: ["F87", "F80", "F82", "F83"],
      engineCodes: ["S55"],
    },
    specifications: { oem: true },
  },

  {
    id: "s55-charge-pipe",
    partNumber: "11617649293",
    name: "S55 Charge Pipe",
    description: "OEM charge pipe for S55 engine",
    category: "Engine",
    subcategory: "Air Intake",
    price: 299.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
      models: ["M2", "M3", "M4"],
      chassisCodes: ["F87", "F80", "F82", "F83"],
      engineCodes: ["S55"],
    },
    specifications: { oem: true, material: "Aluminum" },
  },

  // B58 Engine Parts
  {
    id: "b58-turbocharger",
    partNumber: "11657649294",
    name: "B58 Turbocharger",
    description: "OEM turbocharger for B58 engine",
    category: "Engine",
    subcategory: "Forced Induction",
    price: 1899.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      models: ["3 Series", "4 Series", "5 Series"],
      chassisCodes: ["G20", "G21", "G22", "G23", "G30", "G31", "F30", "F31", "F32", "F33"],
      engineCodes: ["B58"],
    },
    specifications: { oem: true },
  },

  // N55 Engine Parts
  {
    id: "n55-turbocharger",
    partNumber: "11657649295",
    name: "N55 Turbocharger",
    description: "OEM turbocharger for N55 engine",
    category: "Engine",
    subcategory: "Forced Induction",
    price: 1699.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018],
      models: ["3 Series", "4 Series", "5 Series"],
      chassisCodes: ["F30", "F31", "F32", "F33", "F10", "F11", "E90", "E91", "E92", "E93"],
      engineCodes: ["N55"],
    },
    specifications: { oem: true },
  },

  // Classic Engine Parts
  {
    id: "s54-intake-manifold",
    partNumber: "11617649296",
    name: "S54 Intake Manifold",
    description: "OEM intake manifold for S54 engine",
    category: "Engine",
    subcategory: "Air Intake",
    price: 899.99,
    currency: "USD",
    availability: "Limited",
    compatibility: {
      years: [2000, 2001, 2002, 2003, 2004, 2005, 2006],
      models: ["M3"],
      chassisCodes: ["E46"],
      engineCodes: ["S54"],
    },
    specifications: { oem: true, material: "Aluminum" },
  },

  {
    id: "s65-throttle-body",
    partNumber: "13547649297",
    name: "S65 Throttle Body",
    description: "OEM throttle body for S65 engine",
    category: "Engine",
    subcategory: "Air Intake",
    price: 699.99,
    currency: "USD",
    availability: "Limited",
    compatibility: {
      years: [2007, 2008, 2009, 2010, 2011, 2012, 2013],
      models: ["M3"],
      chassisCodes: ["E90", "E92", "E93"],
      engineCodes: ["S65"],
    },
    specifications: { oem: true },
  },

  // X-Series Specific Parts
  {
    id: "x-series-transfer-case",
    partNumber: "27107649298",
    name: "X-Series Transfer Case",
    description: "OEM transfer case for BMW X-Series vehicles",
    category: "Drivetrain",
    subcategory: "Transfer Case",
    price: 1999.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 25 }, (_, i) => 2024 - i), // 2000-2024
      models: ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "X3 M", "X4 M", "X5 M", "X6 M"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "x-series-differential",
    partNumber: "33107649299",
    name: "X-Series Rear Differential",
    description: "OEM rear differential for BMW X-Series vehicles",
    category: "Drivetrain",
    subcategory: "Differential",
    price: 1499.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 25 }, (_, i) => 2024 - i),
      models: ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "X3 M", "X4 M", "X5 M", "X6 M"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  // Z-Series Specific Parts
  {
    id: "z-series-convertible-top",
    partNumber: "54347649300",
    name: "Z-Series Convertible Top",
    description: "OEM convertible top for BMW Z-Series vehicles",
    category: "Body",
    subcategory: "Convertible",
    price: 2999.99,
    currency: "USD",
    availability: "Limited",
    compatibility: {
      years: Array.from({ length: 35 }, (_, i) => 2024 - i), // 1990-2024
      models: ["Z3", "Z4", "Z3 M"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Canvas" },
  },

  // i-Series Electric Parts
  {
    id: "i-series-battery-pack",
    partNumber: "61217649301",
    name: "i-Series Battery Pack",
    description: "OEM battery pack for BMW i-Series electric vehicles",
    category: "Electric",
    subcategory: "Battery",
    price: 15999.99,
    currency: "USD",
    availability: "Limited",
    compatibility: {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      models: ["i3", "i4", "i8", "iX"],
      chassisCodes: ["I01", "I12", "I20", "G26"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "i-series-charging-port",
    partNumber: "61217649302",
    name: "i-Series Charging Port",
    description: "OEM charging port for BMW i-Series electric vehicles",
    category: "Electric",
    subcategory: "Charging",
    price: 499.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      models: ["i3", "i4", "i8", "iX"],
      chassisCodes: ["I01", "I12", "I20", "G26"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  // Performance Parts
  {
    id: "m-performance-exhaust",
    partNumber: "18307649303",
    name: "M Performance Exhaust System",
    description: "OEM M Performance exhaust system",
    category: "Performance",
    subcategory: "Exhaust",
    price: 2499.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 15 }, (_, i) => 2024 - i), // 2010-2024
      models: ["M2", "M3", "M4", "M5", "M6", "M8"],
      chassisCodes: ["ALL"],
      engineCodes: ["S55", "S58", "S63"],
    },
    specifications: { oem: true, material: "Titanium" },
  },

  {
    id: "m-performance-intake",
    partNumber: "13717649304",
    name: "M Performance Cold Air Intake",
    description: "OEM M Performance cold air intake system",
    category: "Performance",
    subcategory: "Air Intake",
    price: 899.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 15 }, (_, i) => 2024 - i),
      models: ["M2", "M3", "M4", "M5", "M6", "M8"],
      chassisCodes: ["ALL"],
      engineCodes: ["S55", "S58", "S63"],
    },
    specifications: { oem: true, material: "Carbon Fiber" },
  },

  // Wheels and Tires
  {
    id: "universal-alloy-wheels",
    partNumber: "36116789335",
    name: "Universal Alloy Wheels",
    description: "OEM alloy wheels for BMW vehicles",
    category: "Wheels & Tires",
    subcategory: "Wheels",
    price: 399.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true, material: "Aluminum Alloy" },
  },

  {
    id: "universal-run-flat-tires",
    partNumber: "36126789336",
    name: "Universal Run-Flat Tires",
    description: "OEM run-flat tires for BMW vehicles",
    category: "Wheels & Tires",
    subcategory: "Tires",
    price: 299.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  // Climate Control
  {
    id: "universal-ac-compressor",
    partNumber: "64526789337",
    name: "Universal A/C Compressor",
    description: "OEM A/C compressor for BMW climate control systems",
    category: "Climate Control",
    subcategory: "A/C System",
    price: 599.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-heater-core",
    partNumber: "64116789338",
    name: "Universal Heater Core",
    description: "OEM heater core for BMW climate control systems",
    category: "Climate Control",
    subcategory: "Heating",
    price: 199.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  // Maintenance Items
  {
    id: "universal-service-kit",
    partNumber: "83212365951",
    name: "Universal Service Kit",
    description: "Complete OEM service kit including oil, filters, and fluids",
    category: "Maintenance",
    subcategory: "Service Kits",
    price: 149.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-timing-chain",
    partNumber: "11317789339",
    name: "Universal Timing Chain",
    description: "OEM timing chain for BMW engines",
    category: "Engine",
    subcategory: "Timing",
    price: 199.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },

  {
    id: "universal-timing-chain-tensioner",
    partNumber: "11317789340",
    name: "Universal Timing Chain Tensioner",
    description: "OEM timing chain tensioner for BMW engines",
    category: "Engine",
    subcategory: "Timing",
    price: 89.99,
    currency: "USD",
    availability: "In Stock",
    compatibility: {
      years: Array.from({ length: 57 }, (_, i) => 2026 - i),
      models: ["ALL"],
      chassisCodes: ["ALL"],
      engineCodes: ["ALL"],
    },
    specifications: { oem: true },
  },
]

export function getCompatibleParts(
  year?: number,
  model?: string,
  chassisCode?: string,
  engineCode?: string,
  transmissionCode?: string,
): RealOEMPart[] {
  return REALOEM_PARTS_DATABASE.filter((part) => {
    const compatibility = part.compatibility

    // Handle universal compatibility
    if (compatibility.chassisCodes.includes("ALL") || compatibility.engineCodes.includes("ALL")) {
      return true
    }

    if (year && !compatibility.years.includes(year)) return false
    if (model && !compatibility.models.includes(model) && !compatibility.models.includes("ALL")) return false
    if (chassisCode && !compatibility.chassisCodes.includes(chassisCode)) return false
    if (engineCode && !compatibility.engineCodes.includes(engineCode)) return false
    if (
      transmissionCode &&
      compatibility.transmissionCodes &&
      !compatibility.transmissionCodes.includes(transmissionCode)
    )
      return false

    return true
  })
}

export function getPartsByCategory(category: string): RealOEMPart[] {
  return REALOEM_PARTS_DATABASE.filter((part) => part.category === category)
}

export function searchParts(query: string): RealOEMPart[] {
  const searchTerm = query.toLowerCase()
  return REALOEM_PARTS_DATABASE.filter(
    (part) =>
      part.name.toLowerCase().includes(searchTerm) ||
      part.description.toLowerCase().includes(searchTerm) ||
      part.partNumber.toLowerCase().includes(searchTerm),
  )
}
