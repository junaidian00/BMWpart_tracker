import { supabase, isSupabaseConfigured } from './supabase'

export interface BMWOEMPart {
  id: number
  part_number: string
  part_name: string
  description: string | null
  category_name?: string
  category_code?: string
  price_msrp: number | null
  is_discontinued: boolean
  compatible_chassis?: string[]
  compatible_engines?: string[]
  earliest_year?: number
  latest_year?: number
  chassis_count?: number
  engine_count?: number
  superseded_by?: string
  installation_notes?: string
  weight_kg?: number
  diagram_position?: string
}

// Comprehensive BMW F22/F23/F30/F32/F33/F36 parts database
const COMPREHENSIVE_BMW_PARTS: BMWOEMPart[] = [
  // Engine Components - N20B20 Turbo
  {
    id: 1001,
    part_number: '11127838200',
    part_name: 'Oil Filter Housing',
    description: 'Oil filter housing assembly with integrated oil cooler for N20/N26 engines',
    category_name: 'Engine Components',
    category_code: 'ENGINE',
    price_msrp: 189.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    installation_notes: 'Requires special tools for proper installation',
    weight_kg: 2.1
  },
  {
    id: 1002,
    part_number: '11427640862',
    part_name: 'Oil Pan',
    description: 'Lower oil pan with drain plug for N20 engines',
    category_name: 'Engine Components',
    category_code: 'ENGINE',
    price_msrp: 245.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 3.2
  },
  {
    id: 1003,
    part_number: '11428507683',
    part_name: 'Timing Chain',
    description: 'Primary timing chain for N20B20 engine - updated version',
    category_name: 'Engine Components',
    category_code: 'ENGINE',
    price_msrp: 125.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20'],
    earliest_year: 2012,
    latest_year: 2019,
    installation_notes: 'Replace with timing chain guides and tensioner',
    weight_kg: 0.8
  },
  {
    id: 1004,
    part_number: '11318511368',
    part_name: 'Timing Chain Tensioner',
    description: 'Hydraulic timing chain tensioner for N20 engines',
    category_name: 'Engine Components',
    category_code: 'ENGINE',
    price_msrp: 89.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.5
  },
  {
    id: 1005,
    part_number: '11318635089',
    part_name: 'Timing Chain Guide',
    description: 'Upper timing chain guide for N20 engines',
    category_name: 'Engine Components',
    category_code: 'ENGINE',
    price_msrp: 45.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.3
  },

  // Turbocharger Components
  {
    id: 1010,
    part_number: '11657647003',
    part_name: 'Turbocharger',
    description: 'Complete turbocharger assembly for N20B20 engine',
    category_name: 'Forced Induction',
    category_code: 'TURBO',
    price_msrp: 1899.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20'],
    earliest_year: 2012,
    latest_year: 2019,
    installation_notes: 'Replace oil lines and coolant lines during installation',
    weight_kg: 12.5
  },
  {
    id: 1011,
    part_number: '11617640985',
    part_name: 'Charge Pipe',
    description: 'Turbocharger to intercooler charge pipe',
    category_name: 'Forced Induction',
    category_code: 'TURBO',
    price_msrp: 156.75,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 1.8
  },
  {
    id: 1012,
    part_number: '11617531423',
    part_name: 'Intercooler',
    description: 'Air-to-air intercooler for turbocharged engines',
    category_name: 'Forced Induction',
    category_code: 'TURBO',
    price_msrp: 425.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 4.2
  },
  {
    id: 1013,
    part_number: '11617566916',
    part_name: 'Turbo Oil Line',
    description: 'Turbocharger oil supply line',
    category_name: 'Forced Induction',
    category_code: 'TURBO',
    price_msrp: 89.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.4
  },

  // Cooling System
  {
    id: 1020,
    part_number: '17117647283',
    part_name: 'Radiator',
    description: 'Engine cooling radiator with integrated transmission cooler',
    category_name: 'Cooling System',
    category_code: 'COOLING',
    price_msrp: 345.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 8.5
  },
  {
    id: 1021,
    part_number: '11517586925',
    part_name: 'Water Pump',
    description: 'Electric water pump for N20 engines',
    category_name: 'Cooling System',
    category_code: 'COOLING',
    price_msrp: 289.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 2.8
  },
  {
    id: 1022,
    part_number: '11531436408',
    part_name: 'Thermostat',
    description: 'Engine coolant thermostat with housing',
    category_name: 'Cooling System',
    category_code: 'COOLING',
    price_msrp: 125.75,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 1.2
  },
  {
    id: 1023,
    part_number: '17127640514',
    part_name: 'Radiator Hose Upper',
    description: 'Upper radiator coolant hose',
    category_name: 'Cooling System',
    category_code: 'COOLING',
    price_msrp: 45.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.5
  },
  {
    id: 1024,
    part_number: '17127647713',
    part_name: 'Radiator Hose Lower',
    description: 'Lower radiator coolant hose',
    category_name: 'Cooling System',
    category_code: 'COOLING',
    price_msrp: 52.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.6
  },
  {
    id: 1025,
    part_number: '17111712835',
    part_name: 'Expansion Tank',
    description: 'Coolant expansion tank with cap',
    category_name: 'Cooling System',
    category_code: 'COOLING',
    price_msrp: 89.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 1.1
  },

  // Brake System - Front
  {
    id: 1030,
    part_number: '34116855152',
    part_name: 'Front Brake Pad Set',
    description: 'Front brake pad set for 330mm rotors',
    category_name: 'Brake System',
    category_code: 'BRAKES',
    price_msrp: 89.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 2.5
  },
  {
    id: 1031,
    part_number: '34116794300',
    part_name: 'Front Brake Rotor',
    description: 'Front brake disc 330mm vented',
    category_name: 'Brake System',
    category_code: 'BRAKES',
    price_msrp: 125.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 8.2
  },
  {
    id: 1032,
    part_number: '34116858652',
    part_name: 'Front Brake Caliper',
    description: 'Front brake caliper left side',
    category_name: 'Brake System',
    category_code: 'BRAKES',
    price_msrp: 345.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 4.5
  },

  // Brake System - Rear  
  {
    id: 1035,
    part_number: '34216855159',
    part_name: 'Rear Brake Pad Set',
    description: 'Rear brake pad set for 320mm rotors',
    category_name: 'Brake System',
    category_code: 'BRAKES',
    price_msrp: 75.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 2.1
  },
  {
    id: 1036,
    part_number: '34216792231',
    part_name: 'Rear Brake Rotor',
    description: 'Rear brake disc 320mm vented',
    category_name: 'Brake System',
    category_code: 'BRAKES',
    price_msrp: 95.75,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 6.8
  },

  // Suspension - Front
  {
    id: 1040,
    part_number: '31316786929',
    part_name: 'Front Control Arm Lower',
    description: 'Front lower control arm with ball joint',
    category_name: 'Suspension & Steering',
    category_code: 'SUSPENSION',
    price_msrp: 189.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 3.8
  },
  {
    id: 1041,
    part_number: '37116856191',
    part_name: 'Front Shock Absorber',
    description: 'Front shock absorber with spring',
    category_name: 'Suspension & Steering',
    category_code: 'SUSPENSION',
    price_msrp: 245.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 4.2
  },
  {
    id: 1042,
    part_number: '31336786008',
    part_name: 'Front Sway Bar Link',
    description: 'Front stabilizer bar link',
    category_name: 'Suspension & Steering',
    category_code: 'SUSPENSION',
    price_msrp: 25.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.4
  },
  {
    id: 1043,
    part_number: '31306786447',
    part_name: 'Front Sway Bar',
    description: 'Front stabilizer bar',
    category_name: 'Suspension & Steering',
    category_code: 'SUSPENSION',
    price_msrp: 125.75,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 3.2
  },

  // Suspension - Rear
  {
    id: 1045,
    part_number: '33526785748',
    part_name: 'Rear Shock Absorber',
    description: 'Rear shock absorber',
    category_name: 'Suspension & Steering', 
    category_code: 'SUSPENSION',
    price_msrp: 189.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 2.8
  },
  {
    id: 1046,
    part_number: '33326786447',
    part_name: 'Rear Control Arm',
    description: 'Rear upper control arm',
    category_name: 'Suspension & Steering',
    category_code: 'SUSPENSION',
    price_msrp: 156.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 2.1
  },

  // Air Intake System
  {
    id: 1050,
    part_number: '13717521023',
    part_name: 'Engine Air Filter',
    description: 'Engine air filter element for N20/N26 engines',
    category_name: 'Filters',
    category_code: 'FILTERS',
    price_msrp: 28.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.3
  },
  {
    id: 1051,
    part_number: '64319313519',
    part_name: 'Cabin Air Filter',
    description: 'Microfilter cabin air filter',
    category_name: 'Filters',
    category_code: 'FILTERS', 
    price_msrp: 35.75,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.4
  },
  {
    id: 1052,
    part_number: '13717570292',
    part_name: 'Air Intake Hose',
    description: 'Air intake hose from filter to throttle body',
    category_name: 'Air Intake',
    category_code: 'INTAKE',
    price_msrp: 89.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.8
  },

  // Electrical System
  {
    id: 1060,
    part_number: '12318616153',
    part_name: 'Ignition Coil',
    description: 'Ignition coil pack for N20 engines',
    category_name: 'Electrical System',
    category_code: 'ELECTRICAL',
    price_msrp: 89.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.3
  },
  {
    id: 1061,
    part_number: '12317599285',
    part_name: 'Spark Plugs Set',
    description: 'Set of 4 spark plugs for N20 engines',
    category_name: 'Electrical System',
    category_code: 'ELECTRICAL',
    price_msrp: 45.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.4
  },
  {
    id: 1062,
    part_number: '12317640086',
    part_name: 'Battery',
    description: '90Ah AGM battery',
    category_name: 'Electrical System',
    category_code: 'ELECTRICAL',
    price_msrp: 289.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 22.5
  },
  {
    id: 1063,
    part_number: '12317566847',
    part_name: 'Alternator',
    description: '180A alternator for N20 engines',
    category_name: 'Electrical System',
    category_code: 'ELECTRICAL',
    price_msrp: 456.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 6.8
  },

  // Exterior Lighting - F30/F31
  {
    id: 1070,
    part_number: '63117338561',
    part_name: 'Headlight Left LED',
    description: 'Left LED headlight assembly for F30 LCI',
    category_name: 'Exterior Parts',
    category_code: 'EXTERIOR',
    price_msrp: 1289.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2015,
    latest_year: 2019,
    weight_kg: 8.5
  },
  {
    id: 1071,
    part_number: '63117338562',
    part_name: 'Headlight Right LED',
    description: 'Right LED headlight assembly for F30 LCI',
    category_name: 'Exterior Parts',
    category_code: 'EXTERIOR',
    price_msrp: 1289.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2015,
    latest_year: 2019,
    weight_kg: 8.5
  },
  {
    id: 1072,
    part_number: '63217289429',
    part_name: 'Taillight Left',
    description: 'Left LED taillight for F30/F31',
    category_name: 'Exterior Parts',
    category_code: 'EXTERIOR',
    price_msrp: 325.75,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 2.1
  },

  // F22/F23 Specific Parts
  {
    id: 1080,
    part_number: '63127355392',
    part_name: 'F22 Headlight Left',
    description: 'Left halogen headlight for F22',
    category_name: 'Exterior Parts',
    category_code: 'EXTERIOR',
    price_msrp: 445.50,
    is_discontinued: false,
    compatible_chassis: ['F22'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2014,
    latest_year: 2021,
    weight_kg: 6.2
  },
  {
    id: 1081,
    part_number: '37116862604',
    part_name: 'F22 Front Strut',
    description: 'Front shock absorber for F22',
    category_name: 'Suspension & Steering',
    category_code: 'SUSPENSION',
    price_msrp: 225.99,
    is_discontinued: false,
    compatible_chassis: ['F22', 'F23'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2014,
    latest_year: 2021,
    weight_kg: 3.8
  },

  // F32/F33/F36 Specific Parts
  {
    id: 1090,
    part_number: '63117355393',
    part_name: 'F32 Headlight Left',
    description: 'Left LED headlight for F32 coupe',
    category_name: 'Exterior Parts',
    category_code: 'EXTERIOR',
    price_msrp: 1125.75,
    is_discontinued: false,
    compatible_chassis: ['F32', 'F33'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2013,
    latest_year: 2020,
    weight_kg: 7.8
  },
  {
    id: 1091,
    part_number: '51117292022',
    part_name: 'F36 Front Bumper',
    description: 'Front bumper cover for F36 Gran Coupe',
    category_name: 'Exterior Parts',
    category_code: 'EXTERIOR',
    price_msrp: 845.99,
    is_discontinued: false,
    compatible_chassis: ['F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2014,
    latest_year: 2019,
    weight_kg: 12.5
  },

  // Performance Parts - M Performance
  {
    id: 1100,
    part_number: '11617566912',
    part_name: 'M Performance Air Intake',
    description: 'M Performance carbon fiber air intake system',
    category_name: 'Performance Parts',
    category_code: 'PERFORMANCE',
    price_msrp: 689.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 2.8
  },
  {
    id: 1101,
    part_number: '18307845405',
    part_name: 'M Performance Exhaust',
    description: 'M Performance cat-back exhaust system',
    category_name: 'Performance Parts', 
    category_code: 'PERFORMANCE',
    price_msrp: 1789.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 18.5
  },
  {
    id: 1102,
    part_number: '34112405009',
    part_name: 'M Performance Brake Kit',
    description: 'M Performance front brake kit with blue calipers',
    category_name: 'Performance Parts',
    category_code: 'PERFORMANCE',
    price_msrp: 2189.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 25.8
  },

  // Interior Parts
  {
    id: 1110,
    part_number: '51459286798',
    part_name: 'Sport Steering Wheel',
    description: 'M Sport steering wheel with paddle shifters',
    category_name: 'Interior Parts',
    category_code: 'INTERIOR',
    price_msrp: 1289.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 3.2
  },
  {
    id: 1111,
    part_number: '52107845405',
    part_name: 'Sport Seat',
    description: 'Front sport seat with electric adjustment',
    category_name: 'Interior Parts',
    category_code: 'INTERIOR',
    price_msrp: 1845.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 28.5
  },

  // Transmission Parts
  {
    id: 1120,
    part_number: '24117647713',
    part_name: 'Transmission Filter',
    description: 'Automatic transmission filter for 8HP',
    category_name: 'Transmission',
    category_code: 'TRANSMISSION',
    price_msrp: 89.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.8
  },
  {
    id: 1121,
    part_number: '24117571227',
    part_name: 'Transmission Oil Pan',
    description: 'Automatic transmission oil pan with gasket',
    category_name: 'Transmission',
    category_code: 'TRANSMISSION', 
    price_msrp: 245.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 3.2
  },

  // Fuel System
  {
    id: 1130,
    part_number: '16117647283',
    part_name: 'Fuel Pump',
    description: 'High pressure fuel pump for direct injection',
    category_name: 'Fuel System',
    category_code: 'FUEL',
    price_msrp: 567.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 2.8
  },
  {
    id: 1131,
    part_number: '13537647099',
    part_name: 'Fuel Injector',
    description: 'Direct injection fuel injector',
    category_name: 'Fuel System',
    category_code: 'FUEL',
    price_msrp: 189.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.3
  },
  {
    id: 1132,
    part_number: '16117647291',
    part_name: 'Fuel Filter',
    description: 'In-tank fuel filter',
    category_name: 'Fuel System', 
    category_code: 'FUEL',
    price_msrp: 125.75,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.8
  },

  // Wheels and Tires
  {
    id: 1140,
    part_number: '36116855192',
    part_name: 'Style 397M Wheel',
    description: '18" M Sport wheel for F30',
    category_name: 'Wheels & Tires',
    category_code: 'WHEELS',
    price_msrp: 445.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 12.8
  },
  {
    id: 1141,
    part_number: '36116863427',
    part_name: 'Style 436M Wheel',  
    description: '19" M Sport wheel for F32',
    category_name: 'Wheels & Tires',
    category_code: 'WHEELS',
    price_msrp: 545.99,
    is_discontinued: false,
    compatible_chassis: ['F32', 'F33', 'F22', 'F23'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2013,
    latest_year: 2021,
    weight_kg: 14.2
  },

  // Body Parts and Trim
  {
    id: 1150,
    part_number: '51117292021',
    part_name: 'M Sport Front Bumper',
    description: 'M Sport front bumper for F30',
    category_name: 'Exterior Parts',
    category_code: 'EXTERIOR',
    price_msrp: 789.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 11.5
  },
  {
    id: 1151,
    part_number: '51127292034',
    part_name: 'M Sport Rear Bumper',
    description: 'M Sport rear bumper for F30',
    category_name: 'Exterior Parts',
    category_code: 'EXTERIOR',
    price_msrp: 645.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 9.8
  },
  {
    id: 1152,
    part_number: '51337292041',
    part_name: 'M Sport Side Skirt',
    description: 'M Sport side skirt left for F30',
    category_name: 'Exterior Parts',
    category_code: 'EXTERIOR', 
    price_msrp: 289.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 3.2
  },

  // Climate Control
  {
    id: 1160,
    part_number: '64116927905',
    part_name: 'A/C Compressor',
    description: 'Air conditioning compressor',
    category_name: 'HVAC System',
    category_code: 'HVAC',
    price_msrp: 789.95,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 8.5
  },
  {
    id: 1161,
    part_number: '64536927905',
    part_name: 'Blower Motor',
    description: 'HVAC blower motor',
    category_name: 'HVAC System',
    category_code: 'HVAC',
    price_msrp: 189.50,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 2.1
  },

  // Electronic Control Units  
  {
    id: 1170,
    part_number: '12617640284',
    part_name: 'Engine Control Unit',
    description: 'Engine ECU for N20B20 engines',
    category_name: 'Electronic Control Units',
    category_code: 'ECU',
    price_msrp: 1789.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20'],
    earliest_year: 2012,
    latest_year: 2019,
    installation_notes: 'Requires coding and programming',
    weight_kg: 1.8
  },
  {
    id: 1171,
    part_number: '61357845601',
    part_name: 'iDrive Controller',
    description: 'iDrive controller with touchpad',
    category_name: 'Electronic Control Units',
    category_code: 'ECU',
    price_msrp: 445.99,
    is_discontinued: false,
    compatible_chassis: ['F30', 'F31', 'F32', 'F33', 'F22', 'F23', 'F36'],
    compatible_engines: ['N20B20', 'N26B20', 'N55B30'],
    earliest_year: 2012,
    latest_year: 2019,
    weight_kg: 0.8
  }
]

// Enhanced search function with comprehensive data
export function searchOEMParts(filters: any = {}): Promise<BMWOEMPart[]> {
  return new Promise((resolve) => {
    let parts = [...COMPREHENSIVE_BMW_PARTS]

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase()
      parts = parts.filter(part => 
        part.part_name.toLowerCase().includes(query) ||
        part.part_number.toLowerCase().includes(query) ||
        (part.description && part.description.toLowerCase().includes(query)) ||
        (part.category_name && part.category_name.toLowerCase().includes(query))
      )
    }

    if (filters.partNumber) {
      parts = parts.filter(part => 
        part.part_number.toLowerCase().includes(filters.partNumber.toLowerCase())
      )
    }

    if (filters.categoryCode && filters.categoryCode !== 'all') {
      parts = parts.filter(part => part.category_code === filters.categoryCode)
    }

    if (filters.seriesCode && filters.seriesCode !== 'all') {
      parts = parts.filter(part => 
        part.compatible_chassis && part.compatible_chassis.includes(filters.seriesCode)
      )
    }

    if (!filters.includeDiscontinued) {
      parts = parts.filter(part => !part.is_discontinued)
    }

    if (filters.limit) {
      parts = parts.slice(0, filters.limit)
    }

    // Simulate async operation
    setTimeout(() => resolve(parts), 100)
  })
}

// Get featured parts
export function getFeaturedParts(limit: number = 6): Promise<BMWOEMPart[]> {
  return new Promise((resolve) => {
    const featured = COMPREHENSIVE_BMW_PARTS
      .filter(part => !part.is_discontinued && part.price_msrp)
      .sort((a, b) => (b.compatible_chassis?.length || 0) - (a.compatible_chassis?.length || 0))
      .slice(0, limit)
    
    setTimeout(() => resolve(featured), 100)
  })
}

// Get popular parts
export function getPopularParts(limit: number = 8): Promise<BMWOEMPart[]> {
  return new Promise((resolve) => {
    const popular = COMPREHENSIVE_BMW_PARTS
      .filter(part => !part.is_discontinued && part.price_msrp)
      .sort((a, b) => (b.compatible_engines?.length || 0) - (a.compatible_engines?.length || 0))
      .slice(0, limit)
    
    setTimeout(() => resolve(popular), 100)
  })
}

// Get part by number
export function getPartByNumber(partNumber: string): Promise<BMWOEMPart | null> {
  return new Promise((resolve) => {
    const part = COMPREHENSIVE_BMW_PARTS.find(p => p.part_number === partNumber)
    setTimeout(() => resolve(part || null), 100)
  })
}

// Get statistics
export function getPartsStatistics() {
  return Promise.resolve({
    chassis: 7,
    engines: 3,
    parts: COMPREHENSIVE_BMW_PARTS.length,
    categories: Array.from(new Set(COMPREHENSIVE_BMW_PARTS.map(p => p.category_code))).length
  })
}

// Export comprehensive parts list
export { COMPREHENSIVE_BMW_PARTS }
