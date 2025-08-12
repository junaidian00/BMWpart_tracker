"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, CreditCard, Truck, MapPin, User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { PaymentForm } from "@/components/payment/payment-form"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { createOrder, type CreateOrderData } from "@/lib/orders"
import type { PaymentRequest } from "@/lib/payment"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  billingAddress: string
  billingCity: string
  billingState: string
  billingZipCode: string
  billingCountry: string
  sameAsShipping: boolean
  paymentMethod: "card" | "paypal"
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CheckoutForm>({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "US",
    sameAsShipping: true,
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const shippingCost = totalPrice > 100 ? 0 : 15.99
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + shippingCost + tax

  const updateForm = (field: keyof CheckoutForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create order data
      const orderData: CreateOrderData = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        country: form.country,
        billingAddress: form.sameAsShipping ? undefined : form.billingAddress,
        billingCity: form.sameAsShipping ? undefined : form.billingCity,
        billingState: form.sameAsShipping ? undefined : form.billingState,
        billingZipCode: form.sameAsShipping ? undefined : form.billingZipCode,
        billingCountry: form.sameAsShipping ? undefined : form.billingCountry,
        sameAsShipping: form.sameAsShipping,
        paymentMethod: form.paymentMethod,
        items,
        subtotal: totalPrice,
        shippingCost,
        taxAmount: tax,
        totalAmount: finalTotal,
      }

      // Create order in database first
      const order = await createOrder(orderData, user?.id)

      // Process payment
      const paymentRequest: PaymentRequest = {
        amount: finalTotal,
        currency: "USD",
        orderId: order.id,
        customerEmail: form.email,
        description: `BMW Parts Order ${order.order_number}`,
        paymentMethod: {
          type: form.paymentMethod,
          cardNumber: form.cardNumber.replace(/\s/g, ""),
          expiryDate: form.expiryDate,
          cvv: form.cvv,
          cardName: form.cardName,
        },
      }

      const response = await fetch("/api/payment/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      })

      const paymentResult = await response.json()

      if (!response.ok) {
        throw new Error(paymentResult.error || "Payment failed")
      }

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Payment was declined")
      }

      toast({
        title: "Order placed successfully!",
        description: `Your order ${order.order_number} has been confirmed and payment processed.`,
      })

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/checkout/success?order=${order.order_number}&transaction=${paymentResult.transactionId}`)
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Order failed",
        description: error.message || "There was an error processing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
              <Button asChild>
                <Link href="/browse">Browse Parts</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 1, name: "Shipping", icon: Truck },
    { id: 2, name: "Payment", icon: CreditCard },
    { id: 3, name: "Review", icon: Lock },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600">{totalItems} items in your order</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ml-4 ${isCompleted ? "bg-green-600" : "bg-gray-300"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={form.firstName}
                          onChange={(e) => updateForm("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={form.lastName}
                          onChange={(e) => updateForm("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        required
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </h3>
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={(e) => updateForm("address", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={form.city}
                          onChange={(e) => updateForm("city", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={form.state}
                          onChange={(e) => updateForm("state", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={form.zipCode}
                          onChange={(e) => updateForm("zipCode", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={form.country}
                          onChange={(e) => updateForm("country", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => setCurrentStep(2)}>
                        Continue to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <>
                  <PaymentForm
                    amount={finalTotal}
                    paymentMethod={form.paymentMethod}
                    onPaymentMethodChange={(method) => updateForm("paymentMethod", method)}
                    cardData={{
                      cardNumber: form.cardNumber,
                      expiryDate: form.expiryDate,
                      cvv: form.cvv,
                      cardName: form.cardName,
                    }}
                    onCardDataChange={(data) => {
                      updateForm("cardNumber", data.cardNumber)
                      updateForm("expiryDate", data.expiryDate)
                      updateForm("cvv", data.cvv)
                      updateForm("cardName", data.cardName)
                    }}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox
                          id="sameAsShipping"
                          checked={form.sameAsShipping}
                          onCheckedChange={(checked) => updateForm("sameAsShipping", checked as boolean)}
                        />
                        <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                      </div>

                      {!form.sameAsShipping && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="billingAddress">Street Address</Label>
                            <Input
                              id="billingAddress"
                              value={form.billingAddress}
                              onChange={(e) => updateForm("billingAddress", e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="billingCity">City</Label>
                              <Input
                                id="billingCity"
                                value={form.billingCity}
                                onChange={(e) => updateForm("billingCity", e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="billingState">State</Label>
                              <Input
                                id="billingState"
                                value={form.billingState}
                                onChange={(e) => updateForm("billingState", e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between mt-6">
                        <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                          Back to Shipping
                        </Button>
                        <Button type="button" onClick={() => setCurrentStep(3)}>
                          Review Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Review Your Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Information</h3>
                      <div className="text-sm text-gray-600">
                        <p>
                          {form.firstName} {form.lastName}
                        </p>
                        <p>{form.address}</p>
                        <p>
                          {form.city}, {form.state} {form.zipCode}
                        </p>
                        <p>{form.country}</p>
                        <p>{form.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Payment Method</h3>
                      <div className="text-sm text-gray-600">
                        {form.paymentMethod === "card" ? (
                          <p>Credit Card ending in {form.cardNumber.replace(/\s/g, "").slice(-4)}</p>
                        ) : (
                          <p>PayPal</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                        Back to Payment
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Processing..." : `Place Order - $${finalTotal.toFixed(2)}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-medium">{item.quantity}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.partName}</p>
                          <p className="text-xs text-gray-600 font-mono">{item.partNumber}</p>
                          {item.category && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Lock className="h-4 w-4 mr-2" />
                    Secure SSL encrypted checkout
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
