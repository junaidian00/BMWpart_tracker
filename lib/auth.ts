import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export interface AuthUser extends User {
  profile?: {
    full_name: string | null
    phone: string | null
    location: string | null
    seller_type: "individual" | "dealer" | "dismantler" | "pick_pull" | null
  }
}

export async function signUp(
  email: string,
  password: string,
  userData: {
    fullName: string
    phone?: string
    location: string
    sellerType: "individual" | "dealer" | "dismantler" | "pick_pull"
  },
) {
  try {
    console.log("Starting sign up process...")

    // Sign up with email confirmation disabled
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation
        data: {
          full_name: userData.fullName,
          phone: userData.phone || null,
          location: userData.location,
          seller_type: userData.sellerType,
        },
      },
    })

    if (error) {
      console.error("Supabase sign up error:", error)
      throw error
    }

    console.log("Sign up successful:", data)

    // Wait a moment for the trigger to create the profile
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return data
  } catch (error) {
    console.error("Sign up error:", error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  console.log("Starting sign in process...")

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign in error:", error)
    throw error
  }

  console.log("Sign in successful:", data)

  // Wait a moment for session to be established
  await new Promise((resolve) => setTimeout(resolve, 500))

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // First check if we have a session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Session error:", sessionError)
      return null
    }

    if (!session?.user) {
      console.log("No active session")
      return null
    }

    const user = session.user

    // Fetch profile data
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.warn("Profile fetch error:", profileError)
      }

      return {
        ...user,
        profile: profile || undefined,
      }
    } catch (profileError) {
      console.warn("Profile fetch failed:", profileError)
      return {
        ...user,
        profile: undefined,
      }
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function updateProfile(
  userId: string,
  updates: {
    full_name?: string
    phone?: string
    location?: string
    seller_type?: "individual" | "dealer" | "dismantler" | "pick_pull"
  },
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Create a test user that works immediately
export async function createTestUser() {
  try {
    const testEmail = `test${Date.now()}@bmwparts.com`
    const testPassword = "testuser123"

    console.log("Creating test user with email:", testEmail)

    const signUpResult = await signUp(testEmail, testPassword, {
      fullName: "Test User",
      location: "Test City, TS",
      sellerType: "individual",
    })

    if (signUpResult.user) {
      // Wait for profile creation, then sign in
      await new Promise((resolve) => setTimeout(resolve, 2000))

      try {
        const signInResult = await signIn(testEmail, testPassword)
        return signInResult
      } catch (signInError) {
        console.warn("Test user sign in failed:", signInError)
        return signUpResult
      }
    }

    return signUpResult
  } catch (error) {
    console.error("Error with test user:", error)
    throw error
  }
}
