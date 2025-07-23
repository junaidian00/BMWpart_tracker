import { Star, Truck, Shield, AlertTriangle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

const partData = {
  id: 1,
  name: "N55 Aluminum Charge Pipe",
  partNumber: "11617531423",
  category: "Engine",
  description:
    "High-quality aluminum charge pipe replacement for BMW N55 engines. Eliminates the common failure point of the plastic OEM charge pipe.",
  images: [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ],
  compatibility: [
    { model: "F30 335i", years: "2012-2015" },
    { model: "F32 435i", years: "2014-2016" },
    { model: "E90 335i", years: "2010-2012" },
    { model: "E92 335i", years: "2010-2013" },
  ],
  recommendation: {
    title: "Highly Recommended Upgrade",
    reason:
      "The OEM plastic charge pipe is known to fail frequently, especially on tuned vehicles. This aluminum replacement eliminates this failure point and can handle higher boost pressures.",
    benefits: [
      "Eliminates common failure point",
      "Handles higher boost pressure",
      "Better heat dissipation",
      "Lifetime durability",
    ],
  },
}

const sellers = [
  {
    id: 1,
    name: "BimmerWorld",
    type: "Authorized Dealer",
    rating: 4.8,
    reviews: 1247,
    condition: "New",
    partType: "Aftermarket",
    price: 189,
    shipping: 15,
    delivery: "2-3 business days",
    inStock: true,
    warranty: "2 year manufacturer warranty",
    website: "bimmerworld.com",
  },
  {
    id: 2,
    name: "Turner Motorsport",
    type: "Authorized Dealer",
    rating: 4.9,
    reviews: 892,
    condition: "New",
    partType: "Aftermarket",
    price: 199,
    shipping: 0,
    delivery: "1-2 business days",
    inStock: true,
    warranty: "2 year manufacturer warranty",
    website: "turnermotorsport.com",
  },
  {
    id: 3,
    name: "Mike_E90_Parts",
    type: "Individual Seller",
    rating: 4.6,
    reviews: 23,
    condition: "Used - Excellent",
    partType: "Aftermarket",
    price: 89,
    shipping: 12,
    delivery: "3-5 business days",
    inStock: true,
    warranty: "30 day return policy",
  },
  {
    id: 4,
    name: "Euro Auto Dismantlers",
    type: "Dismantling Company",
    rating: 4.4,
    reviews: 156,
    condition: "Used - Good",
    partType: "OEM",
    price: 65,
    shipping: 18,
    delivery: "4-7 business days",
    inStock: true,
    warranty: "90 day warranty",
  },
]

export default function PartDetailPage() {
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
              <Link href="/sell" className="text-gray-600 hover:text-gray-900">
                Sell Parts
              </Link>
              <Button variant="outline">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-gray-900">
            Browse Parts
          </Link>
          <span>/</span>
          <span className="text-gray-900">{partData.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <img
                    src={partData.images[0] || "/placeholder.svg"}
                    alt={partData.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {partData.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${partData.name} view ${index + 2}`}
                        className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Part Information */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{partData.name}</CardTitle>
                    <CardDescription className="text-lg">Part Number: {partData.partNumber}</CardDescription>
                  </div>
                  <Badge variant="secondary">{partData.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{partData.description}</p>

                {/* Recommendation Alert */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">{partData.recommendation.title}</h4>
                      <p className="text-green-700 mb-3">{partData.recommendation.reason}</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        {partData.recommendation.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Compatibility */}
                <div>
                  <h4 className="font-semibold mb-3">Compatible Models</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {partData.compatibility.map((comp, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="font-medium">{comp.model}</div>
                        <div className="text-sm text-gray-600">{comp.years}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sellers */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available from {sellers.length} sellers</CardTitle>
                <CardDescription>Compare prices and choose the best option</CardDescription>
              </CardHeader>
            </Card>

            {/* Seller Cards */}
            <div className="space-y-4">
              {sellers.map((seller) => (
                <Card key={seller.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Seller Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{seller.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{seller.name}</div>
                            <div className="text-sm text-gray-600">{seller.type}</div>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{seller.rating}</span>
                              <span className="text-gray-500">({seller.reviews})</span>
                            </div>
                          </div>
                        </div>
                        {seller.website && (
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Part Details */}
                      <div className="flex gap-2">
                        <Badge variant={seller.condition === "New" ? "default" : "outline"}>{seller.condition}</Badge>
                        <Badge variant={seller.partType === "OEM" ? "destructive" : "secondary"}>
                          {seller.partType}
                        </Badge>
                        {seller.inStock && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            In Stock
                          </Badge>
                        )}
                      </div>

                      {/* Price and Shipping */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">${seller.price}</span>
                          <div className="text-right text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Truck className="h-3 w-3" />
                              {seller.shipping === 0 ? "Free shipping" : `$${seller.shipping} shipping`}
                            </div>
                            <div>{seller.delivery}</div>
                          </div>
                        </div>

                        {seller.warranty && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Shield className="h-3 w-3" />
                            {seller.warranty}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button className="flex-1">Buy Now - ${seller.price + seller.shipping}</Button>
                        <Button variant="outline">Contact</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Price Alert */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Price Alert</h4>
                <p className="text-sm text-gray-600 mb-3">Get notified when this part drops below your target price</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Target price"
                    className="flex-1 px-3 py-2 border rounded-md text-sm"
                  />
                  <Button size="sm">Set Alert</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
