"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Car, Settings, Wrench } from "lucide-react"
import { getUserVehicles, type Vehicle } from "@/lib/maintenance"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </CardTitle>
            {vehicle.nickname && <p className="text-sm text-muted-foreground mt-1">"{vehicle.nickname}"</p>}
          </div>
          <div className="flex gap-2">
            <Link href={`/maintenance/vehicle/${vehicle.id}`}>
              <Button variant="outline" size="sm">
                <Wrench className="h-4 w-4 mr-1" />
                Maintenance
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Chassis:</span>
            <div className="font-medium">{vehicle.chassis_code || "Unknown"}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Engine:</span>
            <div className="font-medium">{vehicle.engine}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Transmission:</span>
            <div className="font-medium">{vehicle.transmission || "Unknown"}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Mileage:</span>
            <div className="font-medium">{vehicle.mileage?.toLocaleString()} mi</div>
          </div>
        </div>

        {vehicle.vin && <div className="text-xs text-muted-foreground">VIN: {vehicle.vin}</div>}

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary">{vehicle.body_type || "Unknown"}</Badge>
          {vehicle.color && <Badge variant="outline">{vehicle.color}</Badge>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function GaragePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const userVehicles = await getUserVehicles(user?.id)
        setVehicles(userVehicles)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load vehicles from garage",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [user?.id, toast])

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Garage</h1>
            <p className="text-muted-foreground mt-2">Manage your BMW vehicles and track their maintenance history</p>
          </div>
          <Link href="/maintenance">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No vehicles in your garage</h3>
              <p className="text-muted-foreground mb-6">
                Add your first BMW to start tracking maintenance and service history
              </p>
              <Link href="/maintenance">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Vehicle
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}

        {vehicles.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} in your garage
            </p>
          </div>
        )}
      </div>
    </AuthGuard>
  )
}
