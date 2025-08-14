"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { addMaintenanceRecord, type MaintenanceRecord } from "@/lib/maintenance"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ReceiptUpload, ReceiptPreview } from "./receipt-upload"

interface AddServiceRecordFormProps {
  vehicleId: string
  onServiceAdded: (record: MaintenanceRecord) => void
  onCancel: () => void
}

const serviceTypes = [
  "Oil Change",
  "Brake Service",
  "Tire Rotation",
  "Air Filter",
  "Spark Plugs",
  "Coolant Flush",
  "Transmission Service",
  "Suspension",
  "Modification",
  "Repair",
  "Inspection",
  "Other",
]

export function AddServiceRecordForm({ vehicleId, onServiceAdded, onCancel }: AddServiceRecordFormProps) {
  const [formData, setFormData] = useState({
    service_type: "",
    description: "",
    date_performed: new Date().toISOString().split("T")[0],
    mileage: "",
    cost: "",
    shop_name: "",
    shop_address: "",
    labor_hours: "",
    warranty_months: "",
    notes: "",
  })
  const [partsUsed, setPartsUsed] = useState<string[]>([])
  const [newPart, setNewPart] = useState("")
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleAddPart = () => {
    if (newPart.trim() && !partsUsed.includes(newPart.trim())) {
      setPartsUsed([...partsUsed, newPart.trim()])
      setNewPart("")
    }
  }

  const handleRemovePart = (partToRemove: string) => {
    setPartsUsed(partsUsed.filter((part) => part !== partToRemove))
  }

  const handleReceiptUpload = (url: string) => {
    setReceiptUrl(url)
  }

  const handleReceiptError = (error: string) => {
    console.error("Receipt upload error:", error)
  }

  const handleRemoveReceipt = () => {
    setReceiptUrl(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add service records.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const recordData = {
        user_id: user.id,
        vehicle_id: vehicleId,
        service_type: formData.service_type,
        description: formData.description,
        date_performed: formData.date_performed,
        mileage: Number.parseInt(formData.mileage) || 0,
        cost: Number.parseFloat(formData.cost) || 0,
        shop_name: formData.shop_name || null,
        shop_address: formData.shop_address || null,
        parts_used: partsUsed.length > 0 ? partsUsed : null,
        labor_hours: Number.parseFloat(formData.labor_hours) || null,
        warranty_months: Number.parseInt(formData.warranty_months) || null,
        receipt_url: receiptUrl, // Include receipt URL in record data
        notes: formData.notes || null,
      }

      const newRecord = await addMaintenanceRecord(recordData)
      onServiceAdded(newRecord)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add service record",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Service Type *</label>
          <Select
            value={formData.service_type}
            onValueChange={(value) => setFormData({ ...formData, service_type: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date Performed *</label>
          <Input
            type="date"
            value={formData.date_performed}
            onChange={(e) => setFormData({ ...formData, date_performed: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mileage *</label>
          <Input
            type="number"
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
            placeholder="85000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cost</label>
          <Input
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="89.99"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Shop Name</label>
          <Input
            value={formData.shop_name}
            onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
            placeholder="BMW Service Center"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Labor Hours</label>
          <Input
            type="number"
            step="0.5"
            value={formData.labor_hours}
            onChange={(e) => setFormData({ ...formData, labor_hours: e.target.value })}
            placeholder="2.5"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe the service performed..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Shop Address</label>
        <Input
          value={formData.shop_address}
          onChange={(e) => setFormData({ ...formData, shop_address: e.target.value })}
          placeholder="123 Main St, City, State"
        />
      </div>

      {/* Parts Used Section */}
      <div>
        <label className="block text-sm font-medium mb-2">Parts Used</label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newPart}
            onChange={(e) => setNewPart(e.target.value)}
            placeholder="Enter part name"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPart())}
          />
          <Button type="button" onClick={handleAddPart} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {partsUsed.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {partsUsed.map((part, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {part}
                <button type="button" onClick={() => handleRemovePart(part)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        {receiptUrl ? (
          <ReceiptPreview url={receiptUrl} onRemove={handleRemoveReceipt} disabled={loading} />
        ) : (
          <ReceiptUpload
            userId={user?.id || "demo-user"}
            recordId={`temp-${Date.now()}`}
            onUploadComplete={handleReceiptUpload}
            onUploadError={handleReceiptError}
            disabled={loading}
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Warranty (months)</label>
        <Input
          type="number"
          value={formData.warranty_months}
          onChange={(e) => setFormData({ ...formData, warranty_months: e.target.value })}
          placeholder="12"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about the service..."
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Adding..." : "Add Service Record"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
