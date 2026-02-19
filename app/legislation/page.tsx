"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, User, Building } from "lucide-react";
import Link from "next/link";

interface Bill {
  bill_id: number;
  bill_number: string;
  title: string;
  description: string;
  introduced_date: string;
  status: string;
  sponsor_name: string;
  sponsors?: Array<{ party: string }>;
  subjects?: string[];
  state: string;
}

interface BillsResponse {
  bills: Bill[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface SearchResult {
  bill_id: number;
  bill_number: string;
  state: string;
  title: string;
  last_action: string;
  last_action_date: string;
  sponsor_name?: string;
  description?: string;
  introduced_date?: string;
  status?: string;
  sponsors?: Array<{ party: string }>;
  subjects?: string[];
}

interface SearchResponse {
  results: SearchResult[];
  summary: { count: number; page: number; total_pages: number };
}

export default function LegislationPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(1, true);
    } else {
      fetchBills(1, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, statusFilter]);

  const fetchBills = async (pageNum: number, reset = false) => {
    setLoading(true);
    setIsSearchMode(false);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "20",
      });
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/bills?${params}`);
      const data: BillsResponse = await response.json();

      // ✅ Only federal bills
      const federalBills = data.bills.filter((bill) => bill.state === "US");

      if (reset) {
        setBills(federalBills);
        setPage(1);
      } else {
        setBills((prev) => [...prev, ...federalBills]);
      }

      setHasMore(data.hasMore);
      setTotal(federalBills.length);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (pageNum: number, reset = false) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setIsSearchMode(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        state: "US", // ✅ federal only
        page: pageNum.toString(),
      });

      const response = await fetch(`/api/search?${params}`);
      const data: SearchResponse = await response.json();

      const federalResults = data.results.filter((r) => r.state === "US");

      if (reset) {
        setSearchResults(federalResults);
        setPage(1);
      } else {
        setSearchResults((prev) => [...prev, ...federalResults]);
      }

      setHasMore(pageNum < data.summary.total_pages);
      setTotal(federalResults.length);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    isSearchMode ? performSearch(nextPage) : fetchBills(nextPage);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("recent");
  };

  const getPartyColor = (party: string) => {
    switch (party?.toLowerCase()) {
      case "democrat":
      case "d":
        return "bg-blue-500";
      case "republican":
      case "r":
        return "bg-red-500";
      case "independent":
      case "i":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const activeFiltersCount = [statusFilter].filter((f) => f !== "all").length;
  const displayItems: (SearchResult | Bill)[] = isSearchMode
    ? searchResults
    : bills;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            CURRENT{" "}
            <span className="text-neon-purple neon-glow font-extralight">
              FEDERAL LEGISLATION
            </span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed">
            Track federal bills, discover policy changes, and engage with
            legislation that matters to you.
          </p>
        </div>

        {/* Search + Filters */}
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

          {/* Status Filter */}
          <div className="flex flex-wrap gap-4 items-center">
            {!isSearchMode && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-gray-400">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="introduced">Introduced</SelectItem>
                  <SelectItem value="committee">Committee</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="enacted">Enacted</SelectItem>
                </SelectContent>
              </Select>
            )}

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
          {displayItems.map((bill) => (
            <Card
              key={bill.bill_id}
              className="bg-gray-900 border-gray-800 hover:border-advoline-orange transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {bill.sponsors?.[0]?.party && (
                      <Badge
                        className={`${getPartyColor(
                          bill.sponsors[0].party,
                        )} text-white text-xs`}
                      >
                        {bill.sponsors[0].party}
                      </Badge>
                    )}
                    {bill.subjects?.[0] && (
                      <Badge className="bg-neon-purple text-white text-xs">
                        {bill.subjects[0]}
                      </Badge>
                    )}
                  </div>
                  <Badge className="bg-gray-700 text-gray-300 text-xs">
                    {bill.status ?? "N/A"}
                  </Badge>
                </div>
                <CardTitle className="text-white text-lg font-bold leading-tight">
                  <Link
                    href={`/bill/${bill.bill_id}`}
                    className="hover:text-advoline-orange transition-colors"
                  >
                    {bill.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-4 mb-3 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{bill.bill_number}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{bill.introduced_date}</span>
                  </div>
                </div>

                {bill.sponsor_name &&
                  bill.sponsor_name !== "Unknown Sponsor" && (
                    <div className="flex items-center gap-1 mb-3 text-gray-400 text-sm">
                      <User className="h-3 w-3" />
                      <span>Sponsored by {bill.sponsor_name}</span>
                    </div>
                  )}

                <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                  {bill.description
                    ? bill.description.substring(0, 150)
                    : "No description available."}
                  ...
                </p>

                <div className="flex justify-end">
                  <Link href={`/bill/${bill.bill_id}`}>
                    <Button
                      size="sm"
                      className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                    >
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
        {!loading && displayItems.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No bills found
            </h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
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
  );
}
