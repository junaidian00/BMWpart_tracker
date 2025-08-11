"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Activity, Clock, Database, CheckCircle, AlertCircle, Zap, Car, Cog, TrendingUp, RefreshCw } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface ScrapingProgress {
  totalChassis: number
  processedChassis: number
  totalModels: number
  processedModels: number
  totalCategories: number
  processedCategories: number
  totalParts: number
  processedParts: number
  currentChassis: string
  currentModel: string
  currentCategory: string
  startTime: string
  estimatedCompletion: string | null
  status: "running" | "completed" | "paused" | "error"
  errors: string[]
  partsPerMinute: number
  sessionsCompleted: number
  totalSessions: number
}

interface DatabaseStats {
  totalChassis: number
  totalEngines: number
  totalCategories: number
  totalParts: number
  totalCompatibilityRecords: number
  scrapingSessions: number
  completedSessions: number
  lastUpdated: string
  partsByChassis: Record<string, number>
}

export function ScraperMonitor() {
  const [progress, setProgress] = useState<ScrapingProgress | null>(null)
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    loadProgress()
    loadDatabaseStats()

    if (autoRefresh) {
      const interval = setInterval(() => {
        loadProgress()
        loadDatabaseStats()
      }, 5000) // Refresh every 5 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const loadProgress = async () => {
    try {
      // Try to load progress from the JSON file first
      const response = await fetch("/ultimate-scraping-progress.json")
      if (response.ok) {
        const data = await response.json()
        setProgress(data.progress)
      } else {
        // Fallback to database
        const { data, error } = await supabase
          .from("scraping_progress")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(1)
          .single()

        if (data && !error) {
          // Convert database format to progress format
          setProgress({
            totalChassis: 100, // Estimated
            processedChassis: data.chassis_code ? 1 : 0,
            totalModels: 500, // Estimated
            processedModels: data.model_variant ? 1 : 0,
            totalCategories: 34,
            processedCategories: data.category_code ? 1 : 0,
            totalParts: 500000, // Target
            processedParts: data.parts_processed || 0,
            currentChassis: data.chassis_code || "",
            currentModel: data.model_variant || "",
            currentCategory: data.section_name || "",
            startTime: data.started_at || new Date().toISOString(),
            estimatedCompletion: null,
            status: (data.status as any) || "running",
            errors: data.last_error ? [data.last_error] : [],
            partsPerMinute: 0,
            sessionsCompleted: 0,
            totalSessions: 1,
          })
        }
      }
    } catch (error) {
      console.error("Error loading progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadDatabaseStats = async () => {
    try {
      const { data, error } = await supabase.rpc("get_scraping_statistics")

      if (data && !error) {
        setDbStats(data)
      }
    } catch (error) {
      console.error("Error loading database stats:", error)
    }
  }

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime)
    const now = new Date()
    const diff = now.getTime() - start.getTime()

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "running":
        return "bg-blue-500"
      case "paused":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "running":
        return Activity
      case "paused":
        return Clock
      case "error":
        return AlertCircle
      default:
        return Clock
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            Loading scraper status...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Ultimate BMW Parts Scraper
              </CardTitle>
              <CardDescription>Real-time monitoring of the comprehensive BMW parts extraction</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
                {autoRefresh ? "Auto" : "Manual"}
              </Button>
              <Button variant="outline" size="sm" onClick={loadProgress}>
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {progress ? (
            <>
              {/* Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div
                    className={`w-12 h-12 rounded-full ${getStatusColor(progress.status)} flex items-center justify-center mx-auto mb-2`}
                  >
                    {(() => {
                      const StatusIcon = getStatusIcon(progress.status)
                      return <StatusIcon className="w-6 h-6 text-white" />
                    })()}
                  </div>
                  <div className="font-semibold capitalize">{progress.status}</div>
                  <div className="text-sm text-gray-500">Current Status</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{progress.processedParts.toLocaleString()}</div>
                  <div className="font-semibold">Parts Extracted</div>
                  <div className="text-sm text-gray-500">Target: {progress.totalParts.toLocaleString()}</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{progress.processedChassis}</div>
                  <div className="font-semibold">Chassis Completed</div>
                  <div className="text-sm text-gray-500">of {progress.totalChassis}</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{progress.partsPerMinute}</div>
                  <div className="font-semibold">Parts/Minute</div>
                  <div className="text-sm text-gray-500">Current Rate</div>
                </div>
              </div>

              <Separator />

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round((progress.processedParts / progress.totalParts) * 100)}%</span>
                  </div>
                  <Progress value={(progress.processedParts / progress.totalParts) * 100} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Chassis Progress</span>
                    <span>{Math.round((progress.processedChassis / progress.totalChassis) * 100)}%</span>
                  </div>
                  <Progress value={(progress.processedChassis / progress.totalChassis) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Model Progress</span>
                    <span>{Math.round((progress.processedModels / progress.totalModels) * 100)}%</span>
                  </div>
                  <Progress value={(progress.processedModels / progress.totalModels) * 100} className="h-2" />
                </div>
              </div>

              <Separator />

              {/* Current Activity */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Current Activity
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Chassis</div>
                    <div className="font-medium flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      {progress.currentChassis || "Initializing..."}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Model</div>
                    <div className="font-medium flex items-center gap-2">
                      <Cog className="w-4 h-4" />
                      {progress.currentModel || "Preparing..."}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Category</div>
                    <div className="font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      {progress.currentCategory || "Loading..."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timing Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-semibold">Running Time</div>
                  <div className="text-lg text-blue-600">{formatDuration(progress.startTime)}</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-semibold">Estimated Completion</div>
                  <div className="text-lg text-green-600">
                    {progress.estimatedCompletion
                      ? new Date(progress.estimatedCompletion).toLocaleTimeString()
                      : "Calculating..."}
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-semibold">Sessions</div>
                  <div className="text-lg text-purple-600">
                    {progress.sessionsCompleted} / {progress.totalSessions}
                  </div>
                </div>
              </div>

              {/* Errors */}
              {progress.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Recent Errors ({progress.errors.length})
                  </h4>
                  <div className="space-y-1 text-sm text-red-700">
                    {progress.errors.slice(-5).map((error, index) => (
                      <div key={index} className="font-mono bg-red-100 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">No Active Scraping Session</h3>
              <p className="text-gray-500">The scraper is not currently running</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Statistics */}
      {dbStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Statistics
            </CardTitle>
            <CardDescription>Current state of the BMW parts database</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dbStats.totalChassis.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Chassis Codes</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dbStats.totalEngines.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Engine Types</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{dbStats.totalCategories.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dbStats.totalParts.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Parts</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {dbStats.totalCompatibilityRecords.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Compatibility</div>
              </div>
            </div>

            {/* Top Chassis by Parts Count */}
            <div>
              <h4 className="font-semibold mb-3">Top Chassis by Parts Count</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(dbStats.partsByChassis)
                  .slice(0, 8)
                  .map(([chassis, count]) => (
                    <div key={chassis} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Badge variant="outline">{chassis}</Badge>
                      <span className="text-sm font-medium">{count.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Last updated: {new Date(dbStats.lastUpdated).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 How You'll Know When It's Complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-green-600 mb-2">✅ Completion Signals</h4>
              <ul className="text-sm space-y-1">
                <li>• Status changes to "completed"</li>
                <li>• Progress bars reach 100%</li>
                <li>• All chassis codes processed</li>
                <li>• 500,000+ parts extracted</li>
                <li>• Browser window closes automatically</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-blue-600 mb-2">📊 Expected Results</h4>
              <ul className="text-sm space-y-1">
                <li>• 100+ BMW chassis codes</li>
                <li>• 500+ model variants</li>
                <li>• 34 main part categories</li>
                <li>• 500,000+ individual parts</li>
                <li>• Complete F22/F23 coverage</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⏱️ Timeline Expectations</h4>
            <p className="text-sm text-yellow-700">
              The complete scraping operation will take approximately <strong>48-72 hours</strong> to extract every
              single BMW part. You can monitor progress in real-time through this dashboard, and the system will
              automatically save progress every few minutes in case of interruptions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
