export interface PaymentMethod {
  type: "card" | "paypal"
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  cardName?: string
  paypalEmail?: string
}

export interface PaymentRequest {
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  orderId: string
  customerEmail: string
  description: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
  paymentMethod: string
  amount: number
  currency: string
}

// Mock payment processor for demo purposes
export class MockPaymentProcessor {
  static async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate payment validation
    if (request.paymentMethod.type === "card") {
      const { cardNumber, expiryDate, cvv, cardName } = request.paymentMethod

      // Basic validation
      if (!cardNumber || cardNumber.length < 16) {
        return {
          success: false,
          error: "Invalid card number",
          paymentMethod: "card",
          amount: request.amount,
          currency: request.currency,
        }
      }

      if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
        return {
          success: false,
          error: "Invalid expiry date",
          paymentMethod: "card",
          amount: request.amount,
          currency: request.currency,
        }
      }

      if (!cvv || cvv.length < 3) {
        return {
          success: false,
          error: "Invalid CVV",
          paymentMethod: "card",
          amount: request.amount,
          currency: request.currency,
        }
      }

      if (!cardName || cardName.trim().length < 2) {
        return {
          success: false,
          error: "Invalid cardholder name",
          paymentMethod: "card",
          amount: request.amount,
          currency: request.currency,
        }
      }

      // Simulate some cards failing (for testing)
      if (cardNumber.includes("4000000000000002")) {
        return {
          success: false,
          error: "Card declined",
          paymentMethod: "card",
          amount: request.amount,
          currency: request.currency,
        }
      }
    }

    // Simulate successful payment
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentMethod: request.paymentMethod.type,
      amount: request.amount,
      currency: request.currency,
    }
  }

  static validateCardNumber(cardNumber: string): boolean {
    // Remove spaces and non-digits
    const cleaned = cardNumber.replace(/\D/g, "")

    // Check length
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false
    }

    // Luhn algorithm
    let sum = 0
    let isEven = false

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cleaned.charAt(i), 10)

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  static getCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\D/g, "")

    if (cleaned.match(/^4/)) return "Visa"
    if (cleaned.match(/^5[1-5]/)) return "Mastercard"
    if (cleaned.match(/^3[47]/)) return "American Express"
    if (cleaned.match(/^6/)) return "Discover"

    return "Unknown"
  }

  static formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\D/g, "")
    const groups = cleaned.match(/.{1,4}/g) || []
    return groups.join(" ").substr(0, 19) // Max 4 groups of 4 digits
  }

  static formatExpiryDate(expiryDate: string): string {
    const cleaned = expiryDate.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + (cleaned.length > 2 ? "/" + cleaned.substr(2, 2) : "")
    }
    return cleaned
  }
}

// Future integration points for real payment processors
export interface StripeConfig {
  publishableKey: string
  secretKey: string
}

export interface PayPalConfig {
  clientId: string
  clientSecret: string
  environment: "sandbox" | "production"
}

export class PaymentProcessor {
  private static instance: PaymentProcessor
  private stripeConfig?: StripeConfig
  private paypalConfig?: PayPalConfig

  private constructor() {}

  static getInstance(): PaymentProcessor {
    if (!PaymentProcessor.instance) {
      PaymentProcessor.instance = new PaymentProcessor()
    }
    return PaymentProcessor.instance
  }

  configure(config: { stripe?: StripeConfig; paypal?: PayPalConfig }) {
    this.stripeConfig = config.stripe
    this.paypalConfig = config.paypal
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // For now, use mock processor
    // In production, this would route to appropriate payment provider
    return MockPaymentProcessor.processPayment(request)
  }

  validatePaymentMethod(paymentMethod: PaymentMethod): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (paymentMethod.type === "card") {
      if (!paymentMethod.cardNumber) {
        errors.push("Card number is required")
      } else if (!MockPaymentProcessor.validateCardNumber(paymentMethod.cardNumber)) {
        errors.push("Invalid card number")
      }

      if (!paymentMethod.expiryDate) {
        errors.push("Expiry date is required")
      } else if (!paymentMethod.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        errors.push("Invalid expiry date format (MM/YY)")
      } else {
        // Check if card is expired
        const [month, year] = paymentMethod.expiryDate.split("/")
        const expiry = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1)
        if (expiry < new Date()) {
          errors.push("Card has expired")
        }
      }

      if (!paymentMethod.cvv) {
        errors.push("CVV is required")
      } else if (paymentMethod.cvv.length < 3 || paymentMethod.cvv.length > 4) {
        errors.push("Invalid CVV")
      }

      if (!paymentMethod.cardName) {
        errors.push("Cardholder name is required")
      } else if (paymentMethod.cardName.trim().length < 2) {
        errors.push("Invalid cardholder name")
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
