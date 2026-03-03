import { type NextRequest, NextResponse } from "next/server"
import { SearchResponse } from "@/app/interfaces"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")
  const state = searchParams.get("state") || "ALL"
  const year = searchParams.get("year") || "2"
  const page = searchParams.get("page") || "1"

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getSearch&state=${state}&query=${encodeURIComponent(
      query,
    )}&year=${year}&page=${page}`

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
          page: 1,
          total_pages: 0,
        },
      })
    }

    const searchResponse: SearchResponse = {
      results: data.searchresult.results || [],
      summary: data.searchresult.summary || {
        count: 0,
        page: 1,
        total_pages: 0,
      },
    }

    return NextResponse.json(searchResponse)
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}