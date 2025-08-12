import { type NextRequest, NextResponse } from "next/server"
import { PaymentProcessor, type PaymentRequest } from "@/lib/payment"
import { updateOrderStatus } from "@/lib/orders"

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json()

    // Validate request
    if (!body.amount || !body.orderId || !body.customerEmail || !body.paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate payment method
    const processor = PaymentProcessor.getInstance()
    const validation = processor.validatePaymentMethod(body.paymentMethod)

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: "Invalid payment method",
          details: validation.errors,
        },
        { status: 400 },
      )
    }

    // Process payment
    const result = await processor.processPayment(body)

    if (result.success) {
      // Update order status to paid
      try {
        await updateOrderStatus(body.orderId, "processing")
      } catch (error) {
        console.error("Failed to update order status:", error)
        // Don't fail the payment if order update fails
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
