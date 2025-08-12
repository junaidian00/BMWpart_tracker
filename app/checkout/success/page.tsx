"use client"

import { CheckCircle, Package, Truck, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const orderNumber = `BMW-${Date.now().toString().slice(-6)}`
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Order Number:</span>
                <p className="font-mono font-semibold">{orderNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Order Date:</span>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className="ml-2">Processing</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Estimated Delivery:</span>
                <p className="font-semibold">{estimatedDelivery}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Shipping Method:</span>
                <p>Standard Shipping (5-7 business days)</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Tracking:</span>
                <p className="text-gray-500">Available once shipped</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Order Confirmation Email</h4>
                  <p className="text-sm text-gray-600">
                    You'll receive an email confirmation with your order details shortly.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Order Processing</h4>
                  <p className="text-sm text-gray-600">
                    We'll prepare your BMW parts for shipment within 1-2 business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Shipping Notification</h4>
                  <p className="text-sm text-gray-600">
                    Once shipped, you'll receive tracking information to monitor your delivery.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/browse">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">View Order History</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@bmwparts.com" className="text-blue-600 hover:underline">
              support@bmwparts.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
