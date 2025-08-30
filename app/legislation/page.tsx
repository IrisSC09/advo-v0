"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Users, MessageCircle, Filter, X, Calendar, User, Building, Sparkles } from "lucide-react"
import Link from "next/link"

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
  const [partyFilter, setPartyFilter] = useState("all")
  const [topicFilter, setTopicFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchBills(1, true)
  }, [searchQuery, sortBy, partyFilter, topicFilter, statusFilter])

  const fetchBills = async (pageNum: number, reset = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "20",
      })

      if (searchQuery) params.append("query", searchQuery)
      if (partyFilter !== "all") params.append("party", partyFilter)
      if (topicFilter !== "all") params.append("topic", topicFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/bills?${params}`)
      const data: BillsResponse = await response.json()

      if (reset) {
        setBills(data.bills)
        setPage(1)
      } else {
        setBills((prev) => [...prev, ...data.bills])
      }

      setHasMore(data.hasMore)
      setTotal(data.total)
    } catch (error) {
      console.error("Error fetching bills:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchBills(nextPage, false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setPartyFilter("all")
    setTopicFilter("all")
    setStatusFilter("all")
    setSortBy("recent")
  }

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
        return "bg-blue-500"
      case "healthcare":
        return "bg-red-500"
      case "economics":
        return "bg-yellow-500"
      case "defense":
        return "bg-gray-500"
      default:
        return "bg-purple-500"
    }
  }

  const activeFiltersCount = [partyFilter, topicFilter, statusFilter].filter((f) => f !== "all").length

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            CURRENT <span className="text-neon-purple neon-glow font-extralight">LEGISLATION</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            Track bills, discover policy changes, and engage with legislation that matters to you.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bills by title, sponsor, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Select value={partyFilter} onValueChange={setPartyFilter}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
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

              <Select value={topicFilter} onValueChange={setTopicFilter}>
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="recent" className="text-white hover:bg-neon-purple hover:text-black">
                    Most Recent
                  </SelectItem>
                  <SelectItem value="engaged" className="text-white hover:bg-neon-purple hover:text-black">
                    Most Engaged
                  </SelectItem>
                  <SelectItem value="threads" className="text-white hover:bg-neon-purple hover:text-black">
                    Most Threads
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters & Clear */}
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <Badge className="bg-advoline-orange text-black">
                  <Filter className="h-3 w-3 mr-1" />
                  {activeFiltersCount} active
                </Badge>
              )}
              {(activeFiltersCount > 0 || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-gray-400 text-sm">
            {loading ? "Loading..." : `Showing ${bills.length} of ${total} bills`}
          </div>
        </div>

        {/* Bills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {bills.map((bill) => (
            <Card
              key={bill.bill_id}
              className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {bill.party && (
                      <Badge className={`${getPartyColor(bill.party)} text-white text-xs`}>{bill.party}</Badge>
                    )}
                    {bill.topic && (
                      <Badge className={`${getTopicColor(bill.topic)} text-white text-xs`}>{bill.topic}</Badge>
                    )}
                  </div>
                  <Badge className="bg-gray-700 text-gray-300 text-xs">{bill.status}</Badge>
                </div>
                <CardTitle className="text-white text-lg font-bold leading-tight">
                  <Link href={`/bill/${bill.bill_id}`} className="hover:text-advoline-orange transition-colors">
                    {bill.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Bill Number & Date */}
                <div className="flex items-center gap-4 mb-3 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{bill.bill_number}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(bill.introduced_date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Sponsor */}
                <div className="flex items-center gap-1 mb-3 text-gray-400 text-sm">
                  <User className="h-3 w-3" />
                  <span>Sponsored by {bill.sponsor_name}</span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                  {bill.description.substring(0, 150)}...
                </p>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{bill.engagement}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{bill.threads}</span>
                    </div>
                    <div className="flex items-center gap-1 text-neon-purple">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs">AI</span>
                    </div>
                  </div>
                  <Link href={`/bill/${bill.bill_id}`}>
                    <Button size="sm" className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                      View Bill
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              disabled={loading}
              className="neon-border bg-transparent text-neon-purple hover:neon-button hover:text-black"
            >
              {loading ? "Loading..." : "Load More Bills"}
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && bills.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No bills found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={clearFilters}
              className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
