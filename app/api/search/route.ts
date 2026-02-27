import { type NextRequest, NextResponse } from "next/server"
import { fetchBillSearch, toLegiScanShape } from "@/lib/congressGov"

interface SearchResult {
  bill_id: string
  bill_number: string
  state: string
  title: string
  last_action: string
  last_action_date: string
  sponsor_name?: string
  description?: string
  introduced_date?: string
  status?: string
  sponsors?: Array<{ party: string }>
  subjects?: string[]
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")
  const page = Number.parseInt(request.nextUrl.searchParams.get("page") || "1")
  const limit = 20
  const offset = (page - 1) * limit

  if (!query?.trim()) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const data = await fetchBillSearch(query, offset, limit)
    const rawBills = data.bills || []
    const pagination = data.pagination || {}
    const total = pagination.count ?? rawBills.length

    const results: SearchResult[] = rawBills.map((b: any) => {
      const base = toLegiScanShape(b)
      return {
        ...base,
        last_action: b.latestAction?.text || "",
        last_action_date: b.latestAction?.actionDate || b.updateDate || "",
        description: b.title,
      }
    })

    return NextResponse.json({
      results,
      summary: {
        count: results.length,
        page,
        total_pages: Math.ceil(total / limit) || 1,
      },
    })
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({
      results: [],
      summary: { count: 0, page: 1, total_pages: 0 },
    })
  }
}
