"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Activity, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react'

interface ScrapingProgress {
  id: string
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error'
  started_at: string | null
  completed_at: string | null
  current_chassis: string | null
  current_model: string | null
  current_category: string | null
  chassis_processed: number
  models_processed: number
  categories_processed: number
  parts_processed: number
  total_chassis: number
  total_models: number
  total_categories: number
  estimated_total_parts: number
  parts_per_minute: number
  sessions_completed: number
  total_sessions: number
  estimated_completion: string | null
  errors: string | null
  last_error: string | null
  updated_at: string
}

const mockProgress: ScrapingProgress = {
  id: "main-scraper",
  status: "completed",
  started_at: "2024-01-15T10:00:00Z",
  completed_at: "2024-01-20T15:30:00Z",
  current_chassis: null,
  current_model: null,
  current_category: null,
  chassis_processed: 156,
  models_processed: 2847,
  categories_processed: 34,
  parts_processed: 847293,
  total_chassis: 156,
  total_models: 2847,
  total_categories: 34,
  estimated_total_parts: 847293,
  parts_per_minute: 125.5,
  sessions_completed: 1,
  total_sessions: 1,
  estimated_completion: null,
  errors: null,
  last_error: null,
  updated_at: "2024-01-20T15:30:00Z"
}

export function ScraperStatusDashboard() {
  const [progress, setProgress] = useState<ScrapingProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [databaseAvailable, setDatabaseAvailable] = useState(false)

  useEffect(() => {
    fetchProgress()
    const interval = setInterval(fetchProgress, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from("scraping_progress")
        .select("*")
        .eq("id", "main-scraper")
        .single()

      if (!error && data) {
        setProgress(data)
        setDatabaseAvailable(true)
      } else {
        console.log("Database not available, using mock data")
        setProgress(mockProgress)
        setDatabaseAvailable(false)
      }
    } catch (error) {
      console.log("Error fetching scraper progress, using mock data")
      setProgress(mockProgress)
      setDatabaseAvailable(false)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'paused':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Database className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Idle</Badge>
    }
  }

  const calculateProgress = (current: number, total: number) => {
    return total > 0 ? Math.round((current / total) * 100) : 0
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading scraper status...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Scraper Status
            </CardTitle>
            <CardDescription>BMW parts database scraping status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Unable to load scraper status</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!databaseAvailable && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            <strong>Demo Mode:</strong> Showing sample scraper data. Run the SQL setup script to see real status.
          </p>
        </div>
      )}

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(progress.status)}
                  {getStatusBadge(progress.status)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Parts Scraped</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.parts_processed.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Speed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.parts_per_minute.toFixed(1)}/min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.sessions_completed}/{progress.total_sessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Scraping Progress
          </CardTitle>
          <CardDescription>
            Real-time progress of BMW parts database population
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chassis Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">BMW Chassis</span>
              <span className="text-sm text-gray-600">
                {progress.chassis_processed} / {progress.total_chassis}
              </span>
            </div>
            <Progress 
              value={calculateProgress(progress.chassis_processed, progress.total_chassis)} 
              className="h-2"
            />
          </div>

          {/* Models Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Vehicle Models</span>
              <span className="text-sm text-gray-600">
                {progress.models_processed} / {progress.total_models}
              </span>
            </div>
            <Progress 
              value={calculateProgress(progress.models_processed, progress.total_models)} 
              className="h-2"
            />
          </div>

          {/* Categories Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Part Categories</span>
              <span className="text-sm text-gray-600">
                {progress.categories_processed} / {progress.total_categories}
              </span>
            </div>
            <Progress 
              value={calculateProgress(progress.categories_processed, progress.total_categories)} 
              className="h-2"
            />
          </div>

          {/* Parts Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Individual Parts</span>
              <span className="text-sm text-gray-600">
                {progress.parts_processed.toLocaleString()} / {progress.estimated_total_parts.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={calculateProgress(progress.parts_processed, progress.estimated_total_parts)} 
              className="h-2"
            />
          </div>

          {/* Current Activity */}
          {progress.status === 'running' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Currently Processing</h4>
              <div className="space-y-1 text-sm text-blue-800">
                {progress.current_chassis && (
                  <p><strong>Chassis:</strong> {progress.current_chassis}</p>
                )}
                {progress.current_model && (
                  <p><strong>Model:</strong> {progress.current_model}</p>
                )}
                {progress.current_category && (
                  <p><strong>Category:</strong> {progress.current_category}</p>
                )}
              </div>
            </div>
          )}

          {/* Completion Info */}
          {progress.status === 'completed' && progress.completed_at && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Scraping Completed</h4>
              <p className="text-sm text-green-800">
                Finished on {new Date(progress.completed_at).toLocaleDateString()} at{' '}
                {new Date(progress.completed_at).toLocaleTimeString()}
              </p>
              <p className="text-sm text-green-800 mt-1">
                Total parts collected: <strong>{progress.parts_processed.toLocaleString()}</strong>
              </p>
            </div>
          )}

          {/* Error Info */}
          {progress.status === 'error' && progress.last_error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">Scraping Error</h4>
              <p className="text-sm text-red-800">{progress.last_error}</p>
              <Button 
                size="sm" 
                className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                onClick={fetchProgress}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Estimated Completion */}
          {progress.status === 'running' && progress.estimated_completion && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Estimated Completion</h4>
              <p className="text-sm text-gray-700">
                {new Date(progress.estimated_completion).toLocaleDateString()} at{' '}
                {new Date(progress.estimated_completion).toLocaleTimeString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Statistics
          </CardTitle>
          <CardDescription>
            Current state of the BMW parts database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-blue-800">BMW Chassis</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">2,847</div>
              <div className="text-sm text-green-800">Vehicle Models</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">34</div>
              <div className="text-sm text-purple-800">Part Categories</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">847K+</div>
              <div className="text-sm text-orange-800">Individual Parts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
