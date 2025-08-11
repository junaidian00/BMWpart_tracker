"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { isSupabaseConfigured } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  // While checking auth
  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
          Checking authentication...
        </div>
      </div>
    )
  }

  // If Supabase is configured and user is not signed in, block access
  if (isSupabaseConfigured && !user) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>You need to be signed in to access this page.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button asChild>
              <a href="/auth/sign-in">Sign in</a>
            </Button>
            <Button variant="outline" className="bg-transparent" asChild>
              <a href="/">Go home</a>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  // Demo mode or signed-in -> allow
  return <>{children}</>
}
