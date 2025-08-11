'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Car, Wrench, Package } from 'lucide-react'
import Link from 'next/link'

// Mock data for 2 Series parts
const twoSeriesParts = [
  {
    id: 1,
    part_number: "11427566327",
    part_name: "Oil Filter Element",
    description: "Engine oil filter for B48/B58 engines",
    price_msrp: 24.95,
    is_discontinued: false,
    category_name: "Engine Components",
    compatible_chassis: ["F22", "F23"],
    compatible_engines: ["B48", "B58"]
  },
  {
    id: 2,
    part_number: "34116855152", 
    part_name: "Front Brake Pad Set",
    description: "Front brake pads for F22/F23 chassis",
    price_msrp: 89.95,
    is_discontinued: false,
    category_name: "Brake System",
    compatible_chassis: ["F22", "F23"],
    compatible_engines: ["B48", "B58", "N20"]
  },
  {
    id: 3,
    part_number: "11617531423",
    part_name: "Charge Pipe",
    description: "Turbo charge pipe for N20/B48 engines",
    price_msrp: 156.50,
    is_discontinued: false,
    category_name: "Forced Induction",
    compatible_chassis: ["F22", "F23"],
    compatible_engines: ["N20", "B48"]
  },
  {
    id: 4,
    part_number: "13717571355",
    part_name: "Air Filter",
    description: "Engine air filter for B48/B58 engines",
    price_msrp: 32.50,
    is_discontinued: false,
    category_name: "Engine Components",
    compatible_chassis: ["F22", "F23"],
    compatible_engines: ["B48", "B58"]
  }
]

export function TwoSeriesShowcase() {
  const [parts, setParts] = useState(twoSeriesParts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading BMW 2 Series parts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unable to load parts</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          BMW 2 Series Parts Collection
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive parts catalog for F22 and F23 BMW 2 Series models. 
          From maintenance essentials to performance upgrades.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">F22/F23</div>
            <div className="text-sm text-gray-600">Chassis Supported</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Wrench className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,200+</div>
            <div className="text-sm text-gray-600">Parts Available</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">15+</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Parts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {parts.map((part) => (
          <Card key={part.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{part.part_name}</CardTitle>
                <Badge variant="secondary" className="ml-2 shrink-0">
                  {part.category_name}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                Part #{part.part_number}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {part.description}
              </p>
              
              {/* Compatibility */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Car className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {part.compatible_chassis.map((chassis) => (
                      <Badge key={chassis} variant="outline" className="text-xs">
                        {chassis}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {part.compatible_engines.map((engine) => (
                      <Badge key={engine} variant="outline" className="text-xs">
                        {engine}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  ${part.price_msrp.toFixed(2)}
                </span>
                <Button size="sm" asChild>
                  <Link href={`/parts/${part.part_number}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/browse?series=F22">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Browse All 2 Series Parts
          </Button>
        </Link>
      </div>
    </div>
  )
}
