"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, TrendingUp, Plus, Search, Pin, Heart, Eye, Clock } from 'lucide-react'
import Link from "next/link"

const forumCategories = [
  {
    id: 1,
    name: "General Discussion",
    description: "General BMW discussion and community chat",
    posts: 1234,
    members: 892,
    color: "bg-blue-100 text-blue-800"
  },
  {
    id: 2,
    name: "Technical Help",
    description: "Get help with repairs, maintenance, and technical issues",
    posts: 987,
    members: 654,
    color: "bg-green-100 text-green-800"
  },
  {
    id: 3,
    name: "Parts & Marketplace",
    description: "Buy, sell, and trade BMW parts",
    posts: 543,
    members: 321,
    color: "bg-purple-100 text-purple-800"
  },
  {
    id: 4,
    name: "Performance & Tuning",
    description: "Modifications, tuning, and performance upgrades",
    posts: 876,
    members: 445,
    color: "bg-red-100 text-red-800"
  },
  {
    id: 5,
    name: "Show Off Your Ride",
    description: "Share photos and stories of your BMW",
    posts: 2341,
    members: 1123,
    color: "bg-yellow-100 text-yellow-800"
  }
]

const recentPosts = [
  {
    id: 1,
    title: "F30 335i Turbo Replacement - Need Advice",
    author: "BMWEnthusiast92",
    category: "Technical Help",
    replies: 23,
    views: 456,
    lastReply: "2 hours ago",
    isPinned: false,
    hasImage: true
  },
  {
    id: 2,
    title: "Official: BMW Parts Marketplace Rules and Guidelines",
    author: "Moderator",
    category: "Parts & Marketplace",
    replies: 5,
    views: 1234,
    lastReply: "1 day ago",
    isPinned: true,
    hasImage: false
  },
  {
    id: 3,
    title: "Just installed M Performance exhaust on my F22 M240i!",
    author: "TrackDayBro",
    category: "Show Off Your Ride",
    replies: 18,
    views: 789,
    lastReply: "4 hours ago",
    isPinned: false,
    hasImage: true
  },
  {
    id: 4,
    title: "N20 Timing Chain - Preventative Replacement?",
    author: "F30_Owner",
    category: "Technical Help",
    replies: 31,
    views: 1002,
    lastReply: "1 hour ago",
    isPinned: false,
    hasImage: false
  },
  {
    id: 5,
    title: "WTB: F32 M Sport Front Bumper - Good Condition",
    author: "CouperGuy",
    category: "Parts & Marketplace",
    replies: 7,
    views: 234,
    lastReply: "6 hours ago",
    isPinned: false,
    hasImage: false
  }
]

const topContributors = [
  { name: "TechMaster_BMW", posts: 1234, reputation: 9.8, avatar: "TM" },
  { name: "PartsExpert", posts: 987, reputation: 9.6, avatar: "PE" },
  { name: "DiagnosticDave", posts: 756, reputation: 9.4, avatar: "DD" },
  { name: "BMWMechanic", posts: 654, reputation: 9.2, avatar: "BM" }
]

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BMW Community Forum</h1>
          <p className="text-gray-600">Connect with fellow BMW enthusiasts, share knowledge, and get help</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">5,981</div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">3,435</div>
              <div className="text-sm text-gray-600">Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-gray-600">Online Now</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-gray-600">New Today</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="recent">Recent Posts</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            {/* Search and New Post */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search forum posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>

            {/* Forum Categories */}
            <div className="grid gap-4">
              {forumCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                          <Badge className={category.color}>{category.posts} posts</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{category.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {category.posts.toLocaleString()} posts
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {category.members.toLocaleString()} members
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="grid gap-4">
              {recentPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {post.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            {post.title}
                          </h3>
                          {post.hasImage && <Badge variant="outline">📷</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>by {post.author}</span>
                          <Badge variant="outline">{post.category}</Badge>
                          <span>Last reply {post.lastReply}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trending Posts</h3>
                <p className="text-gray-600">Trending posts will appear here based on engagement</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contributors" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {topContributors.map((contributor, index) => (
                <Card key={contributor.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {contributor.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <Badge className="absolute -top-2 -right-2 bg-yellow-500">#{index + 1}</Badge>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{contributor.name}</h3>
                        <div className="text-sm text-gray-600">
                          {contributor.posts.toLocaleString()} posts • {contributor.reputation}/10 reputation
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(Math.floor(contributor.reputation))].map((_, i) => (
                            <Heart key={i} className="h-3 w-3 fill-red-500 text-red-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
            <CardDescription>Please follow these guidelines to maintain a positive community</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Be respectful and helpful to fellow BMW enthusiasts</li>
              <li>Use clear, descriptive titles for your posts</li>
              <li>Include relevant details when asking for technical help</li>
              <li>Search before posting to avoid duplicates</li>
              <li>No spam, self-promotion, or off-topic discussions</li>
              <li>Follow marketplace rules when buying/selling parts</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
