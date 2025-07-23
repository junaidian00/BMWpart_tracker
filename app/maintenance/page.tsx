"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Car, Calendar, AlertTriangle, TrendingUp, Wrench, FileText, Info, Loader2 } from "lucide-react"
import { getUserVehicles, getMaintenanceReminders, type Vehicle, type MaintenanceReminder } from "@/lib/maintenance"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

const TestingNotice = () => (
  <Alert className="mb-6">
    <Info className="h-4 w-4" />
    <AlertDescription>
      <strong>Demo Mode:</strong> This is your personal maintenance tracker. Add your vehicles and start tracking
      maintenance records!
    </AlertDescription>
  </Alert>
)

export default function MaintenancePage() {
  const { user, loading: authLoading } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [reminders, setReminders] = useState<MaintenanceReminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && user) {
      loadData()
    } else if (!authLoading && !user) {
      setLoading(false)
      setError("Please sign in to access the maintenance tracker")
    }
  }, [user, authLoading])

  const loadData = async () => {
    if (!user) {
      setError("Please sign in to access the maintenance tracker")
      setLoading(false)
      return
    }

    try {
      console.log("Loading data for user:", user.id)
      const [vehiclesData, remindersData] = await Promise.all([getUserVehicles(), getMaintenanceReminders()])

      console.log("Loaded vehicles:", vehiclesData)
      console.log("Loaded reminders:", remindersData)

      setVehicles(vehiclesData)
      setReminders(remindersData)
      setError(null)
    } catch (error: any) {
      console.error("Error loading data:", error)
      setError(error.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  // Show loading state
  if (authLoading || loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <MainNav />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading your maintenance data...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  // Show error state if not authenticated
  if (!user || error?.includes("sign in")) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>Please sign in to access the maintenance tracker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Quick Start</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Create an account instantly - no email verification required!
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/auth/sign-up" className="flex-1">
                  <Button className="w-full">Create Account</Button>
                </Link>
                <Link href="/auth/sign-in" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const upcomingReminders = reminders.filter((r) => {
    if (r.due_date) {
      return new Date(r.due_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
    }
    return false
  })

  const overdueReminders = reminders.filter((r) => {
    if (r.due_date) {
      return new Date(r.due_date) < new Date()
    }
    return false
  })

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <MainNav />

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Tracker</h1>
              <p className="text-gray-600">Keep track of your BMW's maintenance and modifications</p>
            </div>
            <div className="flex gap-2">
              <Link href="/maintenance/add-vehicle">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </Link>
            </div>
          </div>

          <TestingNotice />

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {vehicles.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Vehicles Added</h3>
                <p className="text-gray-600 mb-4">Add your first BMW to start tracking maintenance</p>
                <Link href="/maintenance/add-vehicle">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Vehicle
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Alert Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-red-800">Overdue</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-900">{overdueReminders.length}</div>
                      <p className="text-xs text-red-700">Maintenance items</p>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-yellow-800">Due Soon</CardTitle>
                      <Calendar className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-900">{upcomingReminders.length}</div>
                      <p className="text-xs text-yellow-700">Next 30 days</p>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-800">Total Vehicles</CardTitle>
                      <Car className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-900">{vehicles.length}</div>
                      <p className="text-xs text-blue-700">In your garage</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Maintenance</CardTitle>
                      <CardDescription>Latest maintenance records across all vehicles</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center text-gray-500 py-8">
                          <p>No maintenance records yet</p>
                          <p className="text-sm">Add your first maintenance record to see activity here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Reminders</CardTitle>
                      <CardDescription>Don't miss these important maintenance items</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reminders.slice(0, 3).map((reminder) => (
                          <div key={reminder.id} className="flex items-center space-x-4">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                overdueReminders.includes(reminder)
                                  ? "bg-red-500"
                                  : upcomingReminders.includes(reminder)
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                              }`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{reminder.title}</p>
                              <p className="text-xs text-gray-500">
                                Due: {reminder.due_date ? new Date(reminder.due_date).toLocaleDateString() : "TBD"}
                              </p>
                            </div>
                            <Badge
                              variant={
                                overdueReminders.includes(reminder)
                                  ? "destructive"
                                  : upcomingReminders.includes(reminder)
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {overdueReminders.includes(reminder)
                                ? "Overdue"
                                : upcomingReminders.includes(reminder)
                                  ? "Soon"
                                  : "Scheduled"}
                            </Badge>
                          </div>
                        ))}
                        {reminders.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">No upcoming reminders</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="vehicles" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            </CardTitle>
                            <CardDescription>
                              {vehicle.engine} • {vehicle.mileage.toLocaleString()} miles
                            </CardDescription>
                          </div>
                          <Car className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Last Service:</span>
                            <span>No records yet</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Next Due:</span>
                            <span className="text-gray-500">Set up reminders</span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Link href={`/maintenance/vehicle/${vehicle.id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full bg-transparent">
                                <Wrench className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </Link>
                            <Link href={`/maintenance/vehicle/${vehicle.id}/add-record`}>
                              <Button size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reminders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Reminders</CardTitle>
                    <CardDescription>Stay on top of your vehicle maintenance schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reminders.map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                overdueReminders.includes(reminder)
                                  ? "bg-red-500"
                                  : upcomingReminders.includes(reminder)
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                              }`}
                            ></div>
                            <div>
                              <h4 className="font-medium">{reminder.title}</h4>
                              <p className="text-sm text-gray-600">{reminder.description}</p>
                              <p className="text-xs text-gray-500">
                                Due: {reminder.due_date ? new Date(reminder.due_date).toLocaleDateString() : "TBD"}
                                {reminder.due_mileage && ` • ${reminder.due_mileage.toLocaleString()} miles`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                overdueReminders.includes(reminder)
                                  ? "destructive"
                                  : upcomingReminders.includes(reminder)
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {overdueReminders.includes(reminder)
                                ? "Overdue"
                                : upcomingReminders.includes(reminder)
                                  ? "Due Soon"
                                  : "Scheduled"}
                            </Badge>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              Mark Complete
                            </Button>
                          </div>
                        </div>
                      ))}
                      {reminders.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No reminders set up yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Maintenance Costs
                      </CardTitle>
                      <CardDescription>Monthly spending breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-gray-500 py-8">
                        <p>No maintenance records yet</p>
                        <p className="text-sm">Add maintenance records to see cost analytics</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Performance Impact
                      </CardTitle>
                      <CardDescription>How mods affected your vehicles</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-gray-500 py-8">
                        <p>No modifications tracked yet</p>
                        <p className="text-sm">Add modification records to see performance impact</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
