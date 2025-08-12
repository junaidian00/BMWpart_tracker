"use client"

import { useState } from "react"
import { HierarchicalCarSelector } from "@/components/maintenance/hierarchical-car-selector"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function MaintenanceClient() {
  const [selection, setSelection] = useState({
    year: "",
    model: "",
    chassis: "",
    engine: "",
    transmission: "",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance</CardTitle>
        <CardDescription>Select your car to view maintenance items.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <HierarchicalCarSelector value={selection} onChange={setSelection} showTitle={false} />
        <div className="text-sm text-muted-foreground">
          Selected: {selection.year || "-"} / {selection.model || "-"} / {selection.chassis || "-"} /{" "}
          {selection.engine || "-"} / {selection.transmission || "-"}
        </div>
      </CardContent>
    </Card>
  )
}
