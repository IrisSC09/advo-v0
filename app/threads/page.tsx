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
    full_name: string
    avatar_url: string | null
  }
  bills: {
    title: string
  }
}

// Mock data for when database isn't set up yet
const mockThreads: Thread[] = [
  {
    id: "1",
    title: "Green New Deal Zine: Climate Justice Now",
    content:
      "Created a 12-page zine breaking down the climate bill in accessible graphics and art. This zine explains complex environmental policies through visual storytelling, making it easier for young people to understand the implications of climate legislation.",
    type: "zine",
    bill_id: "hr-2024-001",
    likes_count: 234,
    shares_count: 67,
    comments_count: 45,
    is_trending: true,
    created_at: "2024-01-20T10:00:00Z",
    profiles: {
      username: "ClimateArtist",
      full_name: "Maya Chen",
      avatar_url: null,
    },
    bills: {
      title: "Climate Action and Green Jobs Act",
    },
  },
  {
    id: "2",
    title: "Green Jobs Anthem - Original Song",
    content:
      "Wrote and recorded a song about the hope this bill brings for working families. The track combines folk and hip-hop elements to tell the story of communities transitioning to clean energy jobs.",
    type: "music",
    bill_id: "hr-2024-001",
    likes_count: 189,
    shares_count: 45,
    comments_count: 32,
    is_trending: false,
    created_at: "2024-01-19T14:30:00Z",
    profiles: {
      username: "ActivistBeats",
      full_name: "Jordan Rivera",
      avatar_url: null,
    },
    bills: {
      title: "Climate Action and Green Jobs Act",
    },
  },
  {
    id: "3",
    title: "Protest Poster Series: Climate Action",
    content:
      "Series of 6 protest posters ready for printing and sharing at climate rallies. Each poster focuses on a different aspect of the climate bill, from job creation to environmental justice.",
    type: "art",
    bill_id: "hr-2024-001",
    likes_count: 156,
    shares_count: 89,
    comments_count: 28,
    is_trending: true,
    created_at: "2024-01-18T16:45:00Z",
    profiles: {
      username: "RevolutionaryDesign",
      full_name: "Alex Thompson",
      avatar_url: null,
    },
    bills: {
      title: "Climate Action and Green Jobs Act",
    },
  },
  {
    id: "4",
    title: "Why This Climate Bill Matters for Gen Z",
    content:
      "Deep dive into how this legislation will impact young people's economic future. Analyzing job prospects, environmental benefits, and long-term implications for our generation.",
    type: "blog",
    bill_id: "hr-2024-001",
    likes_count: 298,
    shares_count: 123,
    comments_count: 67,
    is_trending: false,
    created_at: "2024-01-17T09:15:00Z",
    profiles: {
      username: "FutureVoter",
      full_name: "Sam Johnson",
      avatar_url: null,
    },
    bills: {
      title: "Climate Action and Green Jobs Act",
    },
  },
  {
    id: "5",
    title: "Student Debt Crisis Explained Through Comics",
    content:
      "A 8-panel comic strip that breaks down the student debt crisis and explains how the new relief bill could help millions of students. Visual storytelling at its finest!",
    type: "zine",
    bill_id: "hr-2024-078",
    likes_count: 445,
    shares_count: 156,
    comments_count: 89,
    is_trending: true,
    created_at: "2024-01-16T11:20:00Z",
    profiles: {
      username: "ComicActivist",
      full_name: "Riley Park",
      avatar_url: null,
    },
    bills: {
      title: "Student Debt Relief and Education Reform Act",
    },
  },
  {
    id: "6",
    title: "Healthcare Transparency Rap Battle",
    content:
      "Created a rap battle between 'Big Pharma' and 'The People' to explain healthcare price transparency. Making policy debates accessible through hip-hop culture.",
    type: "music",
    bill_id: "s-2024-023",
    likes_count: 167,
    shares_count: 78,
    comments_count: 34,
    is_trending: false,
    created_at: "2024-01-15T13:45:00Z",
    profiles: {
      username: "PolicyRapper",
      full_name: "Marcus Williams",
      avatar_url: null,
    },
    bills: {
      title: "Healthcare Price Transparency Act",
    },
  },
]

export default function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("trending")
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    fetchThreads()
  }, [sortBy, filterType])

  const fetchThreads = async () => {
    try {
      let query = supabase.from("threads").select(`
          *,
          profiles:author_id (username, full_name, avatar_url),
          bills:bill_id (title)
        `)

      // Apply filters
      if (filterType !== "all") {
        query = query.eq("type", filterType)
      }

      // Apply sorting
      if (sortBy === "trending") {
        query = query.order("is_trending", { ascending: false }).order("likes_count", { ascending: false })
      } else if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false })
      } else if (sortBy === "popular") {
        query = query.order("likes_count", { ascending: false })
      }

      const { data, error } = await query.limit(20)

      if (error) {
        console.warn("Database not set up yet, using mock data:", error.message)
        // Use mock data when database isn't ready
        setUsingMockData(true)
        setThreads(mockThreads)
      } else {
        setThreads(data || [])
        setUsingMockData(false)
      }
    } catch (error) {
      console.warn("Error fetching threads, using mock data:", error)
      setUsingMockData(true)
      setThreads(mockThreads)
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
        thread.profiles.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
    .sort((a, b) => {
      // Apply sorting to filtered results
      if (sortBy === "trending") {
        if (a.is_trending && !b.is_trending) return -1
        if (!a.is_trending && b.is_trending) return 1
        return b.likes_count - a.likes_count
      } else if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === "popular") {
        return b.likes_count - a.likes_count
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
          {usingMockData && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Demo Mode:</strong> Showing sample threads. Run the database setup scripts to see real data.
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
                      <AvatarImage src={thread.profiles.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-advoline-orange text-black text-xs">
                        {thread.profiles.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-400 text-sm">by {thread.profiles.username}</span>
                  </div>

                  {/* Related Bill */}
                  <div className="mb-3">
                    <Link
                      href={`/bill/${thread.bill_id}`}
                      className="text-neon-purple hover:text-neon-purple-bright text-sm"
                    >
                      Related to: {thread.bills.title}
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
