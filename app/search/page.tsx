"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Vote, ScrollText, FileX, ExternalLink, Calendar } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface SearchResult {
  relevance: number
  bill?: {
    bill_id: number
    title: string
    description: string
    bill_number: string
    status: string
    last_action_date: string
    url: string
  }
  text?: {
    doc_id: number
    bill_id: number
    type: string
    title: string
    date: string
    url: string
  }
  amendment?: {
    amendment_id: number
    bill_id: number
    title: string
    description: string
    date: string
    adopted: boolean
  }
  supplement?: {
    supplement_id: number
    bill_id: number
    title: string
    type: string
    date: string
  }
  roll_call?: {
    roll_call_id: number
    bill_id: number
    date: string
    description: string
    yea: number
    nay: number
    passed: boolean
  }
}

interface SearchResponse {
  results: SearchResult[]
  summary: {
    count: number
    page: number
    total_pages: number
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [state, setState] = useState(searchParams.get("state") || "US")
  const [year, setYear] = useState(searchParams.get("year") || "")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<SearchResponse["summary"] | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (searchParams.get("q")) {
      performSearch(1)
    }
  }, [])

  const performSearch = async (pageNum = 1) => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: query,
        state,
        page: pageNum.toString(),
      })

      if (year) params.append("year", year)

      const response = await fetch(`/api/search?${params}`)
      const data: SearchResponse = await response.json()

      if (pageNum === 1) {
        setResults(data.results)
      } else {
        setResults((prev) => [...prev, ...data.results])
      }

      setSummary(data.summary)
      setPage(pageNum)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(1)
  }

  const loadMore = () => {
    performSearch(page + 1)
  }

  const getResultIcon = (result: SearchResult) => {
    if (result.bill) return FileText
    if (result.text) return ScrollText
    if (result.amendment) return FileX
    if (result.supplement) return ScrollText
    if (result.roll_call) return Vote
    return FileText
  }

  const getResultColor = (result: SearchResult) => {
    if (result.bill) return "text-neon-purple"
    if (result.text) return "text-blue-500"
    if (result.amendment) return "text-yellow-500"
    if (result.supplement) return "text-green-500"
    if (result.roll_call) return "text-red-500"
    return "text-gray-400"
  }

  const getResultType = (result: SearchResult) => {
    if (result.bill) return "Bill"
    if (result.text) return "Bill Text"
    if (result.amendment) return "Amendment"
    if (result.supplement) return "Supplement"
    if (result.roll_call) return "Roll Call"
    return "Document"
  }

  const renderResult = (result: SearchResult, index: number) => {
    const Icon = getResultIcon(result)
    const color = getResultColor(result)
    const type = getResultType(result)

    return (
      <Card key={index} className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg bg-gray-800`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={`${color.replace("text-", "bg-")}/20 ${color} border ${color.replace("text-", "border-")}/50`}
                >
                  {type}
                </Badge>
                <div className="text-gray-400 text-sm">Relevance: {Math.round(result.relevance * 100)}%</div>
              </div>

              {result.bill && (
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    <Link
                      href={`/bill/${result.bill.bill_id}`}
                      className="hover:text-advoline-orange transition-colors"
                    >
                      {result.bill.title}
                    </Link>
                  </h3>
                  <p className="text-gray-400 mb-3">{result.bill.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{result.bill.bill_number}</span>
                    <Badge className="bg-gray-700 text-gray-300">{result.bill.status}</Badge>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.bill.last_action_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {result.text && (
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{result.text.title}</h3>
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <span className="text-gray-400">{result.text.type}</span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.text.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/bill/${result.text.bill_id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      >
                        View Bill
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() => window.open(`/api/bills/${result.text.doc_id}/text`, "_blank")}
                    >
                      View Text
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {result.amendment && (
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{result.amendment.title}</h3>
                  <p className="text-gray-400 mb-3">{result.amendment.description}</p>
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <Badge className={result.amendment.adopted ? "bg-green-500" : "bg-gray-500"}>
                      {result.amendment.adopted ? "ADOPTED" : "NOT ADOPTED"}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.amendment.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/bill/${result.amendment.bill_id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      >
                        View Bill
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() => window.open(`/api/bills/${result.amendment.amendment_id}/amendment`, "_blank")}
                    >
                      View Amendment
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {result.supplement && (
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{result.supplement.title}</h3>
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <span className="text-gray-400">{result.supplement.type}</span>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.supplement.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/bill/${result.supplement.bill_id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      >
                        View Bill
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() => window.open(`/api/bills/${result.supplement.supplement_id}/supplement`, "_blank")}
                    >
                      View Supplement
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {result.roll_call && (
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">{result.roll_call.description}</h3>
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <Badge className={result.roll_call.passed ? "bg-green-500" : "bg-red-500"}>
                      {result.roll_call.passed ? "PASSED" : "FAILED"}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.roll_call.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div className="text-center">
                      <div className="text-green-500 font-bold">{result.roll_call.yea}</div>
                      <div className="text-gray-400">Yea</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-500 font-bold">{result.roll_call.nay}</div>
                      <div className="text-gray-400">Nay</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/bill/${result.roll_call.bill_id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      >
                        View Bill
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() => window.open(`/api/bills/${result.roll_call.roll_call_id}/rollcall`, "_blank")}
                    >
                      View Roll Call
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            LEGISLATIVE <span className="text-neon-purple neon-glow font-extralight">SEARCH</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            Search bills, amendments, supplements, roll calls, and bill texts across all states.
          </p>
        </div>

        {/* Search Form */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search legislation, amendments, roll calls..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="US" className="text-white hover:bg-neon-purple hover:text-black">
                      Federal (US)
                    </SelectItem>
                    <SelectItem value="AL" className="text-white hover:bg-neon-purple hover:text-black">
                      Alabama
                    </SelectItem>
                    <SelectItem value="CA" className="text-white hover:bg-neon-purple hover:text-black">
                      California
                    </SelectItem>
                    <SelectItem value="FL" className="text-white hover:bg-neon-purple hover:text-black">
                      Florida
                    </SelectItem>
                    <SelectItem value="NY" className="text-white hover:bg-neon-purple hover:text-black">
                      New York
                    </SelectItem>
                    <SelectItem value="TX" className="text-white hover:bg-neon-purple hover:text-black">
                      Texas
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="" className="text-white hover:bg-neon-purple hover:text-black">
                      All Years
                    </SelectItem>
                    <SelectItem value="2024" className="text-white hover:bg-neon-purple hover:text-black">
                      2024
                    </SelectItem>
                    <SelectItem value="2023" className="text-white hover:bg-neon-purple hover:text-black">
                      2023
                    </SelectItem>
                    <SelectItem value="2022" className="text-white hover:bg-neon-purple hover:text-black">
                      2022
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  type="submit"
                  className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                  disabled={loading}
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {summary && (
          <div className="mb-6">
            <p className="text-gray-400">
              Found {summary.count.toLocaleString()} results
              {query && ` for "${query}"`}
              {state !== "US" && ` in ${state}`}
              {year && ` from ${year}`}
            </p>
          </div>
        )}

        <div className="space-y-4">{results.map((result, index) => renderResult(result, index))}</div>

        {/* Load More */}
        {summary && page < summary.total_pages && (
          <div className="text-center mt-8">
            <Button
              onClick={loadMore}
              disabled={loading}
              className="neon-border bg-transparent text-neon-purple hover:neon-button hover:text-black"
            >
              {loading ? "Loading..." : "Load More Results"}
            </Button>
          </div>
        )}

        {/* No Results */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
