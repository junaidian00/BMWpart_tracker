"use client"

import { useState } from "react"
import HierarchicalCarSelector from "@/components/maintenance/hierarchical-car-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isSupabaseConfiguredFn } from "@/lib/supabase"

type Selection = {
  year?: number
  model?: string
  chassis?: string
  engine?: string
  transmission?: string
}

export default function MaintenanceClient() {
  const [selection, setSelection] = useState<Selection>({})

  const configured = isSupabaseConfiguredFn()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select your car</CardTitle>
        </CardHeader>
        <CardContent>
          <HierarchicalCarSelector onChange={setSelection} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selection Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div>{`Year: ${selection.year ?? "-"}`}</div>
          <div>{`Model: ${selection.model ?? "-"}`}</div>
          <div>{`Chassis: ${selection.chassis ?? "-"}`}</div>
          <div>{`Engine: ${selection.engine ?? "-"}`}</div>
          <div>{`Transmission: ${selection.transmission ?? "-"}`}</div>
          {!configured && (
            <div className="mt-3 text-muted-foreground">
              Supabase environment is not configured. Running in demo mode.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
