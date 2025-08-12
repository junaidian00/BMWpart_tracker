"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

export function CartButton() {
  const { totalItems, setIsOpen } = useCart()

  return (
    <Button variant="ghost" size="sm" className="relative" onClick={() => setIsOpen(true)}>
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {totalItems > 99 ? "99+" : totalItems}
        </Badge>
      )}
    </Button>
  )
}
