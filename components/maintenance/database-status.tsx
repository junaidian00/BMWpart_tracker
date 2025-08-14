"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { checkDatabaseHealth } from "@/lib/maintenance"
import { isSupabaseConfigured, withTimeout } from "@/lib/supabase"

export function DatabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    tablesExist: boolean
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const result = await withTimeout(checkDatabaseHealth(), 5000)
      setStatus(result)
    } catch (error: any) {
      console.error("Database health check failed:", error)
      setStatus({
        connected: false,
        tablesExist: false,
        error: error.message.includes("timeout") ? "Database connection timed out. Using demo mode." : error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (!isSupabaseConfigured()) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            Demo Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-700">
            Supabase is not configured. The application is running in demo mode with fallback data.
          </p>
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
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{status.error}</p>
            {status.error.includes("timeout") && (
              <p className="text-sm text-red-600 mt-2">
                The maintenance tracker will use demo data until the connection is restored.
              </p>
            )}
          </div>
        )}

        {status?.connected && status?.tablesExist && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">Database is ready for maintenance tracking!</p>
          </div>
        )}

        {status?.connected && !status?.tablesExist && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              Database is connected but maintenance tables are missing. Please run the setup script.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
