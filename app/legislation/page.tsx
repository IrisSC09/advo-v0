"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, MessageCircle, Calendar, Filter, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LegislationPage() {
  const [sortBy, setSortBy] = useState("recent")
  const [filterParty, setFilterParty] = useState("all")
  const [filterTopic, setFilterTopic] = useState("all")

  const bills = [
    {
      id: "hr-2024-001",
      title: "Climate Action and Green Jobs Act",
      sponsor: "Rep. Alexandria Ocasio-Cortez (D-NY)",
      party: "Democrat",
      topic: "Climate",
      status: "Committee Review",
      introduced: "2024-01-15",
      summary:
        "Comprehensive legislation to address climate change through job creation in renewable energy sectors and carbon reduction targets.",
      keyPoints: ["$500B investment in clean energy", "2 million new green jobs", "50% emissions reduction by 2030"],
      threads: 23,
      engagement: 1247,
    },
    {
      id: "s-2024-045",
      title: "Border Security Enhancement Act",
      sponsor: "Sen. Ted Cruz (R-TX)",
      party: "Republican",
      topic: "Immigration",
      status: "Floor Vote Pending",
      introduced: "2024-01-12",
      summary:
        "Legislation to strengthen border security through increased funding for border patrol and enhanced screening technologies.",
      keyPoints: ["$25B for border wall completion", "5,000 new border agents", "Mandatory E-Verify system"],
      threads: 18,
      engagement: 892,
    },
    {
      id: "hr-2024-078",
      title: "Student Debt Relief and Education Reform Act",
      sponsor: "Rep. Bernie Sanders (I-VT)",
      party: "Independent",
      topic: "Education",
      status: "Introduced",
      introduced: "2024-01-10",
      summary:
        "Comprehensive student debt forgiveness program coupled with free community college and trade school access.",
      keyPoints: ["$50K debt forgiveness per borrower", "Free community college", "Trade school funding"],
      threads: 31,
      engagement: 2156,
    },
    {
      id: "s-2024-023",
      title: "Healthcare Price Transparency Act",
      sponsor: "Sen. Susan Collins (R-ME)",
      party: "Republican",
      topic: "Healthcare",
      status: "Committee Review",
      introduced: "2024-01-08",
      summary:
        "Requires healthcare providers and insurers to disclose pricing information to improve market transparency.",
      keyPoints: ["Mandatory price disclosure", "Insurance cost transparency", "Patient billing rights"],
      threads: 12,
      engagement: 634,
    },
  ]

  const filteredBills = bills
    .filter((bill) => {
      if (filterParty !== "all" && bill.party.toLowerCase() !== filterParty) return false
      if (filterTopic !== "all" && bill.topic.toLowerCase() !== filterTopic) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.introduced).getTime() - new Date(a.introduced).getTime()
      if (sortBy === "engagement") return b.engagement - a.engagement
      if (sortBy === "threads") return b.threads - a.threads
      return 0
    })

  const getPartyColor = (party: string) => {
    switch (party.toLowerCase()) {
      case "democrat":
        return "bg-blue-500"
      case "republican":
        return "bg-red-500"
      case "independent":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTopicColor = (topic: string) => {
    switch (topic.toLowerCase()) {
      case "climate":
        return "bg-green-500"
      case "immigration":
        return "bg-orange-500"
      case "education":
        return "bg-yellow-500"
      case "healthcare":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            LEGISLATIVE <span className="text-neon-purple neon-glow font-extralight">FEED</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            Stay informed on the latest bills and legislation. Create threads, share content, drive change.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bills, sponsors, topics..."
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="recent" className="text-white hover:bg-neon-purple hover:text-black">
                  Most Recent
                </SelectItem>
                <SelectItem value="engagement" className="text-white hover:bg-neon-purple hover:text-black">
                  Most Engaged
                </SelectItem>
                <SelectItem value="threads" className="text-white hover:bg-neon-purple hover:text-black">
                  Most Threads
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterParty} onValueChange={setFilterParty}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Party" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-neon-purple hover:text-black">
                  All Parties
                </SelectItem>
                <SelectItem value="democrat" className="text-white hover:bg-neon-purple hover:text-black">
                  Democrat
                </SelectItem>
                <SelectItem value="republican" className="text-white hover:bg-neon-purple hover:text-black">
                  Republican
                </SelectItem>
                <SelectItem value="independent" className="text-white hover:bg-neon-purple hover:text-black">
                  Independent
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTopic} onValueChange={setFilterTopic}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-neon-purple hover:text-black">
                  All Topics
                </SelectItem>
                <SelectItem value="climate" className="text-white hover:bg-neon-purple hover:text-black">
                  Climate
                </SelectItem>
                <SelectItem value="immigration" className="text-white hover:bg-neon-purple hover:text-black">
                  Immigration
                </SelectItem>
                <SelectItem value="education" className="text-white hover:bg-neon-purple hover:text-black">
                  Education
                </SelectItem>
                <SelectItem value="healthcare" className="text-white hover:bg-neon-purple hover:text-black">
                  Healthcare
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bills Feed */}
        <div className="space-y-6">
          {filteredBills.map((bill) => (
            <Card key={bill.id} className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getPartyColor(bill.party)} text-white text-xs`}>{bill.party}</Badge>
                      <Badge className={`${getTopicColor(bill.topic)} text-white text-xs`}>{bill.topic}</Badge>
                      <Badge className="bg-gray-700 text-gray-300 text-xs">{bill.status}</Badge>
                    </div>
                    <CardTitle className="text-white text-xl font-bold hover:text-advoline-orange transition-colors">
                      <Link href={`/bill/${bill.id}`}>{bill.title}</Link>
                    </CardTitle>
                    <p className="text-gray-400 text-sm mt-1">
                      Sponsored by {bill.sponsor} • Introduced {new Date(bill.introduced).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-neon-purple">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">AI Summary</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-300 mb-4 leading-relaxed">{bill.summary}</p>

                <div className="mb-4">
                  <h4 className="text-white font-semibold mb-2">Key Propositions:</h4>
                  <ul className="space-y-1">
                    {bill.keyPoints.map((point, index) => (
                      <li key={index} className="text-gray-400 text-sm flex items-start">
                        <span className="text-advoline-orange mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{bill.threads} threads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">{bill.engagement} engaged</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{new Date(bill.introduced).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/bill/${bill.id}`}>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/bill/${bill.id}/create-thread`}>
                      <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                        Create Thread
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button className="neon-border bg-transparent text-neon-purple hover:neon-button hover:text-black">
            Load More Bills
          </Button>
        </div>
      </div>
    </div>
  )
}
