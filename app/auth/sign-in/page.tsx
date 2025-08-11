import { Suspense } from "react"
import SignInClient from "./sign-in-client"

// Ensure this route never tries to statically prerender with client-only values.
export const revalidate = 0
export const dynamic = "force-dynamic"

export default function SignInPage() {
  return (
    <section className="mx-auto max-w-sm p-6">
      <Suspense>
        <SignInClient />
      </Suspense>
    </section>
  )
}
