"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Package, DollarSign, AlertTriangle, CheckCircle, ExternalLink, ShoppingCart } from "lucide-react"
import { getVehicleSpecificParts, getPartCategories, type BMWOEMPart, type BMWPartCategory } from "@/lib/oem-parts"
import type { Vehicle } from "@/lib/maintenance"
import Link from "next/link"

interface PartsLookupProps {
  vehicle: Vehicle
  onPartSelect?: (part: BMWOEMPart) => void
}

export function PartsLookup({ vehicle, onPartSelect }: PartsLookupProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [parts, setParts] = useState<BMWOEMPart[]>([])
  const [categories, setCategories] = useState<BMWPartCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCategories()
    if (vehicle) {
      searchParts()
    }
  }, [vehicle])

  const loadCategories = async () => {
    try {
      const categoriesData = await getPartCategories()
      setCategories(categoriesData)
    } catch (err: any) {
      console.error("Error loading categories:", err)
    }
  }

  const searchParts = async () => {
    if (!vehicle) return

    setLoading(true)
    setError("")

    try {
      const results = await getVehicleSpecificParts(
        vehicle.year,
        vehicle.make,
        vehicle.model,
        vehicle.engine || undefined,
        selectedCategory === "all" ? undefined : selectedCategory,
        searchQuery || undefined,
      )
      setParts(results)
    } catch (err: any) {
      setError(err.message || "Error searching parts")
      setParts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    searchParts()
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    searchParts()
  }

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            BMW Parts Lookup
          </CardTitle>
          <CardDescription>
            Find compatible OEM parts for your {vehicle.year} {vehicle.make} {vehicle.model}
            {vehicle.chassis_code && ` (${vehicle.chassis_code})`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Parts</label>
              <Input
                placeholder="e.g., oil filter, brake pads, spark plugs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.category_code}>
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search Parts
            </Button>
            <Button variant="outline" onClick={clearSearch}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {parts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compatible Parts ({parts.length})</CardTitle>
            <CardDescription>OEM parts compatible with your vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{part.part_name}</h4>
                      {part.is_discontinued && (
                        <Badge variant="destructive">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Discontinued
                        </Badge>
                      )}
                    </div>

                    <p className="text-blue-600 font-mono text-sm mb-1">Part #: {part.part_number}</p>

                    {part.description && <p className="text-gray-600 text-sm mb-2">{part.description}</p>}

                    {/* Compatibility */}
                    <div className="space-y-1 mb-2">
                      {Array.isArray(part.compatible_chassis) && part.compatible_chassis.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Chassis:</span>
                          <div className="flex flex-wrap gap-1">
                            {part.compatible_chassis.slice(0, 4).map((c) => (
                              <Badge key={c} variant="outline" className="text-xs">
                                {c}
                              </Badge>
                            ))}
                            {part.compatible_chassis.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{part.compatible_chassis.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      {Array.isArray(part.compatible_engines) && part.compatible_engines.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Engines:</span>
                          <div className="flex flex-wrap gap-1">
                            {part.compatible_engines.slice(0, 4).map((e) => (
                              <Badge key={e} variant="outline" className="text-xs">
                                {e}
                              </Badge>
                            ))}
                            {part.compatible_engines.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{part.compatible_engines.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {part.category && <Badge variant="outline">{part.category.category_name}</Badge>}
                      {part.price_msrp && (
                        <Badge variant="outline" className="text-green-600">
                          <DollarSign className="mr-1 h-3 w-3" />${part.price_msrp.toFixed(2)} MSRP
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {onPartSelect && (
                      <Button
                        size="sm"
                        onClick={() => onPartSelect(part)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Select
                      </Button>
                    )}

                    <Link href={`/browse?part_number=${part.part_number}`}>
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Find Sellers
                      </Button>
                    </Link>

                    <Link href={`/oem-catalog/part/${part.part_number}`}>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {!loading && parts.length === 0 && (searchQuery || selectedCategory !== "all") && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No parts found</h3>
            <p className="text-gray-600 mb-4">No compatible parts found for your search criteria.</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Try different search terms</p>
              <p>• Check if your vehicle information is correct</p>
              <p>• Browse all categories</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Searching compatible parts...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
