import { toast } from "@/hooks/use-toast"

export interface OfflineUser {
  id: string
  email: string
  created_at: string
  user_metadata?: {
    full_name?: string
  }
}

export class OfflineAuthSystem {
  private static STORAGE_KEY = "bmw_parts_offline_user"
  private static VEHICLES_KEY = "bmw_parts_offline_vehicles"
  private static SERVICES_KEY = "bmw_parts_offline_services"

  static getCurrentUser(): OfflineUser | null {
    if (typeof window === "undefined") return null

    try {
      const userData = localStorage.getItem(this.STORAGE_KEY)
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  static async signIn(email: string, password: string): Promise<OfflineUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    const user: OfflineUser = {
      id: `offline_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
      user_metadata: {
        full_name: "Demo User",
      },
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    toast({
      title: "Demo Mode",
      description: "Signed in with offline demo account. Data will be stored locally.",
    })

    return user
  }

  static async signUp(email: string, password: string, fullName?: string): Promise<OfflineUser> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple validation
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }

    const user: OfflineUser = {
      id: `offline_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
      user_metadata: {
        full_name: fullName || "Demo User",
      },
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    toast({
      title: "Demo Account Created",
      description: "Account created in demo mode. Data will be stored locally.",
    })

    return user
  }

  static signOut(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    toast({
      title: "Signed Out",
      description: "You have been signed out of demo mode.",
    })
  }

  static saveVehicle(vehicle: any): void {
    const vehicles = this.getVehicles()
    vehicles.push({ ...vehicle, id: `vehicle_${Date.now()}`, created_at: new Date().toISOString() })
    localStorage.setItem(this.VEHICLES_KEY, JSON.stringify(vehicles))
  }

  static getVehicles(): any[] {
    if (typeof window === "undefined") return []

    try {
      const vehicles = localStorage.getItem(this.VEHICLES_KEY)
      return vehicles ? JSON.parse(vehicles) : []
    } catch {
      return []
    }
  }

  static saveServiceRecord(vehicleId: string, service: any): void {
    const services = this.getServiceRecords()
    services.push({
      ...service,
      id: `service_${Date.now()}`,
      vehicle_id: vehicleId,
      created_at: new Date().toISOString(),
    })
    localStorage.setItem(this.SERVICES_KEY, JSON.stringify(services))
  }

  static getServiceRecords(vehicleId?: string): any[] {
    if (typeof window === "undefined") return []

    try {
      const services = localStorage.getItem(this.SERVICES_KEY)
      const allServices = services ? JSON.parse(services) : []
      return vehicleId ? allServices.filter((s: any) => s.vehicle_id === vehicleId) : allServices
    } catch {
      return []
    }
  }
}
