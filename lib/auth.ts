"use client"

import type { User } from "@supabase/supabase-js"
import { getSupabaseClient } from "./supabase"

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

function mapUser(user: User, profile?: { full_name?: string | null; avatar_url?: string | null }): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    full_name: profile?.full_name ?? undefined,
    avatar_url: profile?.avatar_url ?? undefined,
    created_at: user.created_at,
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  return mapUser(user, profile ?? undefined)
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signInWithEmail(email: string, password: string) {
  return signIn(email, password)
}

export async function signUp(email: string, password: string, fullName?: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function createTestUser() {
  const supabase = getSupabaseClient()
  const ts = Date.now()
  const email = `test.user.${ts}@bmwparts.test`
  const password = `TestPassword!${ts}`

  const { data: signup, error: upErr } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: "Test User" } },
  })
  if (upErr) throw upErr

  await supabase.auth.signInWithPassword({ email, password }).catch(() => {})

  return {
    email,
    password,
    user: signup.user ?? null,
  }
}
