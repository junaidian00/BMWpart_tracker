"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HierarchicalCarSelector, type CarSelection } from "@/components/maintenance/hierarchical-car-selector"
import { searchOEMParts, type BMWOEMPart } from "@/lib/oem-parts"
import { useCart } from "@/contexts/cart-context"
import { Loader2, Search, ShoppingCart } from "lucide-react"

export default function BrowsePage() {
  const [selection, setSelection] = useState<CarSelection>({})
  const [query, setQuery] = useState("")
  const [directChassisCode, setDirectChassisCode] = useState("")
  const [directEngineCode, setDirectEngineCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<BMWOEMPart[]>([])
  const [searchMode, setSearchMode] = useState<"vehicle" | "direct">("vehicle")
  const { addItem } = useCart()

  const filters = useMemo(
    () => ({
      query: query || undefined,
      chassisCode: searchMode === "direct" ? directChassisCode || undefined : selection.chassisCode || undefined,
      engineCode: searchMode === "direct" ? directEngineCode || undefined : selection.engineCode || undefined,
      includeDiscontinued: false,
      limit: 50,
    }),
    [query, searchMode, directChassisCode, directEngineCode, selection.chassisCode, selection.engineCode],
  )

  async function runSearch() {
    setLoading(true)
    try {
      const data = await searchOEMParts(filters)
      setResults(data)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (part: BMWOEMPart) => {
    addItem({
      id: part.part_number,
      partNumber: part.part_number,
      partName: part.part_name,
      price: part.price_msrp || 0,
      category: part.category_name || undefined,
      compatibility: [...(part.compatible_chassis || []), ...(part.compatible_engines || [])],
    })
  }

  const canSearchByVehicle = selection.chassisCode || selection.engineCode
  const canSearchDirect = directChassisCode || directEngineCode

  return (
    <main className="container mx-auto max-w-6xl p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Parts for Your BMW</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={searchMode === "vehicle" ? "default" : "outline"}
              onClick={() => setSearchMode("vehicle")}
              size="sm"
            >
              Search by Vehicle
            </Button>
            <Button
              variant={searchMode === "direct" ? "default" : "outline"}
              onClick={() => setSearchMode("direct")}
              size="sm"
            >
              Search by Engine/Chassis
            </Button>
          </div>

          {searchMode === "vehicle" ? (
            <div className="space-y-4">
              <HierarchicalCarSelector
                showTitle={false}
                showBuildDate={false}
                onSelectionChange={setSelection}
                value={selection}
              />
              {canSearchByVehicle && (
                <Button onClick={runSearch} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="ml-2">Search Parts for Selected Vehicle</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Chassis Code (Optional)</label>
                  <Input
                    value={directChassisCode}
                    onChange={(e) => setDirectChassisCode(e.target.value.toUpperCase())}
                    placeholder="e.g., G20, F30, E90"
                    aria-label="Chassis code"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Engine Code (Optional)</label>
                  <Input
                    value={directEngineCode}
                    onChange={(e) => setDirectEngineCode(e.target.value.toUpperCase())}
                    placeholder="e.g., B48, B58, N55"
                    aria-label="Engine code"
                  />
                </div>
              </div>
              {canSearchDirect && (
                <Button onClick={runSearch} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="ml-2">Search Parts by Engine/Chassis</span>
                </Button>
              )}
            </div>
          )}

          <Separator />
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by keyword or part number"
              aria-label="Search query"
            />
            <Button onClick={runSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Search</span>
            </Button>
          </div>

          {(selection.chassisCode || directChassisCode || selection.engineCode || directEngineCode) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {searchMode === "vehicle" && selection.year && <Badge variant="secondary">Year: {selection.year}</Badge>}
              {(selection.chassisCode || directChassisCode) && (
                <Badge variant="secondary">Chassis: {selection.chassisCode || directChassisCode}</Badge>
              )}
              {(selection.engineCode || directEngineCode) && (
                <Badge variant="secondary">Engine: {selection.engineCode || directEngineCode}</Badge>
              )}
              {selection.bodyType && <Badge variant="secondary">Body: {selection.bodyType}</Badge>}
            </div>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-3">
        {loading && (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading parts...
          </div>
        )}
        {!loading && results.length === 0 && (
          <div className="text-sm text-gray-500">
            No parts found. Try a different search or check your chassis/engine codes.
          </div>
        )}
        {!loading &&
          results.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{p.part_name}</div>
                  <div className="text-sm text-gray-600">{p.part_number}</div>
                  {p.category_name && <div className="text-xs text-gray-500 mt-1">{p.category_name}</div>}
                  <div className="text-xs text-gray-400 mt-1">
                    Compatible: {p.compatible_chassis?.join(", ")} | {p.compatible_engines?.join(", ")}
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    {p.price_msrp != null && <div className="font-semibold">${p.price_msrp.toFixed(2)}</div>}
                    {p.is_discontinued && <Badge variant="destructive">Discontinued</Badge>}
                  </div>
                  {p.price_msrp && !p.is_discontinued && (
                    <Button size="sm" onClick={() => handleAddToCart(p)}>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </section>
    </main>
  )
}
