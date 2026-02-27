import { type NextRequest, NextResponse } from "next/server"
import { fetchBillsList, fetchBillSearch, toLegiScanShape } from "@/lib/congressGov"

interface Bill {
  bill_id: string
  title: string
  description: string
  introduced_date: string
  sponsor_name: string
  state: string
  bill_number: string
  status: string
  last_action_date?: string
  subjects?: string[]
  sponsors?: Array<{ party: string }>
}

interface BillsResponse {
  bills: Bill[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

async function fetchFromCongressGov(page: number, limit: number, query?: string): Promise<Bill[]> {
  const offset = (page - 1) * limit
  const congress = 119

  try {
    const data = query ? await fetchBillSearch(query, offset, limit) : await fetchBillsList(congress, offset, limit)
    const rawBills = data.bills || []
    return rawBills.map((b: any) => {
      const base = toLegiScanShape(b)
      base.description = b.title ? `${b.title.slice(0, 200)}...` : "No description available"
      return base
    })
  } catch (error) {
    console.error("Error fetching from Congress.gov:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const query = searchParams.get("query")
  const status = searchParams.get("status")

  try {
    let bills = await fetchFromCongressGov(page, limit, query || undefined)

    if (status && status !== "all") {
      bills = bills.filter((bill) => bill.status?.toLowerCase().includes(status.toLowerCase()))
    }

    bills.sort((a, b) => new Date(b.last_action_date || b.introduced_date).getTime() - new Date(a.last_action_date || a.introduced_date).getTime())

    return NextResponse.json({
      bills,
      total: bills.length,
      page,
      limit,
      hasMore: bills.length >= limit,
    })
  } catch (error) {
    console.error("Error in bills API:", error)
    return NextResponse.json({ bills: [], total: 0, page: 1, limit, hasMore: false })
  }
}
