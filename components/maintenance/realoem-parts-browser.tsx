"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Car,
  Wrench,
  Plus,
  ShoppingCart,
  Grid,
  List,
  Info,
  Loader2,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Settings,
  Zap,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Vehicle } from "@/lib/maintenance"
import Link from "next/link"
import Image from "next/image"

interface RealOEMPart {
  id: string
  part_number: string
  part_name: string
  description: string | null
  category_name: string
  price_msrp: number | null
  is_discontinued: boolean
  superseded_by: string | null
  diagram_position: string | null
  installation_notes: string | null
  compatible_models: string[]
  compatible_engines: string[]
  earliest_year: number
  latest_year: number
  diagram_image_url?: string
  realoem_url?: string
}

interface RealOEMPartsBrowserProps {
  vehicles: Vehicle[]
}

export function RealOEMPartsBrowser({ vehicles }: RealOEMPartsBrowserProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [partNumber, setPartNumber] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSeries, setSelectedSeries] = useState("all")
  const [selectedEngine, setSelectedEngine] = useState("all")
  const [yearFrom, setYearFrom] = useState("")
  const [yearTo, setYearTo] = useState("")
  const [includeDiscontinued, setIncludeDiscontinued] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [parts, setParts] = useState<RealOEMPart[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [series, setSeries] = useState<any[]>([])
  const [engines, setEngines] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage] = useState(50)
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    loadInitialData()
    loadRecentSearches()
    loadFavorites()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)

      // Load categories
      const { data: categoriesData } = await supabase.from("bmw_part_categories").select("*").order("category_name")

      // Load BMW series
      const { data: seriesData } = await supabase.from("bmw_series").select("*").order("series_code")

      // Load available engines
      const { data: enginesData } = await supabase
        .from("bmw_model_variants")
        .select("engine_code")
        .not("engine_code", "is", null)

      setCategories(categoriesData || [])
      setSeries(seriesData || [])
      setEngines([...new Set(enginesData?.map((e) => e.engine_code) || [])])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentSearches = () => {
    const saved = localStorage.getItem("bmw-recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem("bmw-favorite-parts")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem("bmw-recent-searches", JSON.stringify(updated))
  }

  const toggleFavorite = (partNumber: string) => {
    const updated = favorites.includes(partNumber)
      ? favorites.filter((f) => f !== partNumber)
      : [...favorites, partNumber]

    setFavorites(updated)
    localStorage.setItem("bmw-favorite-parts", JSON.stringify(updated))
  }

  const searchParts = useCallback(
    async (page = 1) => {
      setLoading(true)
      setError("")

      try {
        let query = supabase.from("bmw_parts_search_view").select("*", { count: "exact" })

        // Apply filters
        if (searchQuery.trim()) {
          query = query.textSearch("search_vector", searchQuery.trim())
          saveRecentSearch(searchQuery.trim())
        }

        if (partNumber.trim()) {
          query = query.eq("part_number", partNumber.trim())
        }

        if (selectedCategory !== "all") {
          query = query.eq("category_code", selectedCategory)
        }

        if (selectedSeries !== "all") {
          query = query.contains("compatible_series", [selectedSeries])
        }

        if (selectedEngine !== "all") {
          query = query.contains("compatible_engines", [selectedEngine])
        }

        if (yearFrom) {
          query = query.gte("latest_year", Number.parseInt(yearFrom))
        }

        if (yearTo) {
          query = query.lte("earliest_year", Number.parseInt(yearTo))
        }

        if (!includeDiscontinued) {
          query = query.eq("is_discontinued", false)
        }

        if (priceRange.min) {
          query = query.gte("price_msrp", Number.parseFloat(priceRange.min))
        }

        if (priceRange.max) {
          query = query.lte("price_msrp", Number.parseFloat(priceRange.max))
        }

        // Vehicle-specific filtering
        if (selectedVehicle) {
          const vehicleSeries = selectedVehicle.model.split(" ")[0] // Extract series from model
          query = query.contains("compatible_series", [vehicleSeries])

          if (selectedVehicle.engine) {
            query = query.contains("compatible_engines", [selectedVehicle.engine])
          }

          query = query.lte("earliest_year", selectedVehicle.year)
          query = query.gte("latest_year", selectedVehicle.year)
        }

        // Pagination
        const offset = (page - 1) * resultsPerPage
        query = query.range(offset, offset + resultsPerPage - 1)

        // Execute query
        const { data, error: queryError, count } = await query.order("part_name")

        if (queryError) throw queryError

        setParts(data || [])
        setTotalResults(count || 0)
        setCurrentPage(page)

        // Generate search suggestions if no results
        if (!data || data.length === 0) {
          generateSearchSuggestions()
        }
      } catch (err: any) {
        setError(err.message)
        setParts([])
        setTotalResults(0)
      } finally {
        setLoading(false)
      }
    },
    [
      searchQuery,
      partNumber,
      selectedCategory,
      selectedSeries,
      selectedEngine,
      yearFrom,
      yearTo,
      includeDiscontinued,
      priceRange,
      selectedVehicle,
      resultsPerPage,
    ],
  )

  const generateSearchSuggestions = () => {
    const suggestions = [
      "Try searching by part number (e.g., 11427566327)",
      "Search by category (e.g., oil filter, brake pads)",
      "Include BMW model (e.g., F30 oil filter)",
      "Try engine code (e.g., N55 spark plugs)",
      "Check if discontinued parts are included",
      "Broaden your year range",
      "Try more general terms (e.g., filter instead of oil filter)",
    ]

    setSearchSuggestions(suggestions.slice(0, 4))
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setPartNumber("")
    setSelectedCategory("all")
    setSelectedSeries("all")
    setSelectedEngine("all")
    setYearFrom("")
    setYearTo("")
    setIncludeDiscontinued(false)
    setPriceRange({ min: "", max: "" })
    setSelectedVehicle(null)
    setParts([])
    setTotalResults(0)
    setCurrentPage(1)
    setSearchSuggestions([])
  }

  const exportResults = () => {
    const csvContent = [
      ["Part Number", "Part Name", "Category", "Price", "Compatible Models", "Years"].join(","),
      ...parts.map((part) =>
        [
          part.part_number,
          `"${part.part_name}"`,
          part.category_name,
          part.price_msrp || "",
          `"${part.compatible_models.join("; ")}"`,
          `${part.earliest_year}-${part.latest_year}`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bmw-parts-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalPages = Math.ceil(totalResults / resultsPerPage)

  return (
    <div className="space-y-6">
      {/* Header with RealOEM branding */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">RealOEM BMW Parts Database</CardTitle>
                <CardDescription className="text-blue-700">
                  Complete BMW parts catalog with diagrams, compatibility, and pricing from RealOEM.com
                </CardDescription>
              </div>
            </div>
            <Image
              src="/images/realoem-homepage.png"
              alt="RealOEM"
              width={100}
              height={60}
              className="rounded-lg shadow-sm"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">500K+</div>
            <div className="text-sm text-gray-600">BMW Parts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Car className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">200+</div>
            <div className="text-sm text-gray-600">BMW Models</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">1970-2024</div>
            <div className="text-sm text-gray-600">Model Years</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Advanced Search</TabsTrigger>
          <TabsTrigger value="vehicle">My Vehicle Parts</TabsTrigger>
          <TabsTrigger value="browse">Browse Catalog</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Interface */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search BMW Parts Database
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                    <Filter className="mr-2 h-4 w-4" />
                    {showAdvancedFilters ? "Hide" : "Show"} Filters
                  </Button>
                  {parts.length > 0 && (
                    <Button variant="outline" size="sm" onClick={exportResults}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Primary Search */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search Parts</label>
                  <Input
                    placeholder="e.g., oil filter, brake pads, charge pipe, turbo"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchParts()}
                    className="text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Part Number</label>
                  <Input
                    placeholder="e.g., 11427566327, 34116794300"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchParts()}
                    className="text-base font-mono"
                  />
                </div>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Your BMW (Optional)</label>
                <Select
                  value={selectedVehicle?.id || "none"}
                  onValueChange={(value) => {
                    const vehicle = vehicles.find((v) => v.id === value) || null
                    setSelectedVehicle(vehicle)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your BMW for compatible parts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All BMW Models</SelectItem>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          <Badge variant="outline" className="text-xs">
                            {vehicle.engine}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium mb-2">BMW Series</label>
                      <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                        <SelectTrigger>
                          <SelectValue placeholder="All series" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Series</SelectItem>
                          {series.map((s) => (
                            <SelectItem key={s.id} value={s.series_code}>
                              {s.series_code} - {s.series_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Engine Code</label>
                      <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                        <SelectTrigger>
                          <SelectValue placeholder="All engines" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Engines</SelectItem>
                          {engines.map((engine) => (
                            <SelectItem key={engine} value={engine}>
                              {engine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Year From</label>
                      <Input
                        type="number"
                        placeholder="1970"
                        value={yearFrom}
                        onChange={(e) => setYearFrom(e.target.value)}
                        min="1970"
                        max="2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year To</label>
                      <Input
                        type="number"
                        placeholder="2024"
                        value={yearTo}
                        onChange={(e) => setYearTo(e.target.value)}
                        min="1970"
                        max="2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Min Price</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Max Price</label>
                      <Input
                        type="number"
                        placeholder="10000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeDiscontinued"
                      checked={includeDiscontinued}
                      onCheckedChange={(checked) => setIncludeDiscontinued(checked as boolean)}
                    />
                    <label htmlFor="includeDiscontinued" className="text-sm font-medium">
                      Include discontinued parts
                    </label>
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && !searchQuery && (
                <div>
                  <label className="block text-sm font-medium mb-2">Recent Searches</label>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(search)
                          searchParts()
                        }}
                        className="text-xs"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Actions */}
              <div className="flex gap-2">
                <Button onClick={() => searchParts()} disabled={loading} className="flex-1">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Search className="mr-2 h-4 w-4" />
                  Search BMW Parts
                </Button>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {searchSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Search Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {searchSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {totalResults > 0 && (
            <div className="space-y-4">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">{totalResults.toLocaleString()} Parts Found</h3>
                  {selectedVehicle && (
                    <Badge variant="outline" className="bg-blue-50">
                      <Car className="mr-1 h-3 w-3" />
                      Compatible with your {selectedVehicle.year} {selectedVehicle.model}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={viewMode === "list" ? "bg-gray-100" : ""}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={viewMode === "grid" ? "bg-gray-100" : ""}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results Grid/List */}
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 gap-4" : "space-y-4"}>
                {parts.map((part) => (
                  <Card key={part.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{part.part_name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(part.part_number)}
                              className="p-1 h-auto"
                            >
                              {favorites.includes(part.part_number) ? (
                                <CheckCircle className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <Plus className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                          <p className="text-blue-600 font-mono text-sm mb-2">#{part.part_number}</p>
                          {part.description && <p className="text-gray-600 text-sm mb-2">{part.description}</p>}
                        </div>
                        <div className="text-right">
                          {part.price_msrp && (
                            <div className="text-lg font-bold text-green-600 flex items-center">
                              <DollarSign className="h-4 w-4" />
                              {part.price_msrp.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">{part.category_name}</Badge>
                        {part.is_discontinued && (
                          <Badge variant="destructive">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Discontinued
                          </Badge>
                        )}
                        {part.superseded_by && (
                          <Badge variant="outline">
                            <Zap className="mr-1 h-3 w-3" />
                            Superseded
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {part.earliest_year}-{part.latest_year}
                        </Badge>
                      </div>

                      {/* Compatibility Info */}
                      <div className="text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-1 mb-1">
                          <Car className="h-3 w-3" />
                          <span>Compatible: {part.compatible_models.slice(0, 3).join(", ")}</span>
                          {part.compatible_models.length > 3 && <span>+{part.compatible_models.length - 3} more</span>}
                        </div>
                        {part.compatible_engines.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Settings className="h-3 w-3" />
                            <span>Engines: {part.compatible_engines.slice(0, 3).join(", ")}</span>
                            {part.compatible_engines.length > 3 && (
                              <span>+{part.compatible_engines.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/oem-catalog/part/${part.part_number}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/browse?part_number=${part.part_number}`}>
                          <Button size="sm" variant="outline">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Find Sellers
                          </Button>
                        </Link>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add to List
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * resultsPerPage + 1} to{" "}
                    {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults.toLocaleString()} results
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => searchParts(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, currentPage - 2) + i
                        if (page > totalPages) return null
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => searchParts(page)}
                            disabled={loading}
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => searchParts(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
