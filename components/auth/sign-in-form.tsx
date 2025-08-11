"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, LogIn, UserPlus, TestTube2, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { getMissingSupabaseEnv } from "@/lib/supabase"

export function SignInForm() {
  const { signIn, createTestUser, loading, envReady } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testCreds, setTestCreds] = useState<{ email: string; password: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await signIn(email, password)
    } catch (err: any) {
      setError(err?.message ?? "Failed to sign in")
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateTestUser = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const creds = await createTestUser()
      setTestCreds(creds)
      // Optionally auto-fill the form with new creds
      setEmail(creds.email)
      setPassword(creds.password)
    } catch (err: any) {
      setError(err?.message ?? "Failed to create test user")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Access your BMW Parts account</CardDescription>
      </CardHeader>
      <CardContent>
        {!envReady && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Supabase is not configured</AlertTitle>
            <AlertDescription>
              Missing environment variables: {getMissingSupabaseEnv().join(", ")}. Add them to preview auth.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" aria-disabled={!envReady}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!envReady || submitting || loading}
                autoComplete="email"
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
                type="password"
                placeholder="Your password"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!envReady || submitting || loading}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Sign-in failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={!envReady || submitting || loading}>
            <LogIn className="h-4 w-4 mr-2" />
            {submitting ? "Signing in..." : "Sign in"}
          </Button>

          <div className="flex items-center justify-between">
            <Link href="/auth/sign-up" className="text-sm text-blue-600 hover:underline inline-flex items-center">
              <UserPlus className="h-3.5 w-3.5 mr-1" />
              Create an account
            </Link>
            <button
              type="button"
              onClick={handleCreateTestUser}
              className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center"
              disabled={!envReady || submitting || loading}
              aria-label="Create a test user"
            >
              <TestTube2 className="h-3.5 w-3.5 mr-1" />
              Create test user
            </button>
          </div>

          {testCreds && (
            <Alert className="mt-4">
              <AlertTitle>Test user created</AlertTitle>
              <AlertDescription>
                Email: {testCreds.email}
                <br />
                Password: {testCreds.password}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
