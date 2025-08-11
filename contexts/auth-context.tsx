"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { getCurrentUser as getCurrentUserApi, signOut as signOutApi, type AuthUser } from "@/lib/auth"

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const supabase = getSupabaseClient()

    const init = async () => {
      try {
        const u = await getCurrentUserApi()
        if (mounted) setUser(u)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    init()

    const { data: subscription } = supabase.auth.onAuthStateChange(async () => {
      const u = await getCurrentUserApi()
      if (mounted) setUser(u)
    })

    return () => {
      mounted = false
      // Compat: older/newer supabase clients expose either unsubscribe() or subscription.unsubscribe()
      // @ts-ignore
      subscription?.subscription?.unsubscribe?.()
      // @ts-ignore
      subscription?.unsubscribe?.()
    }
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const u = await getCurrentUserApi()
      setUser(u)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await signOutApi()
    await refresh()
  }

  const value = useMemo(() => ({ user, loading, refresh, signOut }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
