"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { X, FileImage, Loader2 } from "lucide-react"
import { uploadReceiptImage, type UploadResult } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface ReceiptUploadProps {
  userId: string
  recordId: string
  onUploadComplete: (url: string) => void
  onUploadError: (error: string) => void
  disabled?: boolean
}

export function ReceiptUpload({ userId, recordId, onUploadComplete, onUploadError, disabled }: ReceiptUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (file: File) => {
    if (disabled) return

    setUploading(true)
    try {
      const result: UploadResult = await uploadReceiptImage(file, userId, recordId)

      if (result.error) {
        onUploadError(result.error)
        toast({
          title: "Upload Failed",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.url) {
        onUploadComplete(result.url)
        toast({
          title: "Receipt Uploaded",
          description: "Your receipt has been uploaded successfully.",
        })
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to upload receipt"
      onUploadError(errorMessage)
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Receipt Image</label>

      <Card
        className={`border-2 border-dashed transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="p-6 text-center">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading receipt...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FileImage className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Upload Receipt Image</p>
                <p className="text-xs text-muted-foreground">Drag & drop or click to select</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />
    </div>
  )
}

interface ReceiptPreviewProps {
  url: string
  onRemove: () => void
  disabled?: boolean
}

export function ReceiptPreview({ url, onRemove, disabled }: ReceiptPreviewProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Receipt Image</label>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {imageError ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileImage className="h-4 w-4" />
                  Receipt uploaded (preview unavailable)
                </div>
              ) : (
                <img
                  src={url || "/placeholder.svg"}
                  alt="Receipt"
                  className="max-w-full h-32 object-cover rounded border"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemove}
              disabled={disabled}
              className="flex-shrink-0 bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
