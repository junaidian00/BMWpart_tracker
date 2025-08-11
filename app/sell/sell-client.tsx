"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient, getMissingSupabaseEnv } from "@/lib/supabase"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const partCategories = [
  "Engine Components",
  "Forced Induction",
  "Transmission",
  "Suspension & Steering",
  "Brake System",
  "Electrical System",
  "Cooling System",
  "Exhaust System",
  "Fuel System",
  "Interior Parts",
  "Exterior Parts",
  "Wheels & Tires",
  "Performance Parts",
]

const compatibleModels = [
  "F30 3 Series Sedan",
  "F31 3 Series Touring",
  "F32 4 Series Coupe",
  "F33 4 Series Convertible",
  "F36 4 Series Gran Coupe",
  "F22 2 Series Coupe",
  "F23 2 Series Convertible",
  "E90 3 Series",
  "E92 3 Series",
  "Other BMW Models",
]

export default function SellClient() {
  const router = useRouter()
  const missing = getMissingSupabaseEnv()
  const supabaseReady = missing.length === 0

  const [form, setForm] = useState({
    title: "",
    partNumber: "",
    category: "",
    compatibleModels: [] as string[],
    condition: "",
    price: "",
    description: "",
    location: "",
    shipping: false,
    localPickup: true,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function toggleModel(model: string) {
    setForm((prev) => ({
      ...prev,
      compatibleModels: prev.compatibleModels.includes(model)
        ? prev.compatibleModels.filter((m) => m !== model)
        : [...prev.compatibleModels, model],
    }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      if (!supabaseReady) {
        setSuccess("Demo mode: listing created locally (not persisted).")
        setTimeout(() => router.push("/browse"), 600)
        return
      }
      const supabase = getSupabaseClient()
      const { error: insertError } = await supabase.from("listings").insert({
        title: form.title,
        part_number: form.partNumber || null,
        category: form.category || null,
        models: form.compatibleModels,
        condition: form.condition || null,
        price: Number(form.price || 0),
        description: form.description || null,
        location: form.location || null,
        shipping: form.shipping,
        local_pickup: form.localPickup,
      })
      if (insertError) {
        setError(insertError.message || "Unable to create listing")
        return
      }
      setSuccess("Listing created!")
      setTimeout(() => router.push("/browse"), 600)
    } catch (err: any) {
      setError(err?.message || "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sell BMW Parts</CardTitle>
        <CardDescription>List your BMW parts on the marketplace</CardDescription>
      </CardHeader>
      <CardContent>
        {!supabaseReady && (
          <div className="mb-3 text-xs text-muted-foreground">
            Missing env vars: {missing.join(", ")}. Running in demo mode.
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Listing Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g., BMW F30 335i Turbocharger"
                required
              />
            </div>
            <div>
              <Label htmlFor="pn">BMW Part Number</Label>
              <Input
                id="pn"
                value={form.partNumber}
                onChange={(e) => setForm((f) => ({ ...f, partNumber: e.target.value }))}
                placeholder="e.g., 11657647003"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {partCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition *</Label>
              <Select value={form.condition} onValueChange={(v) => setForm((f) => ({ ...f, condition: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">For Parts Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Description *</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the condition, installation notes, etc."
              rows={5}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="City, State"
                required
              />
            </div>
          </div>

          <div>
            <Label>Compatible Models</Label>
            <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {compatibleModels.map((m) => {
                const selected = form.compatibleModels.includes(m)
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleModel(m)}
                    className={`text-left rounded-md border px-3 py-2 text-sm transition ${
                      selected ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                    aria-pressed={selected}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
            {form.compatibleModels.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.compatibleModels.map((m) => (
                  <Badge key={m} variant="secondary">
                    {m}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="text-sm text-green-600">
              {success}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : supabaseReady ? "Create Listing" : "Create Listing (Demo Mode)"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
