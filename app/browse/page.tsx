"use client"

import { useEffect, useMemo, useState } from "react"
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
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<BMWOEMPart[]>([])
  const { addItem } = useCart()

  const filters = useMemo(
    () => ({
      query: query || undefined,
      chassisCode: selection.chassisCode || undefined,
      engineCode: selection.engineCode || undefined,
      includeDiscontinued: false,
      limit: 50,
    }),
    [query, selection.chassisCode, selection.engineCode],
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

  // Auto-search when vehicle selection completed and there is at least a chassis
  useEffect(() => {
    if (selection.chassisCode) {
      runSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.chassisCode, selection.engineCode])

  return (
    <main className="container mx-auto max-w-6xl p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Parts for Your BMW</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <HierarchicalCarSelector
            compact
            showTitle={false}
            onSelectionComplete={setSelection}
            initialSelection={selection}
          />
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
          {selection.chassisCode && (
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="secondary">Year: {selection.year}</Badge>
              <Badge variant="secondary">Chassis: {selection.chassisCode}</Badge>
              {selection.engineCode && <Badge variant="secondary">Engine: {selection.engineCode}</Badge>}
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
          <div className="text-sm text-gray-500">No parts yet. Try a search or finish selecting your vehicle.</div>
        )}
        {!loading &&
          results.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{p.part_name}</div>
                  <div className="text-sm text-gray-600">{p.part_number}</div>
                  {p.category_name && <div className="text-xs text-gray-500 mt-1">{p.category_name}</div>}
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
