"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient, hasSupabaseEnv } from "@/lib/supabase"
import {
  createTestUser as createTestUserLib,
  getCurrentUser as getCurrentUserLib,
  signIn as signInLib,
  signOut as signOutLib,
  signUp as signUpLib,
  type AuthUser,
} from "@/lib/auth"

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  envReady: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  createTestUser: () => Promise<{ email: string; password: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function userFromSupabase(user: User | null): AuthUser | null {
  if (!user) return null
  return {
    id: user.id,
    email: user.email ?? "",
    created_at: user.created_at,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const envReady = hasSupabaseEnv()

  useEffect(() => {
    let unsub: (() => void) | null = null

    async function init() {
      try {
        if (!envReady) {
          setUser(null)
          return
        }
        const supabase = getSupabaseClient()

        // Get current user (with profile if available)
        const current = await getCurrentUserLib()
        setUser(current)

        // Subscribe to auth changes
        const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const fresh = await getCurrentUserLib()
            setUser(fresh)
          } else {
            setUser(null)
          }
        })
        unsub = () => {
          sub.subscription.unsubscribe()
        }
      } finally {
        setLoading(false)
      }
    }
    init()

    return () => {
      if (unsub) unsub()
    }
  }, [envReady])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      loading,
      envReady,
      signIn: async (email: string, password: string) => {
        await signInLib(email, password)
      },
      signUp: async (email: string, password: string, fullName?: string) => {
        await signUpLib(email, password, fullName)
      },
      signOut: async () => {
        await signOutLib()
      },
      createTestUser: async () => {
        const { email, password } = await createTestUserLib()
        return { email, password }
      },
    }
  }, [user, loading, envReady])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
