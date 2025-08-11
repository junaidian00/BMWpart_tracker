"use client"

import type React from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import Link from "next/link"
import { Car } from "lucide-react"
import { useState } from "react"
import { isSupabaseConfigured, getSupabaseClient } from "@/lib/supabase"
import { createTestUser, signInWithEmail } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const supabaseReady = isSupabaseConfigured()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    try {
      await signInWithEmail(email, password)
      setMessage("Signed in successfully.")
    } catch (err: any) {
      setMessage(err?.message ?? "Failed to sign in.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTestUser = async () => {
    setMessage(null)
    setLoading(true)
    try {
      const { email: testEmail, password: testPassword } = await createTestUser()
      setEmail(testEmail)
      setPassword(testPassword)
      setMessage(`Test user created. Email: ${testEmail}`)
    } catch (err: any) {
      setMessage(err?.message ?? "Failed to create test user.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">BMWParts</span>
          </Link>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!supabaseReady && (
                <Alert variant="destructive" role="alert" aria-live="polite">
                  <AlertTitle>Supabase is not configured</AlertTitle>
                  <AlertDescription>
                    Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your project Environment Variables
                    to enable authentication. After setting, refresh this page.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSignIn} className="space-y-3" aria-disabled={!supabaseReady}>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!supabaseReady || loading}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!supabaseReady || loading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!supabaseReady || loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </form>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleCreateTestUser}
                  disabled={!supabaseReady || loading}
                >
                  {loading ? "Working..." : "Create test user"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={async () => {
                    try {
                      const supabase = getSupabaseClient()
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: "github",
                        options: { redirectTo: `${location.origin}/` },
                      })
                      if (error) throw error
                    } catch (err: any) {
                      setMessage(err?.message ?? "OAuth sign-in failed.")
                    }
                  }}
                  disabled={!supabaseReady || loading}
                >
                  Continue with GitHub
                </Button>
              </div>

              {message && (
                <Alert role="status" aria-live="polite">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
