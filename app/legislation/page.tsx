"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X, Calendar, User, Building } from "lucide-react"
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
}

interface BillsResponse {
  bills: Bill[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

interface SearchResult {
  relevance: number
  state: string
  bill_number: string
  bill_id: number
  change_hash: string
  url: string
  text_url: string
  research_url: string
  last_action_date: string
  last_action: string
  title: string
}

interface SearchResponse {
  results: SearchResult[]
  summary: {
    count: number
    page: number
    total_pages: number
  }
}

export default function LegislationPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [partyFilter, setPartyFilter] = useState("all")
  const [topicFilter, setTopicFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stateFilter, setStateFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [isSearchMode, setIsSearchMode] = useState(false)

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(1, true)
    } else {
      fetchBills(1, true)
    }
  }, [searchQuery, sortBy, partyFilter, topicFilter, statusFilter, stateFilter])

  const fetchBills = async (pageNum: number, reset = false) => {
    setLoading(true)
    setIsSearchMode(false)
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "20",
      })

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

  const performSearch = async (pageNum: number, reset = false) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setIsSearchMode(true)
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        state: stateFilter,
        page: pageNum.toString(),
      })

      const response = await fetch(`/api/search?${params}`)
      const data: SearchResponse = await response.json()

      if (reset) {
        setSearchResults(data.results)
        setPage(1)
      } else {
        setSearchResults((prev) => [...prev, ...data.results])
      }

      setHasMore(pageNum < data.summary.total_pages)
      setTotal(data.summary.count)
    } catch (error) {
      console.error("Error performing search:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    if (isSearchMode) {
      performSearch(nextPage, false)
    } else {
      fetchBills(nextPage, false)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setPartyFilter("all")
    setTopicFilter("all")
    setStatusFilter("all")
    setStateFilter("ALL")
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

  const displayItems = isSearchMode ? searchResults : bills

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
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="ALL" className="text-white hover:bg-neon-purple hover:text-black">
                    All States
                  </SelectItem>
                  <SelectItem value="US" className="text-white hover:bg-neon-purple hover:text-black">
                    Federal
                  </SelectItem>
                  <SelectItem value="CA" className="text-white hover:bg-neon-purple hover:text-black">
                    California
                  </SelectItem>
                  <SelectItem value="NY" className="text-white hover:bg-neon-purple hover:text-black">
                    New York
                  </SelectItem>
                  <SelectItem value="TX" className="text-white hover:bg-neon-purple hover:text-black">
                    Texas
                  </SelectItem>
                  <SelectItem value="FL" className="text-white hover:bg-neon-purple hover:text-black">
                    Florida
                  </SelectItem>
                </SelectContent>
              </Select>

              {!isSearchMode && (
                <>
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
                </>
              )}
            </div>

            {/* Active Filters & Clear */}
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && !isSearchMode && (
                <Badge className="bg-advoline-orange text-black">
                  <Filter className="h-3 w-3 mr-1" />
                  {activeFiltersCount} active
                </Badge>
              )}
              {isSearchMode && (
                <Badge className="bg-neon-purple text-white">
                  <Search className="h-3 w-3 mr-1" />
                  Search Mode
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
            {loading
              ? "Loading..."
              : isSearchMode
                ? `Search results: ${searchResults.length} of ${total} bills`
                : `Showing ${bills.length} of ${total} bills`}
          </div>
        </div>

        {/* Bills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {(isSearchMode ? searchResults : bills).map((item) => {
            const bill = isSearchMode
              ? {
                  bill_id: item.bill_id,
                  title: item.title,
                  description: item.last_action || "No description available",
                  introduced_date: item.last_action_date,
                  sponsor_name: "Unknown Sponsor",
                  state: item.state,
                  bill_number: item.bill_number,
                  status: "Unknown",
                  party: "Unknown",
                  topic: "Other",
                }
              : item

            return (
              <Card
                key={bill.bill_id}
                className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {bill.party && bill.party !== "Unknown" && (
                        <Badge className={`${getPartyColor(bill.party)} text-white text-xs`}>{bill.party}</Badge>
                      )}
                      {bill.topic && bill.topic !== "Other" && (
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
                  {bill.sponsor_name !== "Unknown Sponsor" && (
                    <div className="flex items-center gap-1 mb-3 text-gray-400 text-sm">
                      <User className="h-3 w-3" />
                      <span>Sponsored by {bill.sponsor_name}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                    {bill.description.substring(0, 150)}...
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <span className="text-xs">{bill.state}</span>
                      {isSearchMode && (
                        <Badge className="bg-neon-purple/20 text-neon-purple text-xs">Search Result</Badge>
                      )}
                    </div>
                    <Link href={`/bill/${bill.bill_id}`}>
                      <Button size="sm" className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                        View Bill
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
        {!loading && displayItems.length === 0 && (
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
