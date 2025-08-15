"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, Settings, LogOut, Wrench, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { OfflineAuthSystem, type OfflineUser } from "@/lib/offline-auth"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function UserMenu() {
  const [user, setUser] = useState<SupabaseUser | OfflineUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  useEffect(() => {
    // Check for offline user first
    const offlineUser = OfflineAuthSystem.getCurrentUser()
    if (offlineUser) {
      setUser(offlineUser)
      setIsOfflineMode(true)
      setLoading(false)
      return
    }

    // Get initial user from Supabase
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
        setIsOfflineMode(false)
        setLoading(false)
      } catch (error) {
        console.error("Failed to get Supabase user:", error)
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsOfflineMode(false)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    if (isOfflineMode) {
      OfflineAuthSystem.signOut()
      setUser(null)
      setIsOfflineMode(false)
    } else {
      await supabase.auth.signOut()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </div>
    )
  }

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata?.avatar_url || "/placeholder.svg"}
              alt={user.user_metadata?.full_name || user.email || "User"}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || "BMW Enthusiast"}
              {isOfflineMode && <span className="text-xs text-blue-600"> (Demo)</span>}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/maintenance" className="cursor-pointer">
            <Wrench className="mr-2 h-4 w-4" />
            <span>My Vehicles</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/sell" className="cursor-pointer">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Sell Parts</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span className="text-red-600">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
