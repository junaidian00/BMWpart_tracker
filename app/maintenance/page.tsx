"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { EnhancedPartsLookup } from "@/components/maintenance/enhanced-parts-lookup"

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

// Mock data for when database is not available
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
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [databaseAvailable, setDatabaseAvailable] = useState(false)

  useEffect(() => {
    if (user) {
      fetchData()
    } else {
      // Show demo data for non-authenticated users
      setVehicles(mockVehicles)
      setReminders(mockReminders)
      setRecentRecords(mockRecords)
      setSelectedVehicle(mockVehicles[0])

      const vMap: Record<string, Vehicle> = {}
      mockVehicles.forEach((vehicle) => {
        vMap[vehicle.id] = vehicle
      })
      setVehicleMap(vMap)
      setLoadingData(false)
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      setLoadingData(true)
      setError(null)

      // Test database connectivity
      const { error: testError } = await supabase.from("vehicles").select("id").limit(1)

      if (testError) {
        console.log("Database tables not available, using demo data")
        setDatabaseAvailable(false)
        // Use mock data
        setVehicles(mockVehicles)
        setReminders(mockReminders)
        setRecentRecords(mockRecords)
        setSelectedVehicle(mockVehicles[0])

        const vMap: Record<string, Vehicle> = {}
        mockVehicles.forEach((vehicle) => {
          vMap[vehicle.id] = vehicle
        })
        setVehicleMap(vMap)
        setLoadingData(false)
        return
      }

      setDatabaseAvailable(true)

      // Fetch vehicles
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (vehiclesError) {
        console.error("Error fetching vehicles:", vehiclesError)
        setVehicles(mockVehicles)
      } else {
        const userVehicles = vehiclesData || []
        setVehicles(userVehicles.length > 0 ? userVehicles : mockVehicles)

        // Create vehicle map for lookups
        const vMap: Record<string, Vehicle> = {}
        const vehiclesToMap = userVehicles.length > 0 ? userVehicles : mockVehicles
        vehiclesToMap.forEach((vehicle) => {
          vMap[vehicle.id] = vehicle
        })
        setVehicleMap(vMap)

        // Auto-select first vehicle
        if (vehiclesToMap.length > 0) {
          setSelectedVehicle(vehiclesToMap[0])
        }
      }

      // Fetch reminders
      const { data: remindersData, error: remindersError } = await supabase
        .from("maintenance_reminders")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_completed", false)
        .order("due_date", { ascending: true })
        .limit(5)

      if (remindersError) {
        console.log("Using mock reminders data")
        setReminders(mockReminders)
      } else {
        setReminders(remindersData || mockReminders)
      }

      // Fetch recent records
      const { data: recordsData, error: recordsError } = await supabase
        .from("maintenance_records")
        .select("*")
        .eq("user_id", user.id)
        .order("date_performed", { ascending: false })
        .limit(5)

      if (recordsError) {
        console.log("Using mock records data")
        setRecentRecords(mockRecords)
      } else {
        setRecentRecords(recordsData || mockRecords)
      }
    } catch (error: any) {
      console.log("Database error, using demo data:", error)
      setDatabaseAvailable(false)
      setVehicles(mockVehicles)
      setReminders(mockReminders)
      setRecentRecords(mockRecords)
      setSelectedVehicle(mockVehicles[0])

      const vMap: Record<string, Vehicle> = {}
      mockVehicles.forEach((vehicle) => {
        vMap[vehicle.id] = vehicle
      })
      setVehicleMap(vMap)
    } finally {
      setLoadingData(false)
    }
  }

  const getVehicleForRecord = (vehicleId: string): Vehicle | null => {
    return vehicleMap[vehicleId] || null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto max-w-6xl p-4">
      <div className="mb-8">
        <EnhancedPartsLookup />
      </div>
      {/* You can continue with reminders, recent records, etc. */}
    </main>
  )
}
