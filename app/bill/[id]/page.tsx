"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Share2, Bookmark, Users, TrendingUp, Sparkles, Music, FileText, Palette } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface BillDetail {
  bill_id: number
  title: string
  description: string
  introduced_date: string
  sponsor_name: string
  state: string
  bill_number: string
  status: string
  party?: string
  topic?: string
  engagement?: number
  threads?: number
  full_text?: string
  committee?: string
  next_action?: string
  ai_summary?: {
    summary: string
    keyPoints: string[]
    impact: string
    controversialAspects: string
  }
}

interface Thread {
  id: string
  title: string
  content: string
  type: string
  author_id: string
  likes_count: number
  shares_count: number
  comments_count: number
  created_at: string
  profiles: {
    username: string
    avatar_url: string | null
  }
}

export default function BillDetailPage() {
  const params = useParams()
  const [bill, setBill] = useState<BillDetail | null>(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [threadsLoading, setThreadsLoading] = useState(true)

  useEffect(() => {
    fetchBillDetail()
    fetchThreads()
  }, [params.id])

  const fetchBillDetail = async () => {
    try {
      const response = await fetch(`/api/bills/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBill(data)
      }
    } catch (error) {
      console.error("Error fetching bill detail:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchThreads = async () => {
    try {
      const response = await fetch(`/api/threads?bill_id=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setThreads(data.threads || [])
      }
    } catch (error) {
      console.error("Error fetching threads:", error)
    } finally {
      setThreadsLoading(false)
    }
  }

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
        <div className="text-white">Loading bill details...</div>
      </div>
    )
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Bill Not Found</h2>
          <Link href="/legislation">
            <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
              Back to Legislation
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/legislation" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Legislation
        </Link>

        {/* Bill Header */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {bill.party && <Badge className="bg-blue-500 text-white">{bill.party}</Badge>}
                  {bill.topic && <Badge className="bg-green-500 text-white">{bill.topic}</Badge>}
                  <Badge className="bg-gray-700 text-gray-300">{bill.status}</Badge>
                  {bill.ai_summary && (
                    <div className="flex items-center gap-1 text-neon-purple ml-2">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-sm">AI Enhanced</span>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-black text-white mb-2">{bill.title}</h1>
                <p className="text-gray-400 mb-4">
                  {bill.bill_number} • Sponsored by {bill.sponsor_name} • Introduced{" "}
                  {new Date(bill.introduced_date).toLocaleDateString()}
                </p>
                <p className="text-gray-300 leading-relaxed">{bill.description}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white bg-transparent">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-400 hover:text-white bg-transparent">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* AI Summary */}
            {bill.ai_summary && (
              <Card className="bg-gray-900 border-gray-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="h-5 w-5 text-neon-purple mr-2" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Summary:</h4>
                    <p className="text-gray-300 leading-relaxed">{bill.ai_summary.summary}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Key Points:</h4>
                    <ul className="space-y-2">
                      {bill.ai_summary.keyPoints.map((point, index) => (
                        <li key={index} className="text-gray-300 flex items-start">
                          <span className="text-advoline-orange mr-2 mt-1">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {bill.ai_summary.impact && (
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">Potential Impact:</h4>
                      <p className="text-gray-300 leading-relaxed">{bill.ai_summary.impact}</p>
                    </div>
                  )}

                  {bill.ai_summary.controversialAspects && (
                    <div>
                      <h4 className="text-white font-semibold mb-2">Notable Aspects:</h4>
                      <p className="text-gray-300 leading-relaxed">{bill.ai_summary.controversialAspects}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Community Threads */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Community Threads ({threads.length})</CardTitle>
                  <Link href={`/bill/${bill.bill_id}/create-thread`}>
                    <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                      Create Thread
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {threadsLoading ? (
                  <div className="text-gray-400 text-center py-8">Loading threads...</div>
                ) : threads.length > 0 ? (
                  <div className="space-y-4">
                    {threads.map((thread) => {
                      const TypeIcon = getTypeIcon(thread.type)
                      return (
                        <Card key={thread.id} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={thread.profiles.avatar_url || "/placeholder.svg"} />
                                <AvatarFallback className="bg-advoline-orange text-black">
                                  {thread.profiles.username?.[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`${getTypeColor(thread.type)} text-white text-xs`}>
                                    <TypeIcon className="h-3 w-3 mr-1" />
                                    {thread.type}
                                  </Badge>
                                  <span className="text-gray-400 text-sm">by {thread.profiles.username}</span>
                                  <span className="text-gray-500 text-sm">
                                    {new Date(thread.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <h4 className="text-white font-semibold mb-2">{thread.title}</h4>
                                <p className="text-gray-400 text-sm mb-3">{thread.content.substring(0, 200)}...</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                                    <span>{thread.likes_count} likes</span>
                                    <span>{thread.shares_count} shares</span>
                                    <span>{thread.comments_count} comments</span>
                                  </div>
                                  <Link href={`/threads/${thread.id}`}>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                                    >
                                      View Thread
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No threads yet for this bill</p>
                    <Link href={`/bill/${bill.bill_id}/create-thread`}>
                      <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                        Be the First to Create a Thread
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bill Status */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Bill Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Current Status:</span>
                    <p className="text-white font-medium">{bill.status}</p>
                  </div>
                  {bill.committee && (
                    <div>
                      <span className="text-gray-400 text-sm">Committee:</span>
                      <p className="text-white font-medium">{bill.committee}</p>
                    </div>
                  )}
                  {bill.next_action && (
                    <div>
                      <span className="text-gray-400 text-sm">Next Action:</span>
                      <p className="text-white font-medium">{bill.next_action}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Stats */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-advoline-orange" />
                      <span className="text-gray-400">Total Engaged</span>
                    </div>
                    <span className="text-white font-bold">{bill.engagement}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-neon-purple" />
                      <span className="text-gray-400">Active Threads</span>
                    </div>
                    <span className="text-white font-bold">{threads.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-gray-400">Trending Score</span>
                    </div>
                    <span className="text-white font-bold">
                      {Math.floor(Math.random() * 3) + 7}.{Math.floor(Math.random() * 10)}/10
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Take Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                  Contact Your Rep
                </Button>
                <Button className="w-full neon-button text-black font-bold">Share on Social</Button>
                <Button
                  className="w-full border-gray-600 text-gray-400 hover:text-white bg-transparent"
                  variant="outline"
                >
                  Find Local Events
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
