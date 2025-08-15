"use client"

import { useState, useEffect } from "react"
import { HierarchicalCarSelector, type CarSelection } from "@/components/maintenance/hierarchical-car-selector"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { addVehicleToGarage, getGarageVehicles, type GarageVehicle } from "@/lib/garage"
import { Car, Wrench, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { DatabaseStatus } from "@/components/maintenance/database-status"

interface OfflineUser {
  id: string
  email: string
  name?: string
  createdAt: string
}

function getCurrentUser(): OfflineUser | null {
  if (typeof window === "undefined") return null

  try {
    const userStr = localStorage.getItem("offline_auth_user")
    if (!userStr) return null

    const user = JSON.parse(userStr)
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

function GarageVehicleCard({ vehicle }: { vehicle: GarageVehicle }) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold">
              {vehicle.year} {vehicle.model}
            </h3>
            {vehicle.nickname && <p className="text-sm text-muted-foreground">"{vehicle.nickname}"</p>}
          </div>
          <Link href={`/maintenance/vehicle/${vehicle.id}`}>
            <Button variant="outline" size="sm">
              <Wrench className="h-4 w-4 mr-1" />
              Service
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{vehicle.chassis_code}</Badge>
          <Badge variant="outline">{vehicle.engine}</Badge>
          <Badge variant="outline">{vehicle.mileage?.toLocaleString()} mi</Badge>
        </div>

        <div className="text-xs text-muted-foreground">Added {new Date(vehicle.created_at).toLocaleDateString()}</div>
      </CardContent>
    </Card>
  )
}

export default function MaintenanceClient() {
  const [selection, setSelection] = useState<CarSelection>({})
  const [garageVehicles, setGarageVehicles] = useState<GarageVehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingGarage, setLoadingGarage] = useState(true)
  const [user, setUser] = useState<OfflineUser | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser()
      setUser(currentUser)
    }

    checkAuth()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "offline_auth_user") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    const interval = setInterval(checkAuth, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const loadGarageVehicles = async () => {
      if (!user?.id) {
        setLoadingGarage(false)
        return
      }

      try {
        const vehicles = await getGarageVehicles(user.id)
        setGarageVehicles(vehicles)
      } catch (error) {
        console.error("Failed to load garage vehicles:", error)
      } finally {
        setLoadingGarage(false)
      }
    }

    loadGarageVehicles()
  }, [user?.id])

  const handleAddToGarage = async (vehicleSelection: CarSelection) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add vehicles to your garage.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const newVehicle = await addVehicleToGarage(vehicleSelection, user.id)

      setGarageVehicles((prev) => [newVehicle, ...prev])

      toast({
        title: "Vehicle Added to Garage",
        description: `${vehicleSelection.year} ${vehicleSelection.modelName} (${vehicleSelection.chassisCode}) has been added to your garage.`,
      })

      setSelection({})
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add vehicle to garage. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <DatabaseStatus />

      {!user && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <LogIn className="h-5 w-5" />
              Sign In Required
            </CardTitle>
            <CardDescription className="text-blue-700">
              Sign in to your account to add vehicles to your garage and track maintenance history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link href="/auth/sign-in">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/sign-up">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add Vehicle to Garage</CardTitle>
          <CardDescription>
            {user
              ? "Select your BMW to add it to your garage and track maintenance history."
              : "Sign in to add vehicles to your garage and track maintenance history."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HierarchicalCarSelector
            value={selection}
            onSelectionChange={setSelection}
            showTitle={false}
            showAddToGarage={true}
            onAddToGarage={handleAddToGarage}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                My Garage
              </CardTitle>
              <CardDescription>
                {garageVehicles.length} vehicle{garageVehicles.length !== 1 ? "s" : ""} in your garage
              </CardDescription>
            </div>
            <Link href="/garage">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loadingGarage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : garageVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No vehicles in your garage yet</p>
              <p className="text-sm text-muted-foreground">Add your first BMW above to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {garageVehicles.slice(0, 4).map((vehicle) => (
                <GarageVehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
