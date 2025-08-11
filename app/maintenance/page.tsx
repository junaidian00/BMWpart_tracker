"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import MaintenanceClient from "./maintenance-client"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

interface Vehicle {
  id: string
  year: number
  make: string
  model: string
  chassis_code: string | null
  engine: string | null
  mileage: number | null
  nickname: string | null
}

interface MaintenanceReminder {
  id: string
  vehicle_id: string
  service_type: string
  description: string
  due_date: string | null
  due_mileage: number | null
  is_completed: boolean
}

interface MaintenanceRecord {
  id: string
  vehicle_id: string
  service_type: string
  description: string
  date_performed: string
  mileage: number | null
  cost: number | null
  shop_name: string | null
}

// Mock data for demo mode
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    year: 2018,
    make: "BMW",
    model: "330i",
    chassis_code: "F30",
    engine: "B48",
    mileage: 45000,
    nickname: "Daily Driver",
  },
  {
    id: "2",
    year: 2020,
    make: "BMW",
    model: "M240i",
    chassis_code: "F22",
    engine: "B58",
    mileage: 28000,
    nickname: "Weekend Car",
  },
]

const mockReminders: MaintenanceReminder[] = [
  {
    id: "1",
    vehicle_id: "1",
    service_type: "Oil Change",
    description: "Engine oil and filter replacement",
    due_date: "2024-02-15",
    due_mileage: 50000,
    is_completed: false,
  },
  {
    id: "2",
    vehicle_id: "2",
    service_type: "Brake Inspection",
    description: "Front and rear brake inspection",
    due_date: "2024-03-01",
    due_mileage: null,
    is_completed: false,
  },
]

const mockRecords: MaintenanceRecord[] = [
  {
    id: "1",
    vehicle_id: "1",
    service_type: "Oil Change",
    description: "Full synthetic oil change with filter",
    date_performed: "2024-01-15",
    mileage: 43000,
    cost: 89.99,
    shop_name: "BMW Service Center",
  },
]

export default function MaintenancePage() {
  const { user, loading } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [reminders, setReminders] = useState<MaintenanceReminder[]>([])
  const [recentRecords, setRecentRecords] = useState<MaintenanceRecord[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [vehicleMap, setVehicleMap] = useState<Record<string, Vehicle>>({})
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    if (loading) return
    if (!isSupabaseConfigured || !user) {
      // Demo mode or not signed in
      setVehicles(mockVehicles)
      setReminders(mockReminders)
      setRecentRecords(mockRecords)
      setSelectedVehicle(mockVehicles[0])
      const vMap: Record<string, Vehicle> = {}
      mockVehicles.forEach((v) => (vMap[v.id] = v))
      setVehicleMap(vMap)
      setLoadingData(false)
      return
    }
    fetchData()
  }, [user, loading])

  const fetchData = async () => {
    if (!isSupabaseConfigured || !user) return

    try {
      setLoadingData(true)

      // Fetch vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      const vehiclesToUse = vehiclesError ? mockVehicles : (vehiclesData as any as Vehicle[]) || mockVehicles
      setVehicles(vehiclesToUse)

      // Build map and auto-select
      const vMap: Record<string, Vehicle> = {}
      vehiclesToUse.forEach((v) => (vMap[v.id] = v))
      setVehicleMap(vMap)
      setSelectedVehicle(vehiclesToUse[0] || null)

      // Reminders
      const { data: remindersData, error: remindersError } = await supabase
        .from("maintenance_reminders")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .order("due_date", { ascending: true })
        .limit(5)

      setReminders(remindersError ? mockReminders : (remindersData as any) || mockReminders)

      // Records
      const { data: recordsData, error: recordsError } = await supabase
        .from("maintenance_records")
        .select("*")
        .eq("user_id", user.id)
        .order("date_performed", { ascending: false })
        .limit(5)

      setRecentRecords(recordsError ? mockRecords : (recordsData as any) || mockRecords)
    } catch {
      // Fallback to demo data on any failure
      setVehicles(mockVehicles)
      setReminders(mockReminders)
      setRecentRecords(mockRecords)
      setSelectedVehicle(mockVehicles[0])
      const vMap: Record<string, Vehicle> = {}
      mockVehicles.forEach((v) => (vMap[v.id] = v))
      setVehicleMap(vMap)
    } finally {
      setLoadingData(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Maintenance</h1>
      <MaintenanceClient />
    </main>
  )
}
