import { Search, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const parts = [
  {
    id: 1,
    name: "N55 Aluminum Charge Pipe",
    partNumber: "11617531423",
    category: "Engine",
    condition: "New",
    type: "Aftermarket",
    price: { min: 89, max: 299 },
    sellers: 12,
    image: "/placeholder.svg?height=200&width=200",
    recommendation: "Recommended upgrade from plastic OEM part",
    compatibility: ["F30 335i", "F32 435i", "E90 335i"],
  },
  {
    id: 2,
    name: "Front Brake Pads - Ceramic",
    partNumber: "34116794300",
    category: "Brakes",
    condition: "New",
    type: "OEM",
    price: { min: 85, max: 180 },
    sellers: 8,
    image: "/placeholder.svg?height=200&width=200",
    compatibility: ["F30", "F32", "F36"],
  },
  {
    id: 3,
    name: "Xenon Headlight Assembly",
    partNumber: "63117182518",
    category: "Exterior",
    condition: "Used - Excellent",
    type: "OEM",
    price: { min: 299, max: 599 },
    sellers: 5,
    image: "/placeholder.svg?height=200&width=200",
    compatibility: ["E90", "E91", "E92", "E93"],
  },
  {
    id: 4,
    name: "Performance Cold Air Intake",
    partNumber: "AFE54-12202",
    category: "Engine",
    condition: "New",
    type: "Aftermarket",
    price: { min: 199, max: 349 },
    sellers: 6,
    image: "/placeholder.svg?height=200&width=200",
    recommendation: "Increases airflow and performance",
    compatibility: ["F30 335i", "F32 435i"],
  },
]

export default function BrowsePage() {
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
              <Link href="/browse" className="text-blue-600 font-medium">
                Browse Parts
              </Link>
              <Link href="/sell" className="text-gray-600 hover:text-gray-900">
                Sell Parts
              </Link>
              <Button variant="outline">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Model</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="e90">E90 (2005-2012)</SelectItem>
                      <SelectItem value="f30">F30 (2012-2019)</SelectItem>
                      <SelectItem value="g20">G20 (2019+)</SelectItem>
                      <SelectItem value="e46">E46 (1998-2006)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engine">Engine</SelectItem>
                      <SelectItem value="brakes">Brakes</SelectItem>
                      <SelectItem value="suspension">Suspension</SelectItem>
                      <SelectItem value="exterior">Exterior</SelectItem>
                      <SelectItem value="interior">Interior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Condition</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      New
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Used - Excellent
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Used - Good
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Used - Fair
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      OEM
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Aftermarket
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" type="number" />
                    <Input placeholder="Max" type="number" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input placeholder="Search parts..." className="pl-10" />
                </div>
                <div className="flex items-center gap-4">
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border rounded-lg">
                    <Button variant="ghost" size="sm">
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">BMW Parts ({parts.length} results)</h2>
              </div>

              <div className="grid gap-6">
                {parts.map((part) => (
                  <Card key={part.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <img
                          src={part.image || "/placeholder.svg"}
                          alt={part.name}
                          className="w-full md:w-48 h-48 object-cover rounded-lg"
                        />

                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{part.name}</h3>
                            <p className="text-gray-600">Part #: {part.partNumber}</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{part.category}</Badge>
                            <Badge variant={part.condition === "New" ? "default" : "outline"}>{part.condition}</Badge>
                            <Badge variant={part.type === "OEM" ? "destructive" : "secondary"}>{part.type}</Badge>
                          </div>

                          {part.recommendation && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-sm text-blue-800">
                                💡 <strong>Recommendation:</strong> {part.recommendation}
                              </p>
                            </div>
                          )}

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Compatible with:</p>
                            <div className="flex flex-wrap gap-1">
                              {part.compatibility.map((model) => (
                                <Badge key={model} variant="outline" className="text-xs">
                                  {model}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="md:w-48 space-y-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              ${part.price.min} - ${part.price.max}
                            </div>
                            <p className="text-sm text-gray-600">
                              {part.sellers} seller{part.sellers !== 1 ? "s" : ""}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Link href={`/parts/${part.id}`}>
                              <Button className="w-full">View Details</Button>
                            </Link>
                            <Button variant="outline" className="w-full bg-transparent">
                              Compare Prices
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
