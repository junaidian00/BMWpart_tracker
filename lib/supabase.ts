import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Public env helpers
 * In the browser, only NEXT_PUBLIC_* variables are available.
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const REQUIRED_ENV = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const

export function getMissingSupabaseEnv(): string[] {
  const missing: string[] = []
  for (const k of REQUIRED_ENV) {
    if (!process.env[k] || process.env[k] === "") missing.push(k)
  }
  return missing
}

const configured = getMissingSupabaseEnv().length === 0

// For compatibility with earlier code that might import a boolean:
export const isSupabaseConfigured = configured
// And a callable variant for convenience in client components:
export function isSupabaseConfiguredFn() {
  return configured
}

let singleton: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!configured) {
    throw new Error("Supabase is not configured. Missing: " + getMissingSupabaseEnv().join(", "))
  }
  if (!singleton) {
    singleton = createClient(URL, ANON, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return singleton
}

// A safe shim for modules that import { supabase } directly.
// If not configured, this throws on first use with a clear message.
export const supabase: SupabaseClient = (() => {
  if (configured) return getSupabaseClient()
  // @ts-expect-error - we’re returning a proxy-like minimal object to provide a clearer error
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          "Supabase client accessed but environment is not configured. Missing: " + getMissingSupabaseEnv().join(", "),
        )
      },
    },
  )
})()

// Server-side client for server actions/route handlers only.
// Note: Non-public env vars only work on the server.
export const createServerClient = () => {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url || !serviceRole) {
    throw new Error("Server Supabase is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
  }
  return createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Database types (kept for broader app usage)
export interface Vehicle {
  id: string
  user_id: string
  year: number
  make: string
  model: string
  chassis_code: string | null
  engine: string | null
  transmission: string | null
  body_type: string | null
  mileage: number | null
  vin: string | null
  nickname: string | null
  color: string | null
  purchase_date: string | null
  purchase_price: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MaintenanceRecord {
  id: string
  user_id: string
  vehicle_id: string
  service_type: string
  description: string | null
  date_performed: string
  mileage: number | null
  cost: number | null
  shop_name: string | null
  shop_address: string | null
  parts_used: string[] | null
  labor_hours: number | null
  warranty_months: number | null
  receipt_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MaintenanceReminder {
  id: string
  user_id: string
  vehicle_id: string
  service_type: string
  description: string | null
  due_date: string | null
  due_mileage: number | null
  interval_months: number | null
  interval_miles: number | null
  priority: "low" | "medium" | "high" | "critical"
  is_completed: boolean
  completed_date: string | null
  completed_mileage: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface BMWChassis {
  id: string
  chassis_code: string
  chassis_name: string
  generation: string
  production_start: number
  production_end: number
  body_types: string[]
  engine_codes: string[]
  market_regions: string[]
  created_at: string
}

export interface BMWOEMPart {
  id: string
  part_number: string
  part_name: string
  description: string | null
  category_id: string | null
  superseded_by: string | null
  is_discontinued: boolean
  weight_kg: number | null
  price_msrp: number | null
  diagram_position: string | null
  system_category: string | null
  subsystem_category: string | null
  part_type: string | null
  part_function: string | null
  installation_notes: string | null
  keywords: string[]
  realoem_diagram_url: string | null
  created_at: string
  updated_at: string
}

export interface BMWPartCompatibility {
  id: string
  part_id: string
  chassis_id: string
  production_start: number | null
  production_end: number | null
  engine_codes: string[] | null
  transmission_codes: string[] | null
  body_type_specific: string | null
  market_specific: string[] | null
  installation_position: string | null
  quantity_required: number
  is_optional: boolean
  notes: string | null
  created_at: string
}

export interface ScrapingProgress {
  id: string
  status: "idle" | "running" | "paused" | "completed" | "error"
  started_at: string | null
  completed_at: string | null
  current_chassis: string | null
  current_model: string | null
  current_category: string | null
  chassis_processed: number
  models_processed: number
  categories_processed: number
  parts_processed: number
  total_chassis: number
  total_models: number
  total_categories: number
  estimated_total_parts: number
  parts_per_minute: number
  sessions_completed: number
  total_sessions: number
  estimated_completion: string | null
  errors: string | null
  last_error: string | null
  updated_at: string
}
