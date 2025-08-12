import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import type { CartItem } from "@/contexts/cart-context"

export interface Order {
  id: string
  user_id?: string
  order_number: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"

  // Customer Information
  email: string
  first_name: string
  last_name: string
  phone?: string

  // Shipping Address
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip_code: string
  shipping_country: string

  // Billing Address
  billing_address?: string
  billing_city?: string
  billing_state?: string
  billing_zip_code?: string
  billing_country?: string
  same_as_shipping: boolean

  // Payment Information
  payment_method: "card" | "paypal"
  payment_status: "pending" | "paid" | "failed" | "refunded"

  // Order Totals
  subtotal: number
  shipping_cost: number
  tax_amount: number
  total_amount: number

  // Timestamps
  created_at: string
  updated_at: string
  shipped_at?: string
  delivered_at?: string

  // Related data
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  part_number: string
  part_name: string
  category?: string
  unit_price: number
  quantity: number
  total_price: number
  compatible_chassis?: string[]
  compatible_engines?: string[]
  created_at: string
}

export interface CreateOrderData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  billingAddress?: string
  billingCity?: string
  billingState?: string
  billingZipCode?: string
  billingCountry?: string
  sameAsShipping: boolean
  paymentMethod: "card" | "paypal"
  items: CartItem[]
  subtotal: number
  shippingCost: number
  taxAmount: number
  totalAmount: number
}

export async function createOrder(orderData: CreateOrderData, userId?: string): Promise<Order> {
  if (!isSupabaseConfigured) {
    // Demo mode - return mock order
    const mockOrder: Order = {
      id: `demo-${Date.now()}`,
      user_id: userId,
      order_number: `BMW-${Date.now().toString().slice(-6)}`,
      status: "pending",
      email: orderData.email,
      first_name: orderData.firstName,
      last_name: orderData.lastName,
      phone: orderData.phone,
      shipping_address: orderData.address,
      shipping_city: orderData.city,
      shipping_state: orderData.state,
      shipping_zip_code: orderData.zipCode,
      shipping_country: orderData.country,
      billing_address: orderData.sameAsShipping ? undefined : orderData.billingAddress,
      billing_city: orderData.sameAsShipping ? undefined : orderData.billingCity,
      billing_state: orderData.sameAsShipping ? undefined : orderData.billingState,
      billing_zip_code: orderData.sameAsShipping ? undefined : orderData.billingZipCode,
      billing_country: orderData.sameAsShipping ? undefined : orderData.billingCountry,
      same_as_shipping: orderData.sameAsShipping,
      payment_method: orderData.paymentMethod,
      payment_status: "pending",
      subtotal: orderData.subtotal,
      shipping_cost: orderData.shippingCost,
      tax_amount: orderData.taxAmount,
      total_amount: orderData.totalAmount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return mockOrder
  }

  try {
    // Generate order number
    const orderNumber = `BMW-${Date.now().toString().slice(-6)}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        order_number: orderNumber,
        email: orderData.email,
        first_name: orderData.firstName,
        last_name: orderData.lastName,
        phone: orderData.phone,
        shipping_address: orderData.address,
        shipping_city: orderData.city,
        shipping_state: orderData.state,
        shipping_zip_code: orderData.zipCode,
        shipping_country: orderData.country,
        billing_address: orderData.sameAsShipping ? null : orderData.billingAddress,
        billing_city: orderData.sameAsShipping ? null : orderData.billingCity,
        billing_state: orderData.sameAsShipping ? null : orderData.billingState,
        billing_zip_code: orderData.sameAsShipping ? null : orderData.billingZipCode,
        billing_country: orderData.sameAsShipping ? null : orderData.billingCountry,
        same_as_shipping: orderData.sameAsShipping,
        payment_method: orderData.paymentMethod,
        subtotal: orderData.subtotal,
        shipping_cost: orderData.shippingCost,
        tax_amount: orderData.taxAmount,
        total_amount: orderData.totalAmount,
      })
      .select()
      .single()

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`)
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      part_number: item.partNumber,
      part_name: item.partName,
      category: item.category,
      unit_price: item.price,
      quantity: item.quantity,
      total_price: item.price * item.quantity,
      compatible_chassis: item.compatibility?.filter((c) => c.length <= 5), // Chassis codes are typically short
      compatible_engines: item.compatibility?.filter((c) => c.length > 5), // Engine codes are typically longer
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`)
    }

    return order as Order
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  if (!isSupabaseConfigured) {
    return null
  }

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("id", orderId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch order: ${error.message}`)
    }

    return order as Order
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  if (!isSupabaseConfigured) {
    return null
  }

  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("order_number", orderNumber)
      .single()

    if (error) {
      throw new Error(`Failed to fetch order: ${error.message}`)
    }

    return order as Order
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

export async function getUserOrders(userId: string, limit = 10): Promise<Order[]> {
  if (!isSupabaseConfigured) {
    return []
  }

  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch user orders: ${error.message}`)
    }

    return orders as Order[]
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  additionalData?: Partial<Pick<Order, "shipped_at" | "delivered_at">>,
): Promise<void> {
  if (!isSupabaseConfigured) {
    return
  }

  try {
    const updateData: any = { status }

    if (additionalData?.shipped_at) {
      updateData.shipped_at = additionalData.shipped_at
    }

    if (additionalData?.delivered_at) {
      updateData.delivered_at = additionalData.delivered_at
    }

    const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`)
    }
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}
