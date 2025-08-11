"use client"

import { useState } from "react"
import HierarchicalCarSelector from "@/components/maintenance/hierarchical-car-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isSupabaseConfigured } from "@/lib/supabase"

export default function MaintenanceClient() {
  const [summary, setSummary] = useState<Record<string, string | number | undefined>>({})

  return (
    <div className="space-y-6">
      <HierarchicalCarSelector
        onChange={(sel) => {
          setSummary(sel as any)
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>Selection Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div>{`Year: ${summary.year ?? "-"}`}</div>
          <div>{`Model: ${summary.model ?? "-"}`}</div>
          <div>{`Chassis: ${summary.chassis ?? "-"}`}</div>
          <div>{`Engine: ${summary.engine ?? "-"}`}</div>
          <div>{`Transmission: ${summary.transmission ?? "-"}`}</div>
          {!isSupabaseConfigured() && (
            <div className="mt-3 text-muted-foreground">Supabase is not configured. Running in demo mode.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
