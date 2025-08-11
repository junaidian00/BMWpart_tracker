"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, DollarSign, Package, Camera, MapPin, Clock, Shield, Star } from "lucide-react"

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

export default function SellPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
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
    images: [] as File[],
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 2000)
  }

  const handleModelToggle = (model: string) => {
    setFormData((prev) => ({
      ...prev,
      compatibleModels: prev.compatibleModels.includes(model)
        ? prev.compatibleModels.filter((m) => m !== model)
        : [...prev.compatibleModels, model],
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files!)],
      }))
    }
  }

  if (success) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Listing Created Successfully!</h1>
              <p className="text-gray-600 mb-8">
                Your part listing has been submitted for review. It will be live on the marketplace within 24 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setSuccess(false)}>Create Another Listing</Button>
                <Button variant="outline" asChild>
                  <a href="/browse">Browse Marketplace</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell BMW Parts</h1>
            <p className="text-gray-600">List your BMW parts and accessories on our marketplace</p>
          </div>

          {/* Benefits Banner */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Why Sell With Us?</h2>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">Secure Transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">Verified Buyers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">Easy Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-blue-800">Competitive Fees</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Provide essential details about your part</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Listing Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., BMW F30 335i Turbocharger - Excellent Condition"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="partNumber">BMW Part Number</Label>
                    <Input
                      id="partNumber"
                      value={formData.partNumber}
                      onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                      placeholder="e.g., 11657647003"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {partCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
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
              </CardContent>
            </Card>

            {/* Compatible Models */}
            <Card>
              <CardHeader>
                <CardTitle>Compatible BMW Models</CardTitle>
                <CardDescription>Select all BMW models this part is compatible with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {compatibleModels.map((model) => (
                    <div key={model} className="flex items-center space-x-2">
                      <Checkbox
                        id={model}
                        checked={formData.compatibleModels.includes(model)}
                        onCheckedChange={() => handleModelToggle(model)}
                      />
                      <Label htmlFor={model} className="text-sm">
                        {model}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.compatibleModels.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {formData.compatibleModels.map((model) => (
                      <Badge key={model} variant="secondary">
                        {model}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description and Images */}
            <Card>
              <CardHeader>
                <CardTitle>Description and Images</CardTitle>
                <CardDescription>Provide detailed description and photos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the part condition, installation notes, reason for selling, etc."
                    rows={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include installation notes, mileage when removed, and any known issues
                  </p>
                </div>

                <div>
                  <Label htmlFor="images">Photos</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Upload part photos</p>
                      <p className="text-xs text-gray-500">Up to 8 photos, max 5MB each</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 bg-transparent"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Files
                    </Button>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-green-600">
                        {formData.images.length} image{formData.images.length !== 1 ? "s" : ""} selected
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing and Delivery */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing and Delivery</CardTitle>
                <CardDescription>Set your price and delivery options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">Price (USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0.00"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, State"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Delivery Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="localPickup"
                        checked={formData.localPickup}
                        onCheckedChange={(checked) => setFormData({ ...formData, localPickup: checked as boolean })}
                      />
                      <Label htmlFor="localPickup">Local pickup available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shipping"
                        checked={formData.shipping}
                        onCheckedChange={(checked) => setFormData({ ...formData, shipping: checked as boolean })}
                      />
                      <Label htmlFor="shipping">Willing to ship (buyer pays shipping)</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Submit */}
            <Card>
              <CardContent className="p-6">
                <Alert className="mb-6">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    By listing your part, you agree to our marketplace terms and seller policies. All transactions are
                    protected by our buyer/seller protection program.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <Package className="mr-2 h-4 w-4" />
                        Create Listing
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </AuthGuard>
  )
}
