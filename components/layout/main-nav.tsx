"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car } from "lucide-react"
import { UserMenu } from "@/components/auth/user-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Browse Parts", href: "/browse" },
  { name: "Maintenance Tracker", href: "/maintenance" },
  { name: "3D Simulator", href: "/3d-simulator" },
  { name: "Forum", href: "/forum" },
  { name: "Sell Parts", href: "/sell" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BMWParts</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-600",
                  pathname.startsWith(item.href) ? "text-blue-600" : "text-gray-600",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <UserMenu />
            <Link href="/auth/sign-in">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
