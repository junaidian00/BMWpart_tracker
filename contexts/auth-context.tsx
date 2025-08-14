"use client"

import type React from "react"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

type AuthUser = {
  id: string
  email?: string | null
  full_name?: string | null
  avatar_url?: string | null
} | null

type AuthContextValue = {
  user: AuthUser
  loading: boolean
  envReady: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  createTestUser: () => Promise<{ email: string; password: string }>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  envReady: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  createTestUser: async () => ({ email: "", password: "" }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

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
        setUser(
          data?.user
            ? {
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name,
                avatar_url: data.user.user_metadata?.avatar_url,
              }
            : null,
        )

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(
            session?.user
              ? {
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name,
                  avatar_url: session.user.user_metadata?.avatar_url,
                }
              : null,
          )
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

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode: simulate successful sign-in
      setUser({ id: "demo-user", email, full_name: "Demo User" })
      router.push("/dashboard")
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw new Error(error.message)
    }
    router.push("/dashboard")
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode: simulate successful sign-up
      setUser({ id: "demo-user", email, full_name: fullName || "Demo User" })
      router.push("/dashboard")
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const createTestUser = async (): Promise<{ email: string; password: string }> => {
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = "testpassword123"

    if (!isSupabaseConfigured) {
      // Demo mode: return test credentials
      return { email: testEmail, password: testPassword }
    }

    const { error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: "Test User",
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return { email: testEmail, password: testPassword }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      envReady: isSupabaseConfigured, // Added envReady property
      signIn,
      signUp,
      signOut: async () => {
        try {
          if (isSupabaseConfigured) {
            await supabase.auth.signOut()
          }
          setUser(null)
          router.push("/")
        } catch {}
      },
      createTestUser,
    }),
    [user, loading, router],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
