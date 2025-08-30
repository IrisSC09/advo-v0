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
  FileText,
  Palette,
  Music,
  ExternalLink,
  Calendar,
  User,
  Building,
  Vote,
  FileX,
  ScrollText,
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
  party?: string
  topic?: string
  full_text?: string
  committee?: string
  next_action?: string
  sponsors?: Array<{
    name: string
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
    description: string
    chamber: string
    yea: number
    nay: number
    nv: number
    absent: number
    total: number
    passed: boolean
  }>
  texts?: Array<{
    doc_id: number
    type: string
    mime: string
    url: string
    date: string
  }>
  amendments?: Array<{
    amendment_id: number
    title: string
    description: string
    adopted: boolean
  }>
  supplements?: Array<{
    supplement_id: number
    title: string
    type: string
    date: string
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
                  {bill.party && <Badge className={`${getPartyColor(bill.party)} text-white`}>{bill.party}</Badge>}
                  {bill.topic && <Badge className="bg-green-500 text-white">{bill.topic}</Badge>}
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
              <TabsList className="grid w-full grid-cols-6 bg-gray-900 border border-gray-800">
                <TabsTrigger
                  value="overview"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-advoline-orange"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="sponsors"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-advoline-orange"
                >
                  Sponsors
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-advoline-orange"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="votes"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-advoline-orange"
                >
                  Votes
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-advoline-orange"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="threads"
                  className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-advoline-orange"
                >
                  Threads
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
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
                        <div>
                          <span className="text-gray-400 text-sm">Committee:</span>
                          <p className="text-white font-medium">{bill.committee}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-400 text-sm">Next Action:</span>
                          <p className="text-white font-medium">{bill.next_action}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sponsors" className="mt-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Sponsors & Co-Sponsors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.sponsors && bill.sponsors.length > 0 ? (
                      <div className="space-y-3">
                        {bill.sponsors.map((sponsor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-white font-medium">{sponsor.name}</span>
                              </div>
                              <Badge className={`${getPartyColor(sponsor.party)} text-white text-xs`}>
                                {sponsor.party}
                              </Badge>
                            </div>
                            <Badge className="bg-gray-700 text-gray-300 text-xs">{sponsor.role}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No sponsor information available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Legislative History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.history && bill.history.length > 0 ? (
                      <div className="space-y-4">
                        {bill.history.map((item, index) => (
                          <div key={index} className="flex gap-4 p-4 bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-2 min-w-0">
                              <Calendar className="h-4 w-4 text-advoline-orange flex-shrink-0" />
                              <span className="text-gray-400 text-sm whitespace-nowrap">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Building className="h-4 w-4 text-neon-purple" />
                                <span className="text-neon-purple text-sm font-medium">{item.chamber}</span>
                              </div>
                              <p className="text-white">{item.action}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No history information available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="votes" className="mt-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Roll Call Votes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.votes && bill.votes.length > 0 ? (
                      <div className="space-y-4">
                        {bill.votes.map((vote, index) => (
                          <div key={index} className="p-4 bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Vote className="h-4 w-4 text-advoline-orange" />
                                <span className="text-white font-medium">{vote.description}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={vote.passed ? "bg-green-500" : "bg-red-500"}>
                                  {vote.passed ? "PASSED" : "FAILED"}
                                </Badge>
                                <span className="text-gray-400 text-sm">{vote.chamber}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-green-500 font-bold text-lg">{vote.yea}</div>
                                <div className="text-gray-400">Yea</div>
                              </div>
                              <div className="text-center">
                                <div className="text-red-500 font-bold text-lg">{vote.nay}</div>
                                <div className="text-gray-400">Nay</div>
                              </div>
                              <div className="text-center">
                                <div className="text-yellow-500 font-bold text-lg">{vote.nv}</div>
                                <div className="text-gray-400">Not Voting</div>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500 font-bold text-lg">{vote.absent}</div>
                                <div className="text-gray-400">Absent</div>
                              </div>
                              <div className="text-center">
                                <div className="text-white font-bold text-lg">{vote.total}</div>
                                <div className="text-gray-400">Total</div>
                              </div>
                            </div>
                            <div className="mt-3 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                                onClick={() => window.open(`/api/bills/${vote.roll_call_id}/rollcall`, "_blank")}
                              >
                                View Details
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No voting records available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <div className="space-y-6">
                  {/* Bill Texts */}
                  {bill.texts && bill.texts.length > 0 && (
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          Bill Texts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {bill.texts.map((text, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                              <div>
                                <div className="text-white font-medium">{text.type}</div>
                                <div className="text-gray-400 text-sm">{new Date(text.date).toLocaleDateString()}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                                  onClick={() => window.open(`/api/bills/${text.doc_id}/text`, "_blank")}
                                >
                                  View Text
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                                {text.url && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                                    onClick={() => window.open(text.url, "_blank")}
                                  >
                                    State Link
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Amendments */}
                  {bill.amendments && bill.amendments.length > 0 && (
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <FileX className="h-5 w-5 mr-2" />
                          Amendments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {bill.amendments.map((amendment, index) => (
                            <div key={index} className="p-3 bg-gray-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-white font-medium">{amendment.title}</div>
                                <Badge className={amendment.adopted ? "bg-green-500" : "bg-gray-500"}>
                                  {amendment.adopted ? "ADOPTED" : "NOT ADOPTED"}
                                </Badge>
                              </div>
                              <p className="text-gray-400 text-sm mb-2">{amendment.description}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                                onClick={() => window.open(`/api/bills/${amendment.amendment_id}/amendment`, "_blank")}
                              >
                                View Amendment
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Supplements */}
                  {bill.supplements && bill.supplements.length > 0 && (
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <ScrollText className="h-5 w-5 mr-2" />
                          Supplements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {bill.supplements.map((supplement, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                              <div>
                                <div className="text-white font-medium">{supplement.title}</div>
                                <div className="text-gray-400 text-sm">
                                  {supplement.type} • {new Date(supplement.date).toLocaleDateString()}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                                onClick={() =>
                                  window.open(`/api/bills/${supplement.supplement_id}/supplement`, "_blank")
                                }
                              >
                                View Supplement
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="threads" className="mt-6">
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
            {/* Quick Stats */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Vote className="h-4 w-4 text-green-500" />
                      <span className="text-gray-400">Roll Calls</span>
                    </div>
                    <span className="text-white font-bold">{bill.votes?.length || 0}</span>
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
