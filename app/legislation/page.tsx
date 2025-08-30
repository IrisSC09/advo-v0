"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, TrendingUp, MessageCircle, Calendar, Filter, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Bill {
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
}

interface BillsResponse {
  bills: Bill[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export default function LegislationPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterParty, setFilterParty] = useState("all")
  const [filterTopic, setFilterTopic] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchBills = async (pageNum = 1, reset = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "20",
      })

      if (searchQuery) params.append("query", searchQuery)
      if (filterParty !== "all") params.append("party", filterParty)
      if (filterTopic !== "all") params.append("topic", filterTopic)
      if (filterStatus !== "all") params.append("status", filterStatus)

      const response = await fetch(`/api/bills?${params}`)
      const data: BillsResponse = await response.json()

      if (reset) {
        setBills(data.bills)
      } else {
        setBills((prev) => [...prev, ...data.bills])
      }

      setHasMore(data.hasMore)
      setTotal(data.total)
      setPage(pageNum)
    } catch (error) {
      console.error("Error fetching bills:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBills(1, true)
  }, [searchQuery, filterParty, filterTopic, filterStatus])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBills(1, true)
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchBills(page + 1, false)
    }
  }

  const sortedBills = [...bills].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.introduced_date).getTime() - new Date(a.introduced_date).getTime()
    }
    if (sortBy === "engagement") {
      return (b.engagement || 0) - (a.engagement || 0)
    }
    if (sortBy === "threads") {
      return (b.threads || 0) - (a.threads || 0)
    }
    return 0
  })

  const getPartyColor = (party: string) => {
    switch (party?.toLowerCase()) {
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
    switch (topic?.toLowerCase()) {
      case "climate":
        return "bg-green-500"
      case "immigration":
        return "bg-orange-500"
      case "education":
        return "bg-yellow-500"
      case "healthcare":
        return "bg-pink-500"
      case "economics":
        return "bg-indigo-500"
      case "defense":
        return "bg-red-600"
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
          {total > 0 && (
            <p className="text-advoline-orange text-sm mt-2">
              Showing {bills.length} of {total} bills
            </p>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bills, sponsors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </form>

          <div className="flex gap-2 flex-wrap">
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
                <SelectItem value="economics" className="text-white hover:bg-neon-purple hover:text-black">
                  Economics
                </SelectItem>
                <SelectItem value="defense" className="text-white hover:bg-neon-purple hover:text-black">
                  Defense
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all" className="text-white hover:bg-neon-purple hover:text-black">
                  All Status
                </SelectItem>
                <SelectItem value="introduced" className="text-white hover:bg-neon-purple hover:text-black">
                  Introduced
                </SelectItem>
                <SelectItem value="committee" className="text-white hover:bg-neon-purple hover:text-black">
                  Committee
                </SelectItem>
                <SelectItem value="passed" className="text-white hover:bg-neon-purple hover:text-black">
                  Passed
                </SelectItem>
                <SelectItem value="enacted" className="text-white hover:bg-neon-purple hover:text-black">
                  Enacted
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && bills.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-neon-purple" />
            <span className="ml-2 text-white">Loading bills...</span>
          </div>
        )}

        {/* Bills Feed */}
        <div className="space-y-6">
          {sortedBills.map((bill) => (
            <Card
              key={bill.bill_id}
              className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {bill.party && (
                        <Badge className={`${getPartyColor(bill.party)} text-white text-xs`}>{bill.party}</Badge>
                      )}
                      {bill.topic && (
                        <Badge className={`${getTopicColor(bill.topic)} text-white text-xs`}>{bill.topic}</Badge>
                      )}
                      <Badge className="bg-gray-700 text-gray-300 text-xs">{bill.status}</Badge>
                    </div>
                    <CardTitle className="text-white text-xl font-bold hover:text-advoline-orange transition-colors">
                      <Link href={`/bill/${bill.bill_id}`}>{bill.title}</Link>
                    </CardTitle>
                    <p className="text-gray-400 text-sm mt-1">
                      {bill.bill_number} • Sponsored by {bill.sponsor_name} • Introduced{" "}
                      {new Date(bill.introduced_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-neon-purple">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">AI Summary</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-300 mb-4 leading-relaxed">{bill.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-gray-400">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{bill.threads || 0} threads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">{bill.engagement || 0} engaged</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{new Date(bill.introduced_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/bill/${bill.bill_id}`}>
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/bill/${bill.bill_id}/create-thread`}>
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

        {/* No Results */}
        {!loading && bills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No bills found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setFilterParty("all")
                setFilterTopic("all")
                setFilterStatus("all")
              }}
              className="mt-4 neon-border bg-transparent text-neon-purple hover:neon-button hover:text-black"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {hasMore && bills.length > 0 && (
          <div className="text-center mt-8">
            <Button
              onClick={handleLoadMore}
              disabled={loading}
              className="neon-border bg-transparent text-neon-purple hover:neon-button hover:text-black"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load More Bills"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
