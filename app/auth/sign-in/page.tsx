import SignInClient from "./sign-in-client"

// Server route config must be exported from a Server Component (this file).
export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default function SignInPage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <SignInClient />
    </main>
  )
}
