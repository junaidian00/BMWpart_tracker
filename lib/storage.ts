"use client"

import { supabase, isSupabaseConfigured } from "./supabase"

export interface UploadResult {
  url: string | null
  error: string | null
}

export async function uploadReceiptImage(file: File, userId: string, recordId: string): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    // In demo mode, return a mock URL
    return {
      url: `https://demo-storage.example.com/receipts/${userId}/${recordId}/${file.name}`,
      error: null,
    }
  }

  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { url: null, error: "Please upload an image file (JPG, PNG, etc.)" }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: null, error: "File size must be less than 5MB" }
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${recordId}/${Date.now()}.${fileExt}`

    // Upload to Supabase storage
    const { data, error } = await supabase.storage.from("maintenance-receipts").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Storage upload error:", error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("maintenance-receipts").getPublicUrl(data.path)

    return { url: publicUrl, error: null }
  } catch (error: any) {
    console.error("Upload error:", error)
    return { url: null, error: error.message || "Failed to upload file" }
  }
}

export async function deleteReceiptImage(url: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    // In demo mode, just return success
    return { error: null }
  }

  try {
    // Extract file path from URL
    const urlParts = url.split("/")
    const fileName = urlParts.slice(-3).join("/") // userId/recordId/filename

    const { error } = await supabase.storage.from("maintenance-receipts").remove([fileName])

    if (error) {
      console.error("Storage delete error:", error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    console.error("Delete error:", error)
    return { error: error.message || "Failed to delete file" }
  }
}
