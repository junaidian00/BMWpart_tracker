"use client"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Car } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { signInWithEmail, createTestUser } from "@/lib/auth"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg(null)
    setErrorMsg(null)
    try {
      await signInWithEmail(email, password)
      setSuccessMsg("Signed in successfully.")
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to sign in.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTestUser = async () => {
    setLoading(true)
    setSuccessMsg(null)
    setErrorMsg(null)
    try {
      const { email: testEmail, password: testPassword } = await createTestUser()
      setEmail(testEmail)
      setPassword(testPassword)
      setSuccessMsg(`Test user created. Email: ${testEmail}`)
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Failed to create test user.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <Car className="h-8 w-8 text-gray-800" />
          <span className="text-2xl font-bold text-gray-900">BMWParts</span>
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMsg && (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertTitle>Sign-in failed</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}
            {successMsg && (
              <Alert role="status" aria-live="polite">
                <AlertDescription>{successMsg}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignIn} className="space-y-3">
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleCreateTestUser}
                disabled={loading}
              >
                {loading ? "Working..." : "Create test user"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => (window.location.href = "/")}
                disabled={loading}
              >
                Back home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
