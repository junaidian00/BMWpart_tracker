"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient, getMissingSupabaseEnv } from "@/lib/supabase"

export default function SellClient() {
  const router = useRouter()
  const missing = getMissingSupabaseEnv()
  const supabaseReady = missing.length === 0

  const [form, setForm] = useState({
    partNumber: "",
    title: "",
    price: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      if (!supabaseReady) {
        setSuccess("Demo mode: listing created locally (not persisted).")
        setTimeout(() => router.push("/browse"), 600)
        return
      }
      const supabase = getSupabaseClient()
      // Optional: this table may not exist in your DB yet; if so, demo flow still works.
      const { error: insertError } = await supabase.from("listings").insert({
        part_number: form.partNumber,
        title: form.title,
        price: Number(form.price || 0),
        description: form.description || null,
      })
      if (insertError) {
        setError(insertError.message ?? "Unable to create listing")
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
        <CardTitle>New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        {!supabaseReady && (
          <div className="mb-3 text-xs text-muted-foreground">
            Missing env vars: {missing.join(", ")}. Running in demo mode.
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="pn" className="block text-sm font-medium">
              Part Number
            </label>
            <input
              id="pn"
              className="mt-1 block w-full rounded-md border px-3 py-2"
              value={form.partNumber}
              onChange={(e) => setForm((f) => ({ ...f, partNumber: e.target.value }))}
              required
              placeholder="e.g. 11368604227"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              className="mt-1 block w-full rounded-md border px-3 py-2"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              placeholder="e.g. BMW N55 Valve Cover"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium">
              Price (USD)
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border px-3 py-2"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
              placeholder="200.00"
            />
          </div>
          <div>
            <label htmlFor="desc" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="desc"
              className="mt-1 block w-full rounded-md border px-3 py-2"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Condition, fitment notes, etc."
            />
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
            {loading ? "Submitting..." : supabaseReady ? "Create Listing" : "Create (Demo Mode)"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
