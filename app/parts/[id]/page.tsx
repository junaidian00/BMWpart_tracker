"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Car, Wrench, Calendar, Package, DollarSign, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getPartByNumber, type BMWOEMPart } from "@/lib/oem-parts"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export default function PartDetailPage() {
  const params = useParams()
  const partNumber = params.id as string
  const [part, setPart] = useState<BMWOEMPart | null>(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function loadPart() {
      try {
        const partData = await getPartByNumber(partNumber)
        setPart(partData)
      } catch (error) {
        console.error("Error loading part:", error)
      } finally {
        setLoading(false)
      }
    }

    if (partNumber) {
      loadPart()
    }
  }, [partNumber])

  const handleAddToCart = () => {
    if (part) {
      addItem({
        id: part.part_number,
        partNumber: part.part_number,
        partName: part.part_name,
        price: part.price_msrp || 0,
        category: part.category_name || undefined,
        compatibility: [...(part.compatible_chassis || []), ...(part.compatible_engines || [])],
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!part) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Part not found</h3>
            <p className="text-gray-600 mb-4">The part number {partNumber} could not be found in our catalog.</p>
            <Button asChild>
              <Link href="/browse">Browse All Parts</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/browse">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </Button>

        {/* Part Details */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{part.part_name}</CardTitle>
                <CardDescription className="text-lg">Part Number: {part.part_number}</CardDescription>
              </div>
              {part.category_name && (
                <Badge variant="secondary" className="text-sm">
                  {part.category_name}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {part.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{part.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Compatibility */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Compatibility</h3>
                <div className="space-y-4">
                  {part.compatible_chassis && part.compatible_chassis.length > 0 && (
                    <div>
                      <div className="flex items-center mb-2">
                        <Car className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">Compatible Chassis:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {part.compatible_chassis.map((chassis) => (
                          <Badge key={chassis} variant="outline">
                            {chassis}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {part.compatible_engines && part.compatible_engines.length > 0 && (
                    <div>
                      <div className="flex items-center mb-2">
                        <Wrench className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">Compatible Engines:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {part.compatible_engines.map((engine) => (
                          <Badge key={engine} variant="outline">
                            {engine}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {part.earliest_year && part.latest_year && (
                    <div>
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">Production Years:</span>
                      </div>
                      <Badge variant="outline">
                        {part.earliest_year} - {part.latest_year === 2024 ? "Present" : part.latest_year}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing and Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Pricing & Purchase</h3>
                <div className="space-y-4">
                  {part.price_msrp ? (
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-3xl font-bold text-green-600">${part.price_msrp.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 ml-2">MSRP</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-lg text-gray-500">Price on request</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={!part.price_msrp}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      Request Quote
                    </Button>
                  </div>

                  {part.is_discontinued && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> This part has been discontinued by BMW.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Part Number:</span>
                  <p className="font-mono">{part.part_number}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Category:</span>
                  <p>{part.category_name || "Not specified"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p>{part.is_discontinued ? "Discontinued" : "Available"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Parts */}
        <Card>
          <CardHeader>
            <CardTitle>Related Parts</CardTitle>
            <CardDescription>Other parts that might be compatible with your vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Package className="h-8 w-8 mx-auto mb-2" />
              <p>Related parts will be shown here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
