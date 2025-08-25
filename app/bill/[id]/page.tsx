"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Share2, Bookmark, Users, TrendingUp, Sparkles, Music, FileText, Palette } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function BillDetailPage() {
  const params = useParams()

  // Mock bill data - in real app would fetch based on params.id
  const bill = {
    id: "hr-2024-001",
    title: "Climate Action and Green Jobs Act",
    sponsor: "Rep. Alexandria Ocasio-Cortez (D-NY)",
    party: "Democrat",
    topic: "Climate",
    status: "Committee Review",
    introduced: "2024-01-15",
    fullText:
      "A comprehensive bill to address climate change through massive investment in renewable energy infrastructure, creation of green jobs, and establishment of ambitious carbon reduction targets...",
    summary:
      "Comprehensive legislation to address climate change through job creation in renewable energy sectors and carbon reduction targets.",
    keyPoints: [
      "$500B investment in clean energy infrastructure",
      "Creation of 2 million new green jobs over 5 years",
      "50% emissions reduction target by 2030",
      "Just transition support for fossil fuel workers",
      "Environmental justice provisions for disadvantaged communities",
    ],
    sentiment: { support: 67, oppose: 23, neutral: 10 },
    threads: 23,
    engagement: 1247,
    committee: "House Committee on Energy and Commerce",
    nextAction: "Committee markup scheduled for January 25, 2024",
  }

  const threads = [
    {
      id: 1,
      type: "zine",
      title: "Green New Deal Zine: Climate Justice Now",
      author: "ClimateArtist",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Created a 12-page zine breaking down the climate bill in accessible graphics and art.",
      likes: 234,
      shares: 67,
      timeAgo: "2h ago",
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      type: "music",
      title: "Green Jobs Anthem - Original Song",
      author: "ActivistBeats",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Wrote and recorded a song about the hope this bill brings for working families.",
      likes: 189,
      shares: 45,
      timeAgo: "4h ago",
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      type: "art",
      title: "Protest Poster Series: Climate Action",
      author: "RevolutionaryDesign",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Series of 6 protest posters ready for printing and sharing at climate rallies.",
      likes: 156,
      shares: 89,
      timeAgo: "6h ago",
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      type: "blog",
      title: "Why This Climate Bill Matters for Gen Z",
      author: "FutureVoter",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Deep dive into how this legislation will impact young people's economic future...",
      likes: 298,
      shares: 123,
      timeAgo: "1d ago",
      preview: "/placeholder.svg?height=200&width=300",
    },
  ]

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

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feed
        </Link>

        {/* Bill Header */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-500 text-white">{bill.party}</Badge>
                  <Badge className="bg-green-500 text-white">{bill.topic}</Badge>
                  <Badge className="bg-gray-700 text-gray-300">{bill.status}</Badge>
                  <div className="flex items-center gap-1 text-neon-purple ml-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm">AI Enhanced</span>
                  </div>
                </div>
                <h1 className="text-3xl font-black text-white mb-2">{bill.title}</h1>
                <p className="text-gray-400 mb-4">
                  {bill.id.toUpperCase()} • Sponsored by {bill.sponsor} • Introduced{" "}
                  {new Date(bill.introduced).toLocaleDateString()}
                </p>
                <p className="text-gray-300 leading-relaxed">{bill.summary}</p>
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
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="h-5 w-5 text-neon-purple mr-2" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Key Propositions:</h4>
                  <ul className="space-y-2">
                    {bill.keyPoints.map((point, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-advoline-orange mr-2 mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Public Sentiment Analysis:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Support: {bill.sentiment.support}%</span>
                      <span className="text-red-400">Oppose: {bill.sentiment.oppose}%</span>
                      <span className="text-gray-400">Neutral: {bill.sentiment.neutral}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div className="flex h-3 rounded-full overflow-hidden">
                        <div className="bg-green-500" style={{ width: `${bill.sentiment.support}%` }}></div>
                        <div className="bg-red-500" style={{ width: `${bill.sentiment.oppose}%` }}></div>
                        <div className="bg-gray-500" style={{ width: `${bill.sentiment.neutral}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Threads */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Community Threads ({threads.length})</CardTitle>
                  <Link href={`/bill/${bill.id}/create-thread`}>
                    <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                      Create Thread
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threads.map((thread) => {
                    const TypeIcon = getTypeIcon(thread.type)
                    return (
                      <Card key={thread.id} className="bg-gray-800 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={thread.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-advoline-orange text-black">
                                {thread.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={`${getTypeColor(thread.type)} text-white text-xs`}>
                                  <TypeIcon className="h-3 w-3 mr-1" />
                                  {thread.type}
                                </Badge>
                                <span className="text-gray-400 text-sm">by {thread.author}</span>
                                <span className="text-gray-500 text-sm">{thread.timeAgo}</span>
                              </div>
                              <h4 className="text-white font-semibold mb-2">{thread.title}</h4>
                              <p className="text-gray-400 text-sm mb-3">{thread.content}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-gray-400 text-sm">
                                  <span>{thread.likes} likes</span>
                                  <span>{thread.shares} shares</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                                >
                                  View Thread
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
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
                  <div>
                    <span className="text-gray-400 text-sm">Committee:</span>
                    <p className="text-white font-medium">{bill.committee}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Next Action:</span>
                    <p className="text-white font-medium">{bill.nextAction}</p>
                  </div>
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
                    <span className="text-white font-bold">{bill.threads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-gray-400">Trending Score</span>
                    </div>
                    <span className="text-white font-bold">8.7/10</span>
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
