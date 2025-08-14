"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Wrench, FileText, ImageIcon } from "lucide-react"
import type { MaintenanceRecord } from "@/lib/maintenance"
import { useState } from "react"

interface ServiceHistoryTimelineProps {
  records: MaintenanceRecord[]
}

function ServiceRecordCard({ record }: { record: MaintenanceRecord }) {
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case "oil change":
        return <Wrench className="h-5 w-5 text-blue-500" />
      case "brake service":
        return <Wrench className="h-5 w-5 text-red-500" />
      case "inspection":
        return <FileText className="h-5 w-5 text-green-500" />
      default:
        return <Wrench className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">{getServiceIcon(record.service_type)}</div>

            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{record.service_type}</h3>
                  <p className="text-muted-foreground">{record.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">${record.cost?.toFixed(2) || "0.00"}</div>
                  <div className="text-sm text-muted-foreground">{record.mileage?.toLocaleString()} miles</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(record.date_performed).toLocaleDateString()}
                </div>
                {record.shop_name && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {record.shop_name}
                  </div>
                )}
                {record.labor_hours && (
                  <div className="flex items-center gap-1">
                    <Wrench className="h-4 w-4" />
                    {record.labor_hours}h labor
                  </div>
                )}
                {record.receipt_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReceiptModal(true)}
                    className="flex items-center gap-1 h-auto p-1 text-muted-foreground hover:text-foreground"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Receipt
                  </Button>
                )}
              </div>

              {record.parts_used && record.parts_used.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Parts Used:</h4>
                  <div className="flex flex-wrap gap-1">
                    {record.parts_used.map((part, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {part}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {record.notes && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">{record.notes}</p>
                </div>
              )}

              {record.warranty_months && (
                <div className="text-xs text-muted-foreground">Warranty: {record.warranty_months} months</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showReceiptModal && record.receipt_url && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowReceiptModal(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Service Receipt</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowReceiptModal(false)}>
                ×
              </Button>
            </div>
            <div className="p-4">
              <img src={record.receipt_url || "/placeholder.svg"} alt="Service Receipt" className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function ServiceHistoryTimeline({ records }: ServiceHistoryTimelineProps) {
  if (records.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Service Records</h3>
          <p className="text-muted-foreground">
            Start tracking your vehicle's maintenance history by adding your first service record.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Service History</h2>
        <Badge variant="secondary">{records.length} records</Badge>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <ServiceRecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
}
