import { Search, Car, Shield, Truck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { UserMenu } from "@/components/auth/user-menu"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BMWParts</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                Browse Parts
              </Link>
              <Link href="/maintenance" className="text-gray-600 hover:text-gray-900">
                Maintenance Tracker
              </Link>
              <Link href="/3d-simulator" className="text-gray-600 hover:text-gray-900">
                3D Simulator
              </Link>
              <Link href="/forum" className="text-gray-600 hover:text-gray-900">
                Forum
              </Link>
              <Link href="/sell" className="text-gray-600 hover:text-gray-900">
                Sell Parts
              </Link>
              <UserMenu />
              <Link href="/auth/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Get Started</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Find the Perfect BMW Parts</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Compare prices across multiple sellers. Find new OEM, aftermarket, and quality used parts from individuals,
            dismantling companies, and authorized dealers.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by part number, model, or description (e.g., N55 charge pipe)"
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                Search Parts
              </Button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link
              href="/browse?category=engine"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="text-2xl mb-2">🔧</div>
              <div className="font-semibold">Engine Parts</div>
            </Link>
            <Link
              href="/browse?category=suspension"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="text-2xl mb-2">🚗</div>
              <div className="font-semibold">Suspension</div>
            </Link>
            <Link
              href="/browse?category=interior"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="text-2xl mb-2">🪑</div>
              <div className="font-semibold">Interior</div>
            </Link>
            <Link
              href="/browse?category=exterior"
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border"
            >
              <div className="text-2xl mb-2">✨</div>
              <div className="font-semibold">Exterior</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BMWParts?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Quality Guaranteed</CardTitle>
                <CardDescription>Every part comes with detailed condition reports and authentic photos</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Best Prices</CardTitle>
                <CardDescription>
                  Compare prices across multiple sellers and official dealers to find the best deal
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Trusted Community</CardTitle>
                <CardDescription>
                  Connect with verified sellers including individuals, dismantlers, and dealers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Parts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular BMW Parts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt="N55 Charge Pipe"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle>N55 Aluminum Charge Pipe</CardTitle>
                <CardDescription>Upgrade from plastic OEM part. Prevents common failure point.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">$89 - $299</span>
                  <Button variant="outline">View Options</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt="BMW Brake Pads"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle>Brake Pads (Front)</CardTitle>
                <CardDescription>OEM and performance aftermarket options available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">$45 - $180</span>
                  <Button variant="outline">View Options</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt="BMW Oil Filter"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle>Oil Filter Kit</CardTitle>
                <CardDescription>Complete oil change kit with filter and drain plug</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">$12 - $35</span>
                  <Button variant="outline">View Options</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Parts?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of BMW enthusiasts finding quality parts at the best prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Browse All Parts
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Start Selling
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6" />
                <span className="text-xl font-bold">BMWParts</span>
              </div>
              <p className="text-gray-400">The trusted marketplace for BMW parts and accessories.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Shop</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/browse">Browse Parts</Link>
                </li>
                <li>
                  <Link href="/new">New Parts</Link>
                </li>
                <li>
                  <Link href="/used">Used Parts</Link>
                </li>
                <li>
                  <Link href="/oem">OEM Parts</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Sell</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/sell">List Your Parts</Link>
                </li>
                <li>
                  <Link href="/seller-guide">Seller Guide</Link>
                </li>
                <li>
                  <Link href="/pricing">Pricing</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/returns">Returns</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BMWParts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
