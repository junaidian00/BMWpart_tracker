import { supabase } from "./supabase"

export type MaintenanceType =
  | "oil_change"
  | "brake_service"
  | "tire_rotation"
  | "air_filter"
  | "spark_plugs"
  | "coolant_flush"
  | "transmission_service"
  | "suspension"
  | "modification"
  | "repair"
  | "inspection"
  | "other"

export type Vehicle = {
  id: string
  user_id: string
  make: string
  model: string
  year: number
  engine: string
  vin?: string
  nickname?: string
  mileage: number
  created_at: string
  updated_at: string
}

export type MaintenanceRecord = {
  id: string
  vehicle_id: string
  user_id: string
  type: MaintenanceType
  title: string
  description?: string
  cost: number
  mileage: number
  date_performed: string
  next_due_mileage?: number
  next_due_date?: string
  receipt_url?: string
  parts_used?: string[]
  shop_name?: string
  performance_impact?: string
  reliability_notes?: string
  created_at: string
  updated_at: string
}

export type MaintenanceReminder = {
  id: string
  vehicle_id: string
  user_id: string
  type: MaintenanceType
  title: string
  description?: string
  due_mileage?: number
  due_date?: string
  is_completed: boolean
  created_at: string
}

export async function createVehicle(vehicleData: Omit<Vehicle, "id" | "user_id" | "created_at" | "updated_at">) {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession()

  if (authError) {
    console.error("Auth error:", authError)
    throw new Error("Authentication failed")
  }

  if (!session?.user) {
    throw new Error("Not authenticated - please sign in")
  }

  console.log("Creating vehicle for user:", session.user.id)

  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      ...vehicleData,
      user_id: session.user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Vehicle creation error:", error)
    throw error
  }

  return data
}

export async function getUserVehicles() {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession()

  if (authError) {
    console.error("Auth error:", authError)
    throw new Error("Authentication failed")
  }

  if (!session?.user) {
    throw new Error("Not authenticated - please sign in")
  }

  console.log("Getting vehicles for user:", session.user.id)

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Get vehicles error:", error)
    throw error
  }

  return data || []
}

export async function createMaintenanceRecord(
  recordData: Omit<MaintenanceRecord, "id" | "user_id" | "created_at" | "updated_at">,
) {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession()

  if (authError) {
    console.error("Auth error:", authError)
    throw new Error("Authentication failed")
  }

  if (!session?.user) {
    throw new Error("Not authenticated - please sign in")
  }

  const { data, error } = await supabase
    .from("maintenance_records")
    .insert({
      ...recordData,
      user_id: session.user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Maintenance record creation error:", error)
    throw error
  }

  return data
}

export async function getMaintenanceRecords(vehicleId: string) {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession()

  if (authError) {
    console.error("Auth error:", authError)
    throw new Error("Authentication failed")
  }

  if (!session?.user) {
    throw new Error("Not authenticated - please sign in")
  }

  const { data, error } = await supabase
    .from("maintenance_records")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .eq("user_id", session.user.id)
    .order("date_performed", { ascending: false })

  if (error) {
    console.error("Get maintenance records error:", error)
    throw error
  }

  return data || []
}

export async function createMaintenanceReminder(
  reminderData: Omit<MaintenanceReminder, "id" | "user_id" | "created_at">,
) {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession()

  if (authError) {
    console.error("Auth error:", authError)
    throw new Error("Authentication failed")
  }

  if (!session?.user) {
    throw new Error("Not authenticated - please sign in")
  }

  const { data, error } = await supabase
    .from("maintenance_reminders")
    .insert({
      ...reminderData,
      user_id: session.user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Maintenance reminder creation error:", error)
    throw error
  }

  return data
}

export async function getMaintenanceReminders(vehicleId?: string) {
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession()

  if (authError) {
    console.error("Auth error:", authError)
    throw new Error("Authentication failed")
  }

  if (!session?.user) {
    throw new Error("Not authenticated - please sign in")
  }

  // First try without the join to see if basic query works
  let query = supabase
    .from("maintenance_reminders")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("is_completed", false)

  if (vehicleId) {
    query = query.eq("vehicle_id", vehicleId)
  }

  const { data, error } = await query.order("due_date", { ascending: true })

  if (error) {
    console.error("Get maintenance reminders error:", error)
    throw error
  }

  return data || []
}

export async function uploadReceipt(file: File, recordId: string) {
  const fileExt = file.name.split(".").pop()
  const fileName = `${recordId}-${Date.now()}.${fileExt}`
  const filePath = `receipts/${fileName}`

  const { error: uploadError } = await supabase.storage.from("maintenance-receipts").upload(filePath, file)

  if (uploadError) throw uploadError

  const {
    data: { publicUrl },
  } = supabase.storage.from("maintenance-receipts").getPublicUrl(filePath)

  return publicUrl
}
