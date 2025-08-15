"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { checkDatabaseHealth } from "@/lib/maintenance"
import { isSupabaseConfigured, withTimeout } from "@/lib/supabase"
import { OfflineAuthSystem } from "@/lib/offline-auth"

export function DatabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    tablesExist: boolean
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  const checkStatus = async () => {
    setLoading(true)

    // Check if we're in offline mode
    const offlineUser = OfflineAuthSystem.getCurrentUser()
    if (offlineUser) {
      setIsOfflineMode(true)
      setStatus({
        connected: true,
        tablesExist: true,
      })
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured()) {
      setIsOfflineMode(true)
      setStatus({
        connected: true,
        tablesExist: true,
      })
      setLoading(false)
      return
    }

    try {
      const result = await withTimeout(checkDatabaseHealth(), 3000) // Reduced timeout
      setStatus(result)
      setIsOfflineMode(false)
    } catch (error: any) {
      console.error("Database health check failed:", error)
      // Automatically switch to offline mode on timeout
      setIsOfflineMode(true)
      setStatus({
        connected: true,
        tablesExist: true,
        error: "Using offline demo mode due to connection issues",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (isOfflineMode) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <CheckCircle className="h-5 w-5" />
            Demo Mode Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection:</span>
              <Badge variant="default" className="bg-blue-600">
                Demo Mode
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Data Storage:</span>
              <Badge variant="default" className="bg-blue-600">
                Local Storage
              </Badge>
            </div>

            <div className="p-3 bg-blue-100 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">
                Your data is stored locally in your browser. All maintenance tracking features are fully functional!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Database Status
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : status?.connected && status?.tablesExist ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={checkStatus} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Connection:</span>
          <Badge variant={status?.connected ? "default" : "destructive"}>
            {loading ? "Checking..." : status?.connected ? "Connected" : "Disconnected"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Tables:</span>
          <Badge variant={status?.tablesExist ? "default" : "destructive"}>
            {loading ? "Checking..." : status?.tablesExist ? "Ready" : "Missing"}
          </Badge>
        </div>

        {status?.error && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">{status.error}</p>
          </div>
        )}

        {status?.connected && status?.tablesExist && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">Database is ready for maintenance tracking!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
