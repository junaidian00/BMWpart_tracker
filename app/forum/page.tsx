"use client"

import { MainNav } from "@/components/layout/main-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, Users, TrendingUp, Pin, Plus, Eye, ThumbsUp } from "lucide-react"

const categories = [
  { name: "General Discussion", posts: 1247, description: "General BMW talk and community" },
  { name: "E90/E91/E92/E93", posts: 892, description: "3 Series (2005-2012)" },
  { name: "F30/F31/F34/F35", posts: 1156, description: "3 Series (2012-2019)" },
  { name: "G20/G21", posts: 445, description: "3 Series (2019+)" },
  { name: "Performance & Tuning", posts: 678, description: "Modifications and performance" },
  { name: "Maintenance & Repair", posts: 934, description: "DIY guides and troubleshooting" },
  { name: "Marketplace", posts: 234, description: "Buy, sell, trade parts" },
]

const recentPosts = [
  {
    id: 1,
    title: "N55 Charge Pipe Replacement - Complete Guide",
    author: "BMWTech_Mike",
    category: "Maintenance & Repair",
    replies: 23,
    views: 1247,
    lastActivity: "2 hours ago",
    isPinned: true,
    likes: 45,
  },
  {
    id: 2,
    title: "Best aftermarket wheels for F30 335i?",
    author: "SpeedDemon92",
    category: "F30/F31/F34/F35",
    replies: 18,
    views: 892,
    lastActivity: "4 hours ago",
    isPinned: false,
    likes: 12,
  },
  {
    id: 3,
    title: "G20 M340i vs F80 M3 - Which would you choose?",
    author: "BMWEnthusiast",
    category: "General Discussion",
    replies: 67,
    views: 2341,
    lastActivity: "6 hours ago",
    isPinned: false,
    likes: 89,
  },
  {
    id: 4,
    title: "DIY: Replacing brake pads on E90",
    author: "DIYGuru",
    category: "E90/E91/E92/E93",
    replies: 15,
    views: 567,
    lastActivity: "8 hours ago",
    isPinned: false,
    likes: 34,
  },
]

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BMW Community Forum</h1>
            <p className="text-gray-600">Connect with fellow BMW enthusiasts</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input placeholder="Search discussions..." className="pl-10" />
          </div>
        </div>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="recent">Recent Posts</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            {/* Forum Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,847</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Posts</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-muted-foreground">Above average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online Now</CardTitle>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">Members active</p>
                </CardContent>
              </Card>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Forum Categories</h2>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{category.posts}</div>
                          <p className="text-xs text-gray-500">posts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <Avatar>
                          <AvatarFallback>{post.author.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {post.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                            <h3 className="font-semibold text-lg hover:text-blue-600">{post.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span>by {post.author}</span>
                            <Badge variant="outline">{post.category}</Badge>
                            <span>{post.lastActivity}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.replies} replies</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Popular posts coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unanswered" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Unanswered questions coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Community Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
            <CardDescription>Help us maintain a helpful and respectful community</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Be respectful and helpful to fellow BMW enthusiasts</li>
              <li>• Search before posting to avoid duplicates</li>
              <li>• Use descriptive titles and provide detailed information</li>
              <li>• Share photos and documentation when relevant</li>
              <li>• No spam, self-promotion, or off-topic discussions</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
