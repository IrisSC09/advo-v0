"use client";

import { useEffect, useState } from "react";
import { Bill, fetchBills, searchBills } from "@/lib/congressData";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BillsFeed() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<{ status?: string }>({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadBills(1, true);
  }, []);

  async function loadBills(pageNum: number, reset = false) {
    setLoading(true);
    let data: Bill[];
    if (query) {
      data = await searchBills(query, pageNum, reset ? 100 : 20);
    } else {
      // Default: show top 100 bills on first load
      data = await fetchBills(pageNum, reset ? 100 : 20);
    }

    if (reset) setBills(data);
    else setBills((prev) => [...prev, ...data]);
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadBills(1, true);
  }

  const filteredBills = bills.filter((bill) => {
    if (filters.status && bill.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search bills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Filters */}
      <div className="flex gap-2">
        <Badge
          onClick={() =>
            setFilters(filters.status === "Passed" ? {} : { status: "Passed" })
          }
          className={`cursor-pointer ${
            filters.status === "Passed" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Passed
        </Badge>
        <Badge
          onClick={() =>
            setFilters(
              filters.status === "Introduced" ? {} : { status: "Introduced" }
            )
          }
          className={`cursor-pointer ${
            filters.status === "Introduced" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Introduced
        </Badge>
      </div>

      {/* Bills list */}
      <div className="max-h-[700px] overflow-y-auto space-y-3">
        {filteredBills.length > 0 ? (
          filteredBills.map((bill) => (
            <Card key={bill.bill_id}>
              <CardContent className="p-4">
                <h3 className="font-semibold">
                  {bill.bill_number}: {bill.title}
                </h3>
                <p className="text-sm text-gray-500">{bill.description}</p>
                <p className="text-xs mt-2">
                  <strong>Status:</strong> {bill.status} |{" "}
                  <strong>Introduced:</strong> {bill.introduced_date}
                </p>
                <p className="text-xs">
                  <strong>Sponsor:</strong> {bill.sponsor_name}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No bills match your filters.</p>
        )}
      </div>

      {/* Load More */}
      {!query && filteredBills.length >= 20 && (
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setPage((p) => p + 1);
              loadBills(page + 1);
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
