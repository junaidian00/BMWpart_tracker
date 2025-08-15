"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Car, Wrench, Package, BookOpen, ShoppingCart } from "lucide-react"
import { getUserVehicles, type Vehicle } from "@/lib/maintenance"
import { getPartsByDiagramSection, type BMWOEMPart } from "@/lib/vehicle-parts"
import Link from "next/link"

const diagramSections = [
  { id: "Engine", name: "Engine", icon: "🔧", description: "Engine components and accessories" },
  { id: "Body", name: "Body", icon: "🚗", description: "Body panels and exterior parts" },
  { id: "Interior", name: "Interior", icon: "🪑", description: "Interior components and trim" },
  { id: "Electrical", name: "Electrical", icon: "⚡", description: "Electrical components and wiring" },
  { id: "Brakes", name: "Brakes", icon: "🛑", description: "Brake system components" },
  { id: "Suspension", name: "Suspension", icon: "🏎️", description: "Suspension and steering parts" },
  { id: "Transmission", name: "Transmission", icon: "⚙️", description: "Transmission and drivetrain" },
  { id: "Cooling", name: "Cooling", icon: "❄️", description: "Cooling system components" },
]

export default function VehiclePartsPage() {
  const params = useParams()
  const vehicleId = params.id as string

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [parts, setParts] = useState<BMWOEMPart[]>([])
  const [selectedSection, setSelectedSection] = useState<string>("Engine")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadVehicleAndParts()
  }, [vehicleId, selectedSection])

  const loadVehicleAndParts = async () => {
    try {
      const vehicles = await getUserVehicles()
      const currentVehicle = vehicles.find((v) => v.id === vehicleId)

      if (!currentVehicle) {
        setError("Vehicle not found")
        return
      }

      setVehicle(currentVehicle)

      // Load parts for the selected diagram section
      const sectionParts = await getPartsByDiagramSection(currentVehicle, selectedSection)
      setParts(sectionParts)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading vehicle parts...</div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!vehicle) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertDescription>{error || "Vehicle not found"}</AlertDescription>
            </Alert>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <MainNav />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/maintenance/vehicle/${vehicle.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vehicle
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Parts Catalog - {vehicle.nickname || `${vehicle.year} ${vehicle.model}`}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                {vehicle.year} {vehicle.make} {vehicle.model}
              </div>
              <Badge variant="outline">{vehicle.engine}</Badge>
              <span>{vehicle.mileage.toLocaleString()} miles</span>
            </div>
          </div>

          {/* RealOEM-style diagram sections */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Parts Diagram Sections
              </CardTitle>
              <CardDescription>Browse parts by system, just like BMW RealOEM diagrams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {diagramSections.map((section) => (
                  <Card
                    key={section.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedSection === section.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{section.icon}</div>
                      <div className="font-semibold text-sm">{section.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{section.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parts for selected section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                {selectedSection} Parts for {vehicle.year} {vehicle.model}
              </CardTitle>
              <CardDescription>{diagramSections.find((s) => s.id === selectedSection)?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {parts.length > 0 ? (
                <div className="grid gap-4">
                  {parts.map((part) => (
                    <Card key={part.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{part.part_name}</h4>
                            <p className="text-blue-600 font-mono text-sm mb-2">Part #: {part.part_number}</p>
                            {part.description && <p className="text-gray-600 text-sm mb-2">{part.description}</p>}
                          </div>
                          <div className="text-right">
                            {part.price_msrp && (
                              <div className="text-lg font-bold text-green-600">${part.price_msrp.toFixed(2)} MSRP</div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {part.category && <Badge variant="secondary">{part.category.category_name}</Badge>}
                          {part.is_discontinued && <Badge variant="destructive">Discontinued</Badge>}
                          {part.superseded_by && <Badge variant="outline">Superseded by {part.superseded_by}</Badge>}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/oem-catalog/part/${part.part_number}`}>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <BookOpen className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/browse?part_number=${part.part_number}`}>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Find Sellers
                            </Button>
                          </Link>
                          <Button size="sm">Add to Maintenance</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No parts found</h3>
                  <p className="text-gray-600">
                    No {selectedSection.toLowerCase()} parts found for your {vehicle.year} {vehicle.model}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
