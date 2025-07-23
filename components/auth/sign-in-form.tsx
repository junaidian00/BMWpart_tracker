"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn, createTestUser } from "@/lib/auth"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Attempting sign in...")
      setSuccess("Signing you in...")

      await signIn(email, password)

      setSuccess("Sign in successful! Redirecting...")

      setTimeout(() => {
        router.push("/maintenance")
        router.refresh()
      }, 1000)
    } catch (err: any) {
      console.error("Sign in error:", err)
      if (err.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials.")
      } else {
        setError(err.message || "Failed to sign in. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTestUser = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Creating test user...")
      setSuccess("Creating test account...")

      await createTestUser()

      setSuccess("Test account created! Redirecting...")

      setTimeout(() => {
        router.push("/maintenance")
        router.refresh()
      }, 1000)
    } catch (err: any) {
      console.error("Test user error:", err)
      setError(err.message || "Failed to create test user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your BMWParts account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Quick Test Options */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Quick Start</h4>
            </div>
            <p className="text-sm text-blue-700 mb-3">Get started immediately - no email verification required!</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestUser}
                disabled={loading}
                className="bg-transparent"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Test Account
              </Button>
              <Link href="/auth/sign-up">
                <Button variant="outline" size="sm" className="bg-transparent" disabled={loading}>
                  Create New Account
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center space-y-2">
            <div className="text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
                Sign up instantly
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
