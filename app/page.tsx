"use client"

import { Suspense } from "react"
import { Search, Car, Wrench, Users, Star, TrendingUp, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TwoSeriesShowcase } from "@/components/oem/two-series-showcase"
import { useCart } from "@/contexts/cart-context"

const featuredParts = [
  {
    id: 1,
    name: "BMW 2 Series Engine Oil Filter",
    partNumber: "11427566327",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    category: "Engine",
  },
  {
    id: 2,
    name: "BMW 2 Series Brake Pads Front",
    partNumber: "34116794300",
    price: 89.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    reviews: 203,
    inStock: true,
    category: "Brakes",
  },
  {
    id: 3,
    name: "BMW 2 Series Air Filter",
    partNumber: "13717571355",
    price: 32.5,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    reviews: 89,
    inStock: false,
    category: "Engine",
  },
  {
    id: 4,
    name: "BMW 2 Series Spark Plugs Set",
    partNumber: "12120037607",
    price: 67.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    category: "Engine",
  },
]

const popularCategories = [
  { name: "Engine Parts", count: 1247, icon: Car },
  { name: "Brake System", count: 856, icon: Shield },
  { name: "Suspension", count: 634, icon: Wrench },
  { name: "Electrical", count: 423, icon: TrendingUp },
]

const stats = [
  { label: "Parts Available", value: "50,000+", icon: Car },
  { label: "Happy Customers", value: "25,000+", icon: Users },
  { label: "Years Experience", value: "15+", icon: Clock },
  { label: "Average Rating", value: "4.8/5", icon: Star },
]

export default function HomePage() {
  const { addItem } = useCart()

  const handleAddToCart = (part: (typeof featuredParts)[0]) => {
    addItem({
      id: part.partNumber,
      partNumber: part.partNumber,
      partName: part.name,
      price: part.price,
      category: part.category,
      compatibility: [`${part.category} compatible`],
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium BMW Parts
              <span className="block text-blue-300">Marketplace</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find genuine OEM and high-quality aftermarket parts for your BMW. Fast shipping, expert support, and
              unbeatable prices.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by part number, vehicle, or description..."
                  className="pl-12 pr-4 py-4 text-lg bg-white/95 border-0 focus:bg-white"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                Browse Parts
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
              >
                Sell Your Parts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Parts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Parts</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked premium parts with excellent reviews and fast shipping
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredParts.map((part) => (
              <Card key={part.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={part.image || "/placeholder.svg"}
                      alt={part.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className={`absolute top-2 right-2 ${part.inStock ? "bg-green-500" : "bg-red-500"}`}>
                      {part.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {part.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mb-2 line-clamp-2">{part.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 mb-3">Part #: {part.partNumber}</CardDescription>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(part.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {part.rating} ({part.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">${part.price}</span>
                    <Button size="sm" disabled={!part.inStock} onClick={() => handleAddToCart(part)}>
                      {part.inStock ? "Add to Cart" : "Notify Me"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/browse">
              <Button size="lg" variant="outline">
                View All Parts
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-xl text-gray-600">Browse parts by category to find exactly what you need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCategories.map((category, index) => (
              <Link key={index} href={`/browse?category=${category.name.toLowerCase().replace(" ", "-")}`}>
                <Card className="group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                      <category.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {category.count.toLocaleString()} parts available
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BMW 2 Series Showcase */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="text-center">Loading BMW 2 Series parts...</div>}>
            <TwoSeriesShowcase />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Parts?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of BMW enthusiasts who trust us for their parts needs. Fast shipping, expert support, and
            quality guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                Start Shopping
              </Button>
            </Link>
            <Link href="/sell">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
              >
                Sell Your Parts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
