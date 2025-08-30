"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Users,
  Music,
  FileText,
  Palette,
  Calendar,
  User,
  Vote,
  ScrollText,
  FileEdit,
  Plus,
  ExternalLink,
} from "lucide-react"
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
  status_date?: string
  progress?: Array<{
    date: string
    event: string
  }>
  committee?: string
  next_action?: string
  sponsors?: Array<{
    people_id: number
    name: string
    first_name: string
    last_name: string
    party: string
    role: string
  }>
  subjects?: string[]
  history?: Array<{
    date: string
    action: string
    chamber: string
  }>
  votes?: Array<{
    roll_call_id: number
    date: string
    desc: string
    yea: number
    nay: number
    nv: number
    absent: number
    total: number
    passed: number
  }>
  texts?: Array<{
    doc_id: number
    type: string
    mime: string
    url: string
    state_link: string
    text_size: number
  }>
  amendments?: Array<{
    amendment_id: number
    chamber: string
    number: string
    description: string
    status: string
  }>
  supplements?: Array<{
    supplement_id: number
    type: string
    title: string
    description: string
  }>
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

  const getPartyColor = (party: string) => {
    switch (party?.toLowerCase()) {
      case "democrat":
      case "d":
        return "bg-blue-500"
      case "republican":
      case "r":
        return "bg-red-500"
      case "independent":
      case "i":
        return "bg-purple-500"
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
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                  {/* Show sponsor party if available */}
                  {bill.sponsors?.[0]?.party && (
                    <Badge className={`${getPartyColor(bill.sponsors[0].party)} text-white`}>
                      {bill.sponsors[0].party}
                    </Badge>
                  )}
                  {/* Show first subject as primary topic */}
                  {bill.subjects?.[0] && <Badge className="bg-neon-purple text-white">{bill.subjects[0]}</Badge>}
                  <Badge className="bg-gray-700 text-gray-300">{bill.status}</Badge>
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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-gray-900 border-gray-800">
                <TabsTrigger
                  value="overview"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="text"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Text
                </TabsTrigger>
                <TabsTrigger
                  value="votes"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Votes
                </TabsTrigger>
                <TabsTrigger
                  value="amendments"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Amendments
                </TabsTrigger>
                <TabsTrigger
                  value="supplements"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Supplements
                </TabsTrigger>
                <TabsTrigger
                  value="threads"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Threads ({threads.length})
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Bill Status Details */}
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Current Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 text-sm">Status:</span>
                        <p className="text-white font-medium">{bill.status}</p>
                      </div>
                      {bill.status_date && (
                        <div>
                          <span className="text-gray-400 text-sm">Status Date:</span>
                          <p className="text-white font-medium">{new Date(bill.status_date).toLocaleDateString()}</p>
                        </div>
                      )}
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

                {/* Progress Events */}
                {bill.progress && bill.progress.length > 0 && (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Progress Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bill.progress.slice(0, 10).map((item, index) => (
                          <div key={index} className="flex gap-4 p-3 bg-gray-800 rounded-lg">
                            <div className="text-gray-400 text-sm min-w-[100px]">
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                            <div className="flex-1">
                              <p className="text-white">{item.event}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sponsors */}
                {bill.sponsors && bill.sponsors.length > 0 && (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Sponsors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bill.sponsors.map((sponsor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{sponsor.name}</p>
                              <p className="text-gray-400 text-sm">{sponsor.role}</p>
                            </div>
                            {sponsor.party && (
                              <Badge className={`${getPartyColor(sponsor.party)} text-white`}>{sponsor.party}</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* History */}
                {bill.history && bill.history.length > 0 && (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Legislative History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bill.history.slice(0, 10).map((item, index) => (
                          <div key={index} className="flex gap-4 p-3 bg-gray-800 rounded-lg">
                            <div className="text-gray-400 text-sm min-w-[100px]">
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                            <div className="flex-1">
                              <p className="text-white">{item.action}</p>
                              {item.chamber && <p className="text-gray-400 text-sm">{item.chamber}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Subjects */}
                {bill.subjects && bill.subjects.length > 0 && (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Subjects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {bill.subjects.map((subject, index) => (
                          <Badge
                            key={index}
                            className="bg-neon-purple/20 text-neon-purple border border-neon-purple/50"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Text Tab */}
              <TabsContent value="text" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <ScrollText className="h-5 w-5 mr-2" />
                      Bill Text Versions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.texts && bill.texts.length > 0 ? (
                      <div className="space-y-3">
                        {bill.texts.map((text, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <p className="text-white font-medium">{text.type}</p>
                              <p className="text-gray-400 text-sm">
                                {text.mime} • {(text.text_size / 1024).toFixed(1)}KB
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {text.state_link && (
                                <Button
                                  size="sm"
                                  className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                                  asChild
                                >
                                  <a href={text.state_link} target="_blank" rel="noopener noreferrer">
                                    View Official Text
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No text versions available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Votes Tab */}
              <TabsContent value="votes" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Vote className="h-5 w-5 mr-2" />
                      Roll Call Votes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.votes && bill.votes.length > 0 ? (
                      <div className="space-y-4">
                        {bill.votes.map((vote, index) => (
                          <div key={index} className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="text-white font-medium">{vote.desc}</p>
                                <p className="text-gray-400 text-sm">{new Date(vote.date).toLocaleDateString()}</p>
                              </div>
                              <Badge className={vote.passed ? "bg-green-500" : "bg-red-500"}>
                                {vote.passed ? "PASSED" : "FAILED"}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-center">
                              <div>
                                <p className="text-green-400 font-bold text-lg">{vote.yea}</p>
                                <p className="text-gray-400 text-sm">Yea</p>
                              </div>
                              <div>
                                <p className="text-red-400 font-bold text-lg">{vote.nay}</p>
                                <p className="text-gray-400 text-sm">Nay</p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-bold text-lg">{vote.nv}</p>
                                <p className="text-gray-400 text-sm">Not Voting</p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-bold text-lg">{vote.absent}</p>
                                <p className="text-gray-400 text-sm">Absent</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No votes recorded</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Amendments Tab */}
              <TabsContent value="amendments" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileEdit className="h-5 w-5 mr-2" />
                      Amendments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.amendments && bill.amendments.length > 0 ? (
                      <div className="space-y-3">
                        {bill.amendments.map((amendment, index) => (
                          <div key={index} className="p-3 bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">
                                  {amendment.chamber} Amendment {amendment.number}
                                </p>
                                <p className="text-gray-300 text-sm mt-1">{amendment.description}</p>
                              </div>
                              <Badge className="bg-gray-700 text-gray-300">{amendment.status}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No amendments available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Supplements Tab */}
              <TabsContent value="supplements" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Supplements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.supplements && bill.supplements.length > 0 ? (
                      <div className="space-y-3">
                        {bill.supplements.map((supplement, index) => (
                          <div key={index} className="p-3 bg-gray-800 rounded-lg">
                            <p className="text-white font-medium">{supplement.title}</p>
                            <p className="text-gray-400 text-sm">{supplement.type}</p>
                            {supplement.description && (
                              <p className="text-gray-300 text-sm mt-1">{supplement.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No supplements available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Threads Tab */}
              <TabsContent value="threads" className="space-y-6">
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
              </TabsContent>
            </Tabs>
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
                  {bill.status_date && (
                    <div>
                      <span className="text-gray-400 text-sm">Status Date:</span>
                      <p className="text-white font-medium">{new Date(bill.status_date).toLocaleDateString()}</p>
                    </div>
                  )}
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

            {/* Community Stats */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-neon-purple" />
                      <span className="text-gray-400">Active Threads</span>
                    </div>
                    <span className="text-white font-bold">{threads.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-advoline-orange" />
                      <span className="text-gray-400">Contributors</span>
                    </div>
                    <span className="text-white font-bold">{new Set(threads.map((t) => t.author_id)).size}</span>
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
