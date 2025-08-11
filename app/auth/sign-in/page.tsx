// app/auth/sign-in/page.tsx
// Server Component wrapper for the Sign In route.
// Route config must be exported from a Server Component.

export const dynamic = "force-dynamic"
export const revalidate: number | false = 0
export const fetchCache = "force-no-store"

import SignInClient from "./sign-in-client"

export default function SignInPage() {
  return <SignInClient />
}
