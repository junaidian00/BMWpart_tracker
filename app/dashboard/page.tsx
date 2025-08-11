"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth/auth-guard"
import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUserVehicles, getMaintenanceReminders, type Vehicle, type MaintenanceReminder } from "@/lib/maintenance"
import { Car, Wrench, AlertTriangle, Calendar, TrendingUp, Settings, Plus, Eye, Clock, Package } from 'lucide-react'
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [reminders, setReminders] = useState<MaintenanceReminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [vehiclesData, remindersData] = await Promise.all([
        getUserVehicles(user?.id),
        user?.id ? getMaintenanceReminders(user.id) : Promise.resolve([])
      ])
      
      setVehicles(vehiclesData)
      setReminders(remindersData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const overdueReminders = reminders.filter(r => 
    r.due_date && new Date(r.due_date) < new Date()
  )

  const upcomingReminders = reminders.filter(r => 
    r.due_date && new Date(r.due_date) >= new Date()
  ).slice(0, 5)

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <MainNav />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.profile?.full_name || user?.email}! Here's your BMW overview.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Car className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">My Vehicles</p>
                    <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900">{overdueReminders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Upcoming</p>
                    <p className="text-2xl font-bold text-gray-900">{upcomingReminders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Parts Available</p>
                    <p className="text-2xl font-bold text-gray-900">1,171+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/maintenance/add-vehicle">
                      <Button className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Vehicle
                      </Button>
                    </Link>
                    <Link href="/browse">
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="mr-2 h-4 w-4" />
                        Browse Parts
                      </Button>
                    </Link>
                    <Link href="/oem-catalog">
                      <Button variant="outline" className="w-full justify-start">
                        <Package className="mr-2 h-4 w-4" />
                        OEM Catalog
                      </Button>
                    </Link>
                    <Link href="/forum">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="mr-2 h-4 w-4" />
                        Community Forum
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recent Vehicles */}
                <Card>
                  <CardHeader>
                    <CardTitle>My Vehicles</CardTitle>
                    <CardDescription>Your registered BMWs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {vehicles.length === 0 ? (
                      <div className="text-center py-6">
                        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No vehicles added yet</p>
                        <Link href="/maintenance/add-vehicle">
                          <Button size="sm">Add Your First BMW</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {vehicles.slice(0, 3).map((vehicle) => (
                          <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {vehicle.nickname || `${vehicle.year} ${vehicle.model}`}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {vehicle.chassis_code} • {vehicle.mileage?.toLocaleString()} miles
                              </p>
                            </div>
                            <Link href={`/maintenance/vehicle/${vehicle.id}`}>
                              <Button size="sm" variant="outline">View</Button>
                            </Link>
                          </div>
                        ))}
                        {vehicles.length > 3 && (
                          <Link href="/maintenance" className="block text-center">
                            <Button variant="outline" size="sm">
                              View All {vehicles.length} Vehicles
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Maintenance Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Maintenance Alerts
                    </CardTitle>
                    <CardDescription>Upcoming and overdue services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reminders.length === 0 ? (
                      <div className="text-center py-6">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No maintenance reminders</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {overdueReminders.map((reminder) => (
                          <div key={reminder.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-red-900">{reminder.service_type}</h5>
                                <p className="text-sm text-red-700">
                                  Overdue since {new Date(reminder.due_date!).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="destructive">Overdue</Badge>
                            </div>
                          </div>
                        ))}
                        {upcomingReminders.slice(0, 3).map((reminder) => (
                          <div key={reminder.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">{reminder.service_type}</h5>
                                <p className="text-sm text-gray-600">
                                  Due {new Date(reminder.due_date!).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {reminder.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-6">
              {vehicles.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Vehicles Added</h3>
                    <p className="text-gray-600 mb-4">Start by adding your BMW to track maintenance and find compatible parts</p>
                    <Link href="/maintenance/add-vehicle">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First BMW
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {vehicle.nickname || `${vehicle.year} ${vehicle.model}`}
                            </CardTitle>
                            <CardDescription>
                              {vehicle.engine} • {vehicle.mileage?.toLocaleString()} miles
                            </CardDescription>
                          </div>
                          <Car className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Chassis:</span>
                            <span className="font-medium">{vehicle.chassis_code || "Unknown"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Added:</span>
                            <span>{new Date(vehicle.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Link href={`/maintenance/vehicle/${vehicle.id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full">
                                <Wrench className="mr-2 h-4 w-4" />
                                Maintenance
                              </Button>
                            </Link>
                            <Link href={`/maintenance/vehicle/${vehicle.id}/parts`}>
                              <Button size="sm">
                                <Package className="mr-2 h-4 w-4" />
                                Parts
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Overdue Maintenance</CardTitle>
                    <CardDescription>Items that need immediate attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {overdueReminders.length === 0 ? (
                      <div className="text-center py-6">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No overdue maintenance</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {overdueReminders.map((reminder) => (
                          <div key={reminder.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="font-medium text-red-900 mb-1">{reminder.service_type}</h4>
                            <p className="text-sm text-red-700 mb-2">
                              {reminder.description || "No description provided"}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">
                                Due: {new Date(reminder.due_date!).toLocaleDateString()}
                              </span>
                              <Badge variant="destructive">
                                {Math.ceil((new Date().getTime() - new Date(reminder.due_date!).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Upcoming Maintenance</CardTitle>
                    <CardDescription>Scheduled services and reminders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingReminders.length === 0 ? (
                      <div className="text-center py-6">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No upcoming maintenance</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingReminders.map((reminder) => (
                          <div key={reminder.id} className="p-4 border rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-1">{reminder.service_type}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {reminder.description || "No description provided"}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                Due: {new Date(reminder.due_date!).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className={
                                reminder.priority === 'high' ? 'border-orange-300 text-orange-700' :
                                reminder.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                                'border-gray-300 text-gray-700'
                              }>
                                {reminder.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and system updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Activity Feed Coming Soon</h3>
                    <p className="text-gray-600">
                      Track your maintenance records, part purchases, and forum activity here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
