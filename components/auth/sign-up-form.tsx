"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, UserPlus, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSupabaseClientWithTimeout, isSupabaseConfigured } from "@/lib/supabase"

export function SignUpForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    if (!isSupabaseConfigured()) {
      setSuccess("Demo account created! Redirecting to maintenance tracker...")
      setTimeout(() => {
        router.push("/maintenance")
        router.refresh()
      }, 2000)
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClientWithTimeout()
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/maintenance`,
        },
      })

      if (authError) {
        if (authError.message.includes("timeout")) {
          setError("Connection timed out. Please try again or use demo mode.")
        } else {
          setError(authError.message)
        }
        return
      }

      if (data.user) {
        if (data.user.email_confirmed_at) {
          setSuccess("Account created successfully! Redirecting...")
          setTimeout(() => {
            router.push("/maintenance")
            router.refresh()
          }, 1500)
        } else {
          setSuccess("Account created! Please check your email to verify your account before signing in.")
        }
      }
    } catch (err: any) {
      console.error("Sign-up error:", err)
      if (err.message.includes("timeout")) {
        setError("Connection timed out. Please check your internet connection and try again.")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>Join the BMW Parts community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Sign-up failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertTitle>Sign-up successful</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full name
            </label>
            <div className="relative">
              <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jane Driver"
                className="pl-9"
                autoComplete="name"
                disabled={loading}
              />
            </div>
          </div>

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
                placeholder="Create a strong password"
                className="pl-9"
                required
                autoComplete="new-password"
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create account
              </>
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
