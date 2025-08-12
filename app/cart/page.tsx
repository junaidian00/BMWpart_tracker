"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const shippingCost = totalPrice > 100 ? 0 : 15.99
  const tax = totalPrice * 0.08 // 8% tax
  const finalTotal = totalPrice + shippingCost + tax

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/browse">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">
                {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700 bg-transparent">
              Clear Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Looks like you haven't added any BMW parts to your cart yet.</p>
              <Button asChild>
                <Link href="/browse">Browse Parts</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.partName}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag className="h-8 w-8 text-gray-400" />
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.partName}</h3>
                        <p className="text-sm text-gray-600 font-mono mb-2">Part Number: {item.partNumber}</p>
                        {item.category && (
                          <Badge variant="outline" className="mb-2">
                            {item.category}
                          </Badge>
                        )}
                        {item.compatibility && item.compatibility.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.compatibility.slice(0, 3).map((comp, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {comp}
                              </Badge>
                            ))}
                            {item.compatibility.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{item.compatibility.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Price and Controls */}
                      <div className="text-right space-y-4">
                        <div>
                          <p className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">each</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>

                  {totalPrice < 100 && (
                    <p className="text-sm text-gray-600">
                      Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Promo Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Button */}
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Link>
              </Button>

              {/* Security Notice */}
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 text-center">🔒 Secure checkout with SSL encryption</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
