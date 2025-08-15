"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createVehicle } from "@/lib/maintenance"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

const bmwModels = [
  { series: "1 Series", models: ["118i", "120i", "125i", "128i", "135i", "M135i"] },
  { series: "2 Series", models: ["220i", "228i", "230i", "235i", "M235i", "M240i"] },
  { series: "3 Series", models: ["320i", "325i", "328i", "330i", "335i", "340i", "M3"] },
  { series: "4 Series", models: ["420i", "428i", "430i", "435i", "440i", "M4"] },
  { series: "5 Series", models: ["520i", "525i", "528i", "530i", "535i", "540i", "550i", "M5"] },
  { series: "6 Series", models: ["640i", "650i", "M6"] },
  { series: "7 Series", models: ["730i", "740i", "750i", "760i"] },
  { series: "8 Series", models: ["840i", "850i", "M8"] },
  { series: "X Series", models: ["X1", "X2", "X3", "X4", "X5", "X6", "X7"] },
  { series: "Z Series", models: ["Z3", "Z4", "Z8"] },
]

const engines = [
  "N20 2.0L Turbo I4",
  "N26 2.0L Turbo I4",
  "N55 3.0L Turbo I6",
  "N54 3.0L Twin Turbo I6",
  "S55 3.0L Twin Turbo I6",
  "N63 4.4L Twin Turbo V8",
  "S63 4.4L Twin Turbo V8",
  "N74 6.0L Twin Turbo V12",
  "Other",
]

export default function AddVehiclePage() {
  const [formData, setFormData] = useState({
    make: "BMW",
    model: "",
    year: new Date().getFullYear(),
    engine: "",
    vin: "",
    nickname: "",
    mileage: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await createVehicle(formData)
      router.push("/maintenance")
    } catch (err: any) {
      setError(err.message || "Failed to add vehicle")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/maintenance">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Maintenance
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Add New Vehicle</CardTitle>
                <CardDescription>Add your BMW to start tracking maintenance and modifications</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Make</label>
                      <Input value="BMW" disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year *</label>
                      <Select
                        value={formData.year.toString()}
                        onValueChange={(value) => setFormData({ ...formData, year: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Model *</label>
                    <Select
                      value={formData.model}
                      onValueChange={(value) => setFormData({ ...formData, model: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your BMW model" />
                      </SelectTrigger>
                      <SelectContent>
                        {bmwModels.map((series) => (
                          <div key={series.series}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                              {series.series}
                            </div>
                            {series.models.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Engine *</label>
                    <Select
                      value={formData.engine}
                      onValueChange={(value) => setFormData({ ...formData, engine: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select engine type" />
                      </SelectTrigger>
                      <SelectContent>
                        {engines.map((engine) => (
                          <SelectItem key={engine} value={engine}>
                            {engine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Current Mileage *</label>
                    <Input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: Number.parseInt(e.target.value) || 0 })}
                      placeholder="85000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nickname (Optional)</label>
                    <Input
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      placeholder="e.g., Daily Driver, Track Car, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">VIN (Optional)</label>
                    <Input
                      value={formData.vin}
                      onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                      placeholder="17-character VIN"
                      maxLength={17}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Add Vehicle
                    </Button>
                    <Link href="/maintenance">
                      <Button type="button" variant="outline" disabled={loading}>
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
