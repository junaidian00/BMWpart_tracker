import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthGuard } from "@/components/auth/auth-guard"
import Link from "next/link"
import { Car } from "lucide-react"

export default function SignInPage() {
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
          <SignInForm />
        </div>
      </div>
    </AuthGuard>
  )
}
