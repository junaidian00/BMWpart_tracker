"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowLeft, Calendar, DollarSign, Wrench, FileText } from "lucide-react"
import { getVehicleById, getMaintenanceRecords, type Vehicle, type MaintenanceRecord } from "@/lib/maintenance"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ServiceHistoryTimeline } from "@/components/maintenance/service-history-timeline"
import { AddServiceRecordForm } from "@/components/maintenance/add-service-record-form"

export default function VehicleMaintenancePage() {
  const params = useParams()
  const vehicleId = params.id as string
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [serviceRecords, setServiceRecords] = useState<MaintenanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const loadVehicleData = async () => {
      try {
        const [vehicleData, records] = await Promise.all([getVehicleById(vehicleId), getMaintenanceRecords(vehicleId)])

        setVehicle(vehicleData)
        setServiceRecords(records)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load vehicle data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (vehicleId) {
      loadVehicleData()
    }
  }, [vehicleId, toast])

  const handleServiceAdded = (newRecord: MaintenanceRecord) => {
    setServiceRecords((prev) => [newRecord, ...prev])
    setShowAddForm(false)
    toast({
      title: "Service Record Added",
      description: "Your service record has been successfully added.",
    })
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!vehicle) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">Vehicle Not Found</h2>
              <p className="text-muted-foreground mb-4">The requested vehicle could not be found.</p>
              <Link href="/garage">
                <Button>Return to Garage</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  const totalServiceCost = serviceRecords.reduce((sum, record) => sum + (record.cost || 0), 0)
  const lastServiceDate = serviceRecords.length > 0 ? serviceRecords[0].date_performed : null

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/garage">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Garage
            </Button>
          </Link>
        </div>

        {/* Vehicle Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </CardTitle>
                {vehicle.nickname && <p className="text-muted-foreground mt-1">"{vehicle.nickname}"</p>}
              </div>
              <div className="flex gap-2">
                <Link href={`/maintenance/vehicle/${vehicle.id}/parts`}>
                  <Button variant="outline">
                    <Wrench className="h-4 w-4 mr-2" />
                    Parts Catalog
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className="text-sm text-muted-foreground">Chassis Code</span>
                <div className="font-semibold">{vehicle.chassis_code || "Unknown"}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Engine</span>
                <div className="font-semibold">{vehicle.engine}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Transmission</span>
                <div className="font-semibold">{vehicle.transmission || "Unknown"}</div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Current Mileage</span>
                <div className="font-semibold">{vehicle.mileage?.toLocaleString()} mi</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{vehicle.body_type || "Unknown"}</Badge>
              {vehicle.color && <Badge variant="outline">{vehicle.color}</Badge>}
              {vehicle.vin && <Badge variant="outline">VIN: {vehicle.vin.slice(-6)}</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Service Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{serviceRecords.length}</div>
                  <div className="text-sm text-muted-foreground">Service Records</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">${totalServiceCost.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Total Service Cost</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {lastServiceDate ? new Date(lastServiceDate).toLocaleDateString() : "Never"}
                  </div>
                  <div className="text-sm text-muted-foreground">Last Service</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="history">Service History</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service Record
            </Button>
          </div>

          <TabsContent value="history" className="space-y-4">
            {showAddForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>Add Service Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <AddServiceRecordForm
                    vehicleId={vehicleId}
                    onServiceAdded={handleServiceAdded}
                    onCancel={() => setShowAddForm(false)}
                  />
                </CardContent>
              </Card>
            ) : null}

            <ServiceHistoryTimeline records={serviceRecords} />
          </TabsContent>

          <TabsContent value="reminders">
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Maintenance Reminders</h3>
                <p className="text-muted-foreground">Coming soon - set up automatic maintenance reminders</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Service Documents</h3>
                <p className="text-muted-foreground">Upload and manage service receipts and documentation</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  )
}
