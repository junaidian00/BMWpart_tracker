"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, LogIn, UserPlus, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSupabaseClientWithTimeout, isSupabaseConfigured } from "@/lib/supabase"
import { OfflineAuthSystem } from "@/lib/offline-auth"

export function SignInForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Always try offline mode first for deployment reliability
    try {
      await OfflineAuthSystem.signIn(email, password)
      router.push("/maintenance")
      router.refresh()
      return
    } catch (offlineError: any) {
      // If offline auth fails, try Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const supabase = getSupabaseClientWithTimeout()
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (authError) {
            // Fall back to offline mode if Supabase fails
            await OfflineAuthSystem.signIn(email, password)
            router.push("/maintenance")
            router.refresh()
            return
          }

          if (data.user) {
            router.push("/maintenance")
            router.refresh()
            return
          }
        } catch (supabaseError: any) {
          console.error("Supabase sign-in failed, using offline mode:", supabaseError)
          // Final fallback to offline mode
          try {
            await OfflineAuthSystem.signIn(email, password)
            router.push("/maintenance")
            router.refresh()
            return
          } catch (finalError: any) {
            setError(finalError.message)
          }
        }
      } else {
        setError(offlineError.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Access your BMW Parts account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Sign-in failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-9"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                className="pl-9"
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign in
              </>
            )}
          </Button>

          <div className="flex items-center justify-center">
            <Link href="/auth/sign-up" className="text-sm text-blue-600 hover:underline inline-flex items-center">
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Create an account
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
