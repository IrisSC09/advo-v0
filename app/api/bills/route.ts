import { type NextRequest, NextResponse } from "next/server"

interface Bill {
  bill_id: number
  title: string
  description: string
  introduced_date: string
  sponsor_name: string
  state: string
  bill_number: string
  status: string
  last_action_date?: string
  subjects?: string[]
  sponsors?: Array<{
    party: string
  }>
}

interface BillsResponse {
  bills: Bill[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

async function fetchFromLegiScan(page: number, limit: number, query?: string): Promise<Bill[]> {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    let url: string
    if (query) {
      url = `https://api.legiscan.com/?key=${apiKey}&op=search&state=US&query=${encodeURIComponent(query)}&page=${page}`
    } else {
      url = `https://api.legiscan.com/?key=${apiKey}&op=getMasterList&state=US&page=${page}`
    }

    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()

    let bills: any[] = []

    if (query && data.searchresult?.results) {
      bills = data.searchresult.results
    } else if (data.masterlist) {
      bills = Object.values(data.masterlist).filter((bill: any) => typeof bill === "object" && bill.bill_id)
    }

    if (bills.length === 0) {
      return []
    }

    // For each bill, fetch detailed information to get subjects and sponsors
    const detailedBills = await Promise.all(
      bills.slice(0, limit).map(async (bill: any) => {
        try {
          const detailUrl = `https://api.legiscan.com/?key=${apiKey}&op=getBill&id=${bill.bill_id}`
          const detailResponse = await fetch(detailUrl, { cache: "no-store" })

          if (detailResponse.ok) {
            const detailData = await detailResponse.json()
            const billDetail = detailData.bill

            // Process subjects
            const subjects = billDetail.subjects
              ? Object.values(billDetail.subjects).map((subject: any) => subject.subject_name || subject)
              : []

            // Process sponsors
            const sponsors = billDetail.sponsors
              ? Object.values(billDetail.sponsors).map((sponsor: any) => ({
                  party: sponsor.party || "Unknown",
                }))
              : []

            return {
              bill_id: bill.bill_id,
              title: bill.title || "Untitled Bill",
              description: bill.description || bill.summary || "No description available",
              introduced_date: bill.introduced || bill.last_action_date || "2024-01-01",
              last_action_date: bill.last_action_date || billDetail.history?.[0]?.date || bill.status_date || "",
              sponsor_name: billDetail.sponsors?.[0]?.name || bill.sponsor_name || "Unknown Sponsor",
              state: bill.state || "US",
              bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
              status: bill.status_desc || bill.status || "Unknown",
              subjects,
              sponsors,
            }
          }
        } catch (error) {
          console.error(`Error fetching details for bill ${bill.bill_id}:`, error)
        }

        // Fallback to basic bill data
        return {
          bill_id: bill.bill_id,
          title: bill.title || "Untitled Bill",
          description: bill.description || bill.summary || "No description available",
          introduced_date: bill.introduced || bill.last_action_date || "2024-01-01",
          last_action_date: bill.last_action_date || bill.status_date || "",
          sponsor_name: bill.sponsor_name || "Unknown Sponsor",
          state: bill.state || "US",
          bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
          status: bill.status_desc || bill.status || "Unknown",
          subjects: [],
          sponsors: [],
        }
      }),
    )

    return detailedBills.filter(Boolean)
  } catch (error) {
    console.error("Error fetching from LegiScan:", error)
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
    let bills = await fetchFromLegiScan(page, limit, query)

    // Apply filters
    if (status && status !== "all") {
      bills = bills.filter((bill) => bill.status?.toLowerCase().includes(status.toLowerCase()))
    }

    // Sort by latest bill activity so the feed surfaces the freshest updates.
    bills.sort((a, b) => {
      const aTime = new Date(a.last_action_date || a.introduced_date).getTime()
      const bTime = new Date(b.last_action_date || b.introduced_date).getTime()
      return bTime - aTime
    })

    const response: BillsResponse = {
      bills,
      total: bills.length,
      page,
      limit,
      hasMore: bills.length >= limit,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in bills API:", error)

    const response: BillsResponse = {
      bills: [],
      total: 0,
      page: 1,
      limit,
      hasMore: false,
    }

    return NextResponse.json(response)
  }
}
