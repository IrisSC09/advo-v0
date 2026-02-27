"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, Heart, Share2, MessageCircle, FileText, Music, Palette, Filter } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface Thread {
  id: string
  title: string
  content: string
  type: string
  bill_id: string
  likes_count: number
  shares_count: number
  comments_count: number
  is_trending: boolean
  created_at: string
  profiles: {
    username: string
    full_name?: string
    avatar_url?: string | null
  }
  bill_title?: string
}

export default function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("popular")
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    fetchThreads()
  }, [sortBy, filterType])

  const fetchThreads = async () => {
    try {
      let query = supabase.from("threads").select(`
          *,
          profiles:author_id (username, full_name, avatar_url)
        `)

      // Apply filters
      if (filterType !== "all") {
        query = query.eq("type", filterType)
      }

      // Apply sorting
      if (sortBy === "trending") {
        query = query
          .order("is_trending", { ascending: false })
          .order("likes_count", { ascending: false })
          .order("created_at", { ascending: false })
      } else if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false })
      } else if (sortBy === "popular") {
        query = query.order("likes_count", { ascending: false }).order("created_at", { ascending: false })
      }

      const { data, error } = await query.limit(20)

      if (error) {
        console.error("Error loading threads:", error.message)
        setErrorMessage("Unable to load threads right now.")
        setThreads([])
      } else {
        setThreads(data || [])
        setErrorMessage("")
      }
    } catch (error) {
      console.error("Error fetching threads:", error)
      setErrorMessage("Unable to load threads right now.")
      setThreads([])
    } finally {
      setLoading(false)
    }
  }

  const filteredThreads = threads
    .filter((thread) => {
      // Apply type filter
      if (filterType !== "all" && thread.type !== filterType) return false

      // Apply search filter
      if (!searchQuery) return true
      return (
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (thread.profiles?.username || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      // Apply sorting to filtered results
      if (sortBy === "trending") {
        if (a.is_trending && !b.is_trending) return -1
        if (!a.is_trending && b.is_trending) return 1
        if (b.likes_count !== a.likes_count) {
          return b.likes_count - a.likes_count
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === "popular") {
        if (b.likes_count !== a.likes_count) {
          return b.likes_count - a.likes_count
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return 0
    })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "zine":
        return FileText
      case "music":
        return Music
      case "art":
        return Palette
      case "blog":
        return FileText
      default:
        return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "zine":
        return "bg-purple-500"
      case "music":
        return "bg-green-500"
      case "art":
        return "bg-pink-500"
      case "blog":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-white">Loading threads...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            POPULAR <span className="text-neon-purple neon-glow font-extralight">THREADS</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            Discover creative content from the community. Zines, art, music, and blogs that make politics accessible.
          </p>
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">
                <strong>Heads up:</strong> {errorMessage}
              </p>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search threads, creators, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="trending" className="text-white hover:bg-neon-purple hover:text-black">
                  Trending
                </SelectItem>
                <SelectItem value="recent" className="text-white hover:bg-neon-purple hover:text-black">
                  Most Recent
                </SelectItem>
                <SelectItem value="popular" className="text-white hover:bg-neon-purple hover:text-black">
                  Most Popular
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-neon-purple hover:text-black">
                  All Types
                </SelectItem>
                <SelectItem value="zine" className="text-white hover:bg-neon-purple hover:text-black">
                  Zines
                </SelectItem>
                <SelectItem value="art" className="text-white hover:bg-neon-purple hover:text-black">
                  Art
                </SelectItem>
                <SelectItem value="music" className="text-white hover:bg-neon-purple hover:text-black">
                  Music
                </SelectItem>
                <SelectItem value="blog" className="text-white hover:bg-neon-purple hover:text-black">
                  Blogs
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Threads Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredThreads.map((thread) => {
            const TypeIcon = getTypeIcon(thread.type)
            return (
              <Card
                key={thread.id}
                className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getTypeColor(thread.type)} text-white text-xs`}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {thread.type}
                      </Badge>
                      {thread.is_trending && (
                        <Badge className="bg-advoline-orange text-black text-xs font-bold">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          TRENDING
                        </Badge>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">{new Date(thread.created_at).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="text-white text-lg font-bold leading-tight">
                    <Link href={`/threads/${thread.id}`} className="hover:text-advoline-orange transition-colors">
                      {thread.title}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {/* Author */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={thread.profiles?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-advoline-orange text-black text-xs">
                        {(thread.profiles?.username || "A")[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-400 text-sm">by {thread.profiles?.username || "anonymous"}</span>
                  </div>

                  {/* Related Bill */}
                  <div className="mb-3">
                    <Link
                      href={`/bill/${thread.bill_id}`}
                      className="text-neon-purple hover:text-neon-purple-bright text-sm"
                    >
                      Related to: {thread.bill_title || thread.bill_id}
                    </Link>
                  </div>

                  {/* Content Preview */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                    {thread.content.substring(0, 150)}...
                  </p>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{thread.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>{thread.shares_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{thread.comments_count}</span>
                      </div>
                    </div>
                    <Link href={`/threads/${thread.id}`}>
                      <Button size="sm" className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                        View Thread
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredThreads.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No threads found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <Link href="/legislation">
              <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                Explore Legislation
              </Button>
            </Link>
          </div>
        )}

        {/* Load More */}
        {filteredThreads.length > 0 && (
          <div className="text-center mt-8">
            <Button className="neon-border bg-transparent text-neon-purple hover:neon-button hover:text-black">
              Load More Threads
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
