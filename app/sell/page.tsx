import { Upload, DollarSign, Camera, FileText, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function SellPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded"></div>
              <span className="text-2xl font-bold text-gray-900">BMWParts</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                Browse Parts
              </Link>
              <Link href="/sell" className="text-blue-600 font-medium">
                Sell Parts
              </Link>
              <Button variant="outline">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">List Your BMW Parts</h1>
            <p className="text-lg text-gray-600">
              Reach thousands of BMW enthusiasts and get the best price for your parts
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Best Prices</CardTitle>
                <CardDescription>Competitive marketplace ensures you get fair market value</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Camera className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Easy Listing</CardTitle>
                <CardDescription>Simple process with photo upload and condition assessment</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Truck className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Flexible Shipping</CardTitle>
                <CardDescription>Choose your preferred shipping method and pricing</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Listing Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Listing</CardTitle>
              <CardDescription>Fill out the details below to list your BMW part</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Part Name *</label>
                    <Input placeholder="e.g., N55 Charge Pipe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Part Number</label>
                    <Input placeholder="e.g., 11617531423" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engine">Engine</SelectItem>
                        <SelectItem value="brakes">Brakes</SelectItem>
                        <SelectItem value="suspension">Suspension</SelectItem>
                        <SelectItem value="exterior">Exterior</SelectItem>
                        <SelectItem value="interior">Interior</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Condition *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="excellent">Used - Excellent</SelectItem>
                        <SelectItem value="good">Used - Good</SelectItem>
                        <SelectItem value="fair">Used - Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Type *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oem">OEM</SelectItem>
                        <SelectItem value="aftermarket">Aftermarket</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    placeholder="Describe the part condition, any modifications, reason for selling, etc."
                    rows={4}
                  />
                </div>
              </div>

              {/* Compatibility */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compatibility</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">BMW Model *</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="e46">E46 (1998-2006)</SelectItem>
                        <SelectItem value="e90">E90 (2005-2012)</SelectItem>
                        <SelectItem value="f30">F30 (2012-2019)</SelectItem>
                        <SelectItem value="g20">G20 (2019+)</SelectItem>
                        <SelectItem value="e92">E92 (2007-2013)</SelectItem>
                        <SelectItem value="f32">F32 (2014-2020)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year Range</label>
                    <div className="flex gap-2">
                      <Input placeholder="From" type="number" />
                      <Input placeholder="To" type="number" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Compatible Models</label>
                  <Input placeholder="e.g., F32 435i, E92 335i (optional)" />
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Photos</h3>
                <p className="text-sm text-gray-600">
                  Upload clear photos showing the part condition. More photos increase buyer confidence.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drag and drop photos here, or click to browse</p>
                  <Button variant="outline">Choose Files</Button>
                  <p className="text-xs text-gray-500 mt-2">Maximum 10 photos, 5MB each. JPG, PNG supported.</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing & Shipping</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input placeholder="0.00" className="pl-8" type="number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Shipping Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input placeholder="0.00" className="pl-8" type="number" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm">Offer local pickup</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm">Accept best offers</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm">Part comes with warranty/guarantee</span>
                  </label>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <Input placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input placeholder="email@example.com" type="email" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone (optional)</label>
                    <Input placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <Input placeholder="City, State" />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <label className="flex items-start space-x-2">
                    <Checkbox className="mt-1" />
                    <span className="text-sm text-gray-600">
                      I agree to the Terms of Service and confirm that I have the right to sell this part. I understand
                      that providing false information may result in account suspension.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="flex-1">
                  List Part for Sale
                </Button>
                <Button variant="outline" size="lg">
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seller Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tips for Successful Selling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Take clear, well-lit photos from multiple angles</li>
                <li>• Be honest about the condition and any defects</li>
                <li>• Include the part number if available</li>
                <li>• Research similar listings to price competitively</li>
                <li>• Respond promptly to buyer inquiries</li>
                <li>• Package items securely for shipping</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
