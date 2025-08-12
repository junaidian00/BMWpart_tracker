import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClientProviders } from "@/components/providers/client-providers"
import { MainNav } from "@/components/layout/main-nav"
import { CartDrawer } from "@/components/cart/cart-drawer"

export const metadata: Metadata = {
  title: "BMW Parts Marketplace - F22, F23, F30, F32, F33, F36 Specialists",
  description:
    "The ultimate marketplace for BMW F-chassis parts. Find OEM and aftermarket parts for your F22, F23, F30, F31, F32, F33, and F36 BMW with comprehensive compatibility information.",
  keywords: "BMW parts, F30, F32, F33, F36, F22, F23, OEM parts, BMW marketplace, 3 series, 4 series, 2 series",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <ClientProviders>
          {/* Ensure every component using useAuth is inside the provider */}
          <MainNav />
          <main className="min-h-screen pt-16">{children}</main>
          <CartDrawer />
        </ClientProviders>
      </body>
    </html>
  )
}
