"use client"

import { useState } from "react"
import { CreditCard, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MockPaymentProcessor } from "@/lib/payment"

interface PaymentFormProps {
  amount: number
  onPaymentMethodChange: (method: "card" | "paypal") => void
  onCardDataChange: (data: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardName: string
  }) => void
  paymentMethod: "card" | "paypal"
  cardData: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardName: string
  }
}

export function PaymentForm({
  amount,
  onPaymentMethodChange,
  onCardDataChange,
  paymentMethod,
  cardData,
}: PaymentFormProps) {
  const [cardType, setCardType] = useState("")

  const handleCardNumberChange = (value: string) => {
    const formatted = MockPaymentProcessor.formatCardNumber(value)
    const type = MockPaymentProcessor.getCardType(formatted)
    setCardType(type)
    onCardDataChange({
      ...cardData,
      cardNumber: formatted,
    })
  }

  const handleExpiryDateChange = (value: string) => {
    const formatted = MockPaymentProcessor.formatExpiryDate(value)
    onCardDataChange({
      ...cardData,
      expiryDate: formatted,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">Credit/Debit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === "card" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                value={cardData.cardName}
                onChange={(e) =>
                  onCardDataChange({
                    ...cardData,
                    cardName: e.target.value,
                  })
                }
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  value={cardData.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
                {cardType && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    {cardType}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={cardData.expiryDate}
                  onChange={(e) => handleExpiryDateChange(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cardData.cvv}
                  onChange={(e) =>
                    onCardDataChange({
                      ...cardData,
                      cvv: e.target.value.replace(/\D/g, "").substr(0, 4),
                    })
                  }
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center text-sm text-blue-800">
                <Lock className="h-4 w-4 mr-2" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <p>Test card numbers:</p>
              <p>• 4111 1111 1111 1111 (Visa - Success)</p>
              <p>• 4000 0000 0000 0002 (Visa - Declined)</p>
              <p>• 5555 5555 5555 4444 (Mastercard - Success)</p>
            </div>
          </div>
        )}

        {paymentMethod === "paypal" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              You will be redirected to PayPal to complete your payment of ${amount.toFixed(2)}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
