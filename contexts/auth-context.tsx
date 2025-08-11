"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

type AuthUser = {
  id: string
  email?: string | null
} | null

type AuthContextValue = {
  user: AuthUser
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let unsub: (() => void) | undefined

    async function init() {
      try {
        if (!isSupabaseConfigured) {
          // Demo mode: no auth, immediately done.
          setUser(null)
          return
        }
        const { data } = await supabase.auth.getUser()
        setUser(data?.user ? { id: data.user.id, email: (data.user as any).email } : null)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ? { id: session.user.id, email: (session.user as any).email } : null)
        })
        unsub = () => listener?.subscription?.unsubscribe?.()
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    init()

    return () => {
      try {
        unsub?.()
      } catch {}
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signOut: async () => {
        try {
          if (isSupabaseConfigured) {
            await supabase.auth.signOut()
          }
          setUser(null)
        } catch {}
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
