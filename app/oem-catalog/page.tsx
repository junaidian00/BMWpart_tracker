"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HierarchicalCarSelector, type CarSelection } from "@/components/maintenance/hierarchical-car-selector"
import { getPartCategories, searchOEMParts, type BMWOEMPart, type BMWPartCategory } from "@/lib/oem-parts"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OemCatalogPage() {
  const [selection, setSelection] = useState<CarSelection>({})
  const [categories, setCategories] = useState<BMWPartCategory[]>([])
  const [categoryCode, setCategoryCode] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<BMWOEMPart[]>([])

  useEffect(() => {
    getPartCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const filters = useMemo(
    () => ({
      categoryCode: categoryCode || undefined,
      chassisCode: selection.chassisCode || undefined,
      engineCode: selection.engineCode || undefined,
      includeDiscontinued: false,
      limit: 50,
    }),
    [categoryCode, selection.chassisCode, selection.engineCode],
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

  // Auto-run when vehicle changes or category changes
  useEffect(() => {
    if (selection.chassisCode || categoryCode) {
      runSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.chassisCode, selection.engineCode, categoryCode])

  return (
    <main className="container mx-auto max-w-6xl p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OEM Catalog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <HierarchicalCarSelector
            compact
            showTitle={false}
            onSelectionComplete={setSelection}
            initialSelection={selection}
          />
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select onValueChange={setCategoryCode} value={categoryCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.category_code}>
                    {c.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selection.chassisCode && (
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="secondary">Year: {selection.year}</Badge>
              <Badge variant="secondary">Chassis: {selection.chassisCode}</Badge>
              {selection.engineCode && <Badge variant="secondary">Engine: {selection.engineCode}</Badge>}
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
          <div className="text-sm text-gray-500">No parts found. Choose a category and/or select your vehicle.</div>
        )}
        {!loading &&
          results.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.part_name}</div>
                  <div className="text-sm text-gray-600">{p.part_number}</div>
                  {p.category_name && <div className="text-xs text-gray-500 mt-1">{p.category_name}</div>}
                </div>
                <div className="text-right">
                  {p.price_msrp != null && <div className="font-semibold">${p.price_msrp.toFixed(2)}</div>}
                  {p.is_discontinued && <Badge variant="destructive">Discontinued</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
      </section>
    </main>
  )
}
