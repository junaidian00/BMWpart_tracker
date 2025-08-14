import { supabase, isSupabaseConfigured } from "./supabase"
import type { Vehicle, MaintenanceRecord, MaintenanceReminder } from "./supabase"

// Fallback data for when Supabase is not configured
const fallbackVehicles: Vehicle[] = [
  {
    id: "1",
    user_id: "demo-user",
    year: 2015,
    make: "BMW",
    model: "328i",
    chassis_code: "F30",
    engine: "N20B20",
    transmission: "Automatic",
    body_type: "Sedan",
    mileage: 85000,
    vin: "WBA3A5G59ENS12345",
    nickname: "Daily Driver",
    color: "Alpine White",
    purchase_date: "2018-03-15",
    purchase_price: 22500,
    notes: "Well maintained, all service records available",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    user_id: "demo-user",
    year: 2016,
    make: "BMW",
    model: "M235i",
    chassis_code: "F22",
    engine: "N55B30",
    transmission: "Manual",
    body_type: "Coupe",
    mileage: 45000,
    vin: "WBA2A9C51GV123456",
    nickname: "Weekend Warrior",
    color: "Mineral Grey",
    purchase_date: "2020-06-10",
    purchase_price: 28900,
    notes: "Performance modifications: intake, exhaust",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const fallbackMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: "1",
    user_id: "demo-user",
    vehicle_id: "1",
    service_type: "Oil Change",
    description: "Full synthetic oil change with filter replacement",
    date_performed: "2024-01-15",
    mileage: 85000,
    cost: 89.99,
    shop_name: "BMW Service Center",
    shop_address: "123 Main St, City, State",
    parts_used: ["Engine Oil 5W-30", "Oil Filter"],
    labor_hours: 0.5,
    warranty_months: 6,
    receipt_url: null,
    notes: "Used BMW approved oil",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    user_id: "demo-user",
    vehicle_id: "2",
    service_type: "Brake Service",
    description: "Front brake pad and rotor replacement",
    date_performed: "2024-01-10",
    mileage: 45000,
    cost: 650.0,
    shop_name: "Independent BMW Specialist",
    shop_address: "456 Oak Ave, City, State",
    parts_used: ["Front Brake Pads", "Front Rotors"],
    labor_hours: 2.5,
    warranty_months: 12,
    receipt_url: null,
    notes: "Upgraded to performance pads",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
]

const fallbackReminders: MaintenanceReminder[] = [
  {
    id: "1",
    user_id: "demo-user",
    vehicle_id: "1",
    service_type: "Oil Change",
    description: "Next oil change due",
    due_date: "2024-07-15",
    due_mileage: 90000,
    interval_months: 6,
    interval_miles: 5000,
    priority: "medium",
    is_completed: false,
    completed_date: null,
    completed_mileage: null,
    notes: "Use BMW approved 5W-30 oil",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    user_id: "demo-user",
    vehicle_id: "2",
    service_type: "Inspection",
    description: "Annual safety inspection",
    due_date: "2024-06-10",
    due_mileage: null,
    interval_months: 12,
    interval_miles: null,
    priority: "high",
    is_completed: false,
    completed_date: null,
    completed_mileage: null,
    notes: "Required for registration renewal",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export async function getUserVehicles(userId?: string): Promise<Vehicle[]> {
  if (!isSupabaseConfigured || !userId) {
    return fallbackVehicles
  }

  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || fallbackVehicles
  } catch (error) {
    console.error("Error fetching user vehicles:", error)
    return fallbackVehicles
  }
}

export async function getVehicleById(vehicleId: string): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) {
    return fallbackVehicles.find((v) => v.id === vehicleId) || null
  }

  try {
    const { data, error } = await supabase.from("vehicles").select("*").eq("id", vehicleId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return fallbackVehicles.find((v) => v.id === vehicleId) || null
  }
}

export async function getMaintenanceRecords(vehicleId: string): Promise<MaintenanceRecord[]> {
  if (!isSupabaseConfigured) {
    return fallbackMaintenanceRecords.filter((r) => r.vehicle_id === vehicleId)
  }

  try {
    const { data, error } = await supabase
      .from("maintenance_records")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("date_performed", { ascending: false })

    if (error) throw error
    return data || fallbackMaintenanceRecords.filter((r) => r.vehicle_id === vehicleId)
  } catch (error) {
    console.error("Error fetching maintenance records:", error)
    return fallbackMaintenanceRecords.filter((r) => r.vehicle_id === vehicleId)
  }
}

export async function getMaintenanceReminders(vehicleId: string): Promise<MaintenanceReminder[]> {
  if (!isSupabaseConfigured) {
    return fallbackReminders.filter((r) => r.vehicle_id === vehicleId)
  }

  try {
    const { data, error } = await supabase
      .from("maintenance_reminders")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .eq("is_completed", false)
      .order("due_date", { ascending: true })

    if (error) throw error
    return data || fallbackReminders.filter((r) => r.vehicle_id === vehicleId)
  } catch (error) {
    console.error("Error fetching maintenance reminders:", error)
    return fallbackReminders.filter((r) => r.vehicle_id === vehicleId)
  }
}

export async function addVehicle(vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">): Promise<Vehicle> {
  if (!isSupabaseConfigured) {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newVehicle
  }

  try {
    const { data, error } = await supabase.from("vehicles").insert([vehicle]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error adding vehicle:", error)
    throw error
  }
}

export type CreateVehicleInput = {
  make: string
  model: string
  year: number
  engine: string
  vin?: string
  nickname?: string
  mileage: number
}

/**
 * Lightweight chassis inference for common BMW models.
 * You can refine this as you expand supported models/years.
 */
function inferChassisCode(model: string, year: number): string {
  const m = model.toLowerCase()
  // 3 Series
  if (
    year >= 2012 &&
    year <= 2019 &&
    (m.includes("320") ||
      m.includes("325") ||
      m.includes("328") ||
      m.includes("330") ||
      m.includes("335") ||
      m.includes("340") ||
      m === "m3")
  ) {
    return "F30"
  }
  if (year >= 2019 && (m.includes("320") || m.includes("330") || m.includes("340") || m === "m3")) {
    return "G20"
  }
  // 2 Series
  if (
    year >= 2014 &&
    year <= 2021 &&
    (m.includes("228") || m.includes("230") || m.includes("235") || m.includes("240") || m === "m2")
  ) {
    return "F22"
  }
  if (year >= 2022 && (m.includes("230") || m.includes("240") || m === "m2")) {
    return "G42"
  }
  // X Series quick hints
  if (m.startsWith("x1")) return year >= 2015 ? "F48" : "E84"
  if (m.startsWith("x3")) return year >= 2017 ? "G01" : "F25"
  if (m.startsWith("x5")) return year >= 2019 ? "G05" : "F15"

  return "Unknown"
}

/**
 * Create a vehicle from the minimal Add Vehicle form.
 * Fills missing Vehicle fields with safe defaults and uses Supabase when available.
 */
export async function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  // Resolve user id if Supabase is configured; otherwise use demo-user
  let userId = "demo-user"
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.auth.getUser()
      if (data?.user?.id) {
        userId = data.user.id
      }
    } catch (e) {
      console.warn("createVehicle: could not resolve user from Supabase auth; using demo-user fallback")
    }
  }

  const vehicleToInsert: Omit<Vehicle, "id" | "created_at" | "updated_at"> = {
    user_id: userId,
    year: input.year,
    make: input.make || "BMW",
    model: input.model,
    engine: input.engine,
    mileage: input.mileage,
    vin: input.vin ?? "",
    nickname: input.nickname ?? "",
  }

  // If Supabase isn't configured or we're in demo mode, return a locally created record
  if (!isSupabaseConfigured || userId === "demo-user") {
    const now = new Date().toISOString()
    const newVehicle: Vehicle = {
      ...vehicleToInsert,
      id: Date.now().toString(),
      created_at: now,
      updated_at: now,
    }
    return newVehicle
  }

  // Persist via existing addVehicle helper
  try {
    const created = await addVehicle(vehicleToInsert)
    return created
  } catch (error) {
    console.error("Error creating vehicle via Supabase, returning local fallback:", error)
    const now = new Date().toISOString()
    return {
      ...vehicleToInsert,
      id: Date.now().toString(),
      created_at: now,
      updated_at: now,
    }
  }
}

export async function addMaintenanceRecord(
  record: Omit<MaintenanceRecord, "id" | "created_at" | "updated_at">,
): Promise<MaintenanceRecord> {
  if (!isSupabaseConfigured) {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newRecord
  }

  try {
    const { data, error } = await supabase.from("maintenance_records").insert([record]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error adding maintenance record:", error)
    throw error
  }
}

export async function addMaintenanceReminder(
  reminder: Omit<MaintenanceReminder, "id" | "created_at" | "updated_at">,
): Promise<MaintenanceReminder> {
  if (!isSupabaseConfigured) {
    const newReminder: MaintenanceReminder = {
      ...reminder,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newReminder
  }

  try {
    const { data, error } = await supabase.from("maintenance_reminders").insert([reminder]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error adding maintenance reminder:", error)
    throw error
  }
}

export async function checkDatabaseHealth(): Promise<{
  connected: boolean
  tablesExist: boolean
  error?: string
}> {
  if (!isSupabaseConfigured) {
    return { connected: false, tablesExist: false, error: "Supabase not configured" }
  }

  try {
    // Test basic connection and table existence
    const { data, error } = await supabase.from("vehicles").select("count", { count: "exact", head: true })

    if (error) {
      return { connected: true, tablesExist: false, error: error.message }
    }

    return { connected: true, tablesExist: true }
  } catch (error: any) {
    return { connected: false, tablesExist: false, error: error.message }
  }
}

export type { Vehicle, MaintenanceRecord, MaintenanceReminder } from "./supabase"
