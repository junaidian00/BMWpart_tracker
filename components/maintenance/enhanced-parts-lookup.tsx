"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Loader2, Filter } from "lucide-react"
import { HierarchicalCarSelector, type CarSelection } from "./hierarchical-car-selector"
import { searchOEMParts, type SearchFilters, type BMWOEMPart } from "@/lib/oem-parts"

type EnhancedPartsLookupProps = {
  className?: string
}

function PartsResultItem({ part, selection }: { part: BMWOEMPart; selection?: CarSelection }) {
  const fitmentBadges = useMemo(() => {
    const badges: { label: string; variant?: "secondary" | "outline" }[] = []
    if (selection?.chassisCode) badges.push({ label: `Fits ${selection.chassisCode}`, variant: "secondary" })
    if (selection?.engineCode) badges.push({ label: selection.engineCode, variant: "outline" })
    if (selection?.bodyType) badges.push({ label: selection.bodyType, variant: "outline" })
    if (part.category_name) badges.push({ label: part.category_name, variant: "outline" })
    return badges
  }, [selection, part.category_name])

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">{part.part_number}</div>
              <div className="text-base font-medium">{part.part_name}</div>
            </div>
            {typeof part.price_msrp === "number" && (
              <div className="text-right text-sm font-semibold tabular-nums">${part.price_msrp.toFixed(2)}</div>
            )}
          </div>
          {part.description && <div className="text-sm text-gray-600">{part.description}</div>}
          <div className="flex flex-wrap gap-1 pt-1">
            {fitmentBadges.map((b, i) => (
              <Badge key={i} variant={b.variant ?? "secondary"}>
                {b.label}
              </Badge>
            ))}
            {part.earliest_year && (
              <Badge variant="outline">
                {part.earliest_year} - {part.latest_year ?? "Present"}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EnhancedPartsLookup({ className }: EnhancedPartsLookupProps) {
  const [selection, setSelection] = useState<CarSelection>({})
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<BMWOEMPart[]>([])
  const [error, setError] = useState<string | null>(null)

  const canSearch = Boolean(selection.chassisCode || selection.engineCode || query.trim().length > 0)

  const doSearch = useCallback(
    async (override?: Partial<SearchFilters>) => {
      setLoading(true)
      setError(null)
      try {
        const filters: SearchFilters = {
          query: query.trim() || undefined,
          seriesCode: selection.chassisCode,
          engineCode: selection.engineCode || undefined,
          bodyType: selection.bodyType || undefined,
          includeDiscontinued: false,
          limit: 50,
          ...override,
        }
        const data = await searchOEMParts(filters)
        setResults(data)
      } catch (e: any) {
        setError(e?.message || "Search failed")
      } finally {
        setLoading(false)
      }
    },
    [query, selection.chassisCode, selection.engineCode, selection.bodyType],
  )

  useEffect(() => {
    if (selection.chassisCode || selection.engineCode) {
      void doSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.chassisCode, selection.engineCode, selection.bodyType])

  return (
    <div className={["flex flex-col gap-6", className].filter(Boolean).join(" ")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Your BMW</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <HierarchicalCarSelector compact onSelectionComplete={(sel) => setSelection(sel)} />
          <div className="rounded-md border bg-gray-50 p-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-600">Selection:</span>
              {selection.year && <Badge variant="outline">{selection.year}</Badge>}
              {selection.modelName && <Badge variant="outline">{selection.modelName}</Badge>}
              {selection.chassisCode && <Badge variant="secondary">{selection.chassisCode}</Badge>}
              {selection.bodyType && <Badge variant="outline">{selection.bodyType}</Badge>}
              {selection.engineCode && <Badge variant="outline">{selection.engineCode}</Badge>}
              {selection.transmissionCode && <Badge variant="outline">{selection.transmissionCode}</Badge>}
              {!selection.year && !selection.chassisCode && (
                <span className="text-gray-500">Pick a year and model to apply precise fitment.</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Search OEM Parts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                aria-label="Search parts"
                placeholder="Search by name or part number (e.g., oil filter, 11427566327)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-transparent" onClick={() => doSearch({ query: "" })}>
                <Filter className="mr-2 h-4 w-4" />
                Fitment Only
              </Button>
              <Button onClick={() => doSearch()} disabled={!canSearch || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2">{loading ? "Searching..." : "Search"}</span>
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((p) => (
              <PartsResultItem key={`${p.part_number}-${p.category_code ?? ""}`} part={p} selection={selection} />
            ))}
          </div>

          {!loading && results.length === 0 && (
            <div className="text-sm text-gray-600">
              No parts found. Try broadening your search or clearing the query to see fitment-only results.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EnhancedPartsLookup
