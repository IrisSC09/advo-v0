import { type NextRequest, NextResponse } from "next/server"

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const state = searchParams.get("state") || "US"
  const year = searchParams.get("year")
  const page = searchParams.get("page") || "1"

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    let url = `https://api.legiscan.com/?key=${apiKey}&op=getSearch&state=${state}&query=${encodeURIComponent(query)}&page=${page}`

    if (year) {
      url += `&year=${year}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.searchresult) {
      return NextResponse.json({
        results: [],
        summary: {
          count: 0,
          page: Number.parseInt(page),
          total_pages: 0,
        },
      })
    }

    const searchResult = data.searchresult
    const results: SearchResult[] = []

    // Process different types of search results
    if (searchResult.results) {
      Object.values(searchResult.results).forEach((item: any) => {
        const result: SearchResult = {
          relevance: item.relevance || 0,
        }

        // Bill results
        if (item.bill_id) {
          result.bill = {
            bill_id: item.bill_id,
            title: item.title || "",
            description: item.description || "",
            bill_number: item.bill_number || "",
            status: item.status || "",
            last_action_date: item.last_action_date || "",
            url: item.url || "",
          }
        }

        // Text results
        if (item.doc_id) {
          result.text = {
            doc_id: item.doc_id,
            bill_id: item.bill_id || 0,
            type: item.type || "",
            title: item.title || "",
            date: item.date || "",
            url: item.url || "",
          }
        }

        // Amendment results
        if (item.amendment_id) {
          result.amendment = {
            amendment_id: item.amendment_id,
            bill_id: item.bill_id || 0,
            title: item.title || "",
            description: item.description || "",
            date: item.date || "",
            adopted: item.adopted === 1,
          }
        }

        // Supplement results
        if (item.supplement_id) {
          result.supplement = {
            supplement_id: item.supplement_id,
            bill_id: item.bill_id || 0,
            title: item.title || "",
            type: item.type || "",
            date: item.date || "",
          }
        }

        // Roll call results
        if (item.roll_call_id) {
          result.roll_call = {
            roll_call_id: item.roll_call_id,
            bill_id: item.bill_id || 0,
            date: item.date || "",
            description: item.desc || "",
            yea: item.yea || 0,
            nay: item.nay || 0,
            passed: item.passed === 1,
          }
        }

        results.push(result)
      })
    }

    return NextResponse.json({
      results,
      summary: {
        count: searchResult.summary?.count || 0,
        page: Number.parseInt(page),
        total_pages: Math.ceil((searchResult.summary?.count || 0) / 50), // LegiScan returns 50 results per page
      },
    })
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
