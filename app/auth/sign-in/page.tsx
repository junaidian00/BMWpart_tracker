import type { Metadata } from "next"
import SignInClient from "./sign-in-client"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Access your account.",
}

// Important: route config must be on a Server Component
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function SignInPage() {
  return (
    <main className="min-h-[60vh] container mx-auto max-w-md p-6">
      <SignInClient />
    </main>
  )
}
