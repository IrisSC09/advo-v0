import { type NextRequest, NextResponse } from "next/server"

export interface Bill {
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

const LEGISCAN_API_KEY = process.env.LEGISCAN_API_KEY
const BASE_URL = `https://api.legiscan.com/?key=${LEGISCAN_API_KEY}`

// Mock data as fallback if API fails
const mockBills: Bill[] = [
  {
    bill_id: 1,
    title: "Climate Action and Green Jobs Act",
    description:
      "Comprehensive legislation to address climate change through job creation in renewable energy sectors and carbon reduction targets.",
    introduced_date: "2024-01-15",
    sponsor_name: "Rep. Alexandria Ocasio-Cortez (D-NY)",
    state: "US",
    bill_number: "HR-2024-001",
    status: "Committee Review",
    party: "Democrat",
    topic: "Climate",
    engagement: 1247,
    threads: 23,
  },
  {
    bill_id: 2,
    title: "Border Security Enhancement Act",
    description:
      "Legislation to strengthen border security through increased funding for border patrol and enhanced screening technologies.",
    introduced_date: "2024-01-12",
    sponsor_name: "Sen. Ted Cruz (R-TX)",
    state: "US",
    bill_number: "S-2024-045",
    status: "Floor Vote Pending",
    party: "Republican",
    topic: "Immigration",
    engagement: 892,
    threads: 18,
  },
  {
    bill_id: 3,
    title: "Student Debt Relief and Education Reform Act",
    description:
      "Comprehensive student debt forgiveness program coupled with free community college and trade school access.",
    introduced_date: "2024-01-10",
    sponsor_name: "Rep. Bernie Sanders (I-VT)",
    state: "US",
    bill_number: "HR-2024-078",
    status: "Introduced",
    party: "Independent",
    topic: "Education",
    engagement: 2156,
    threads: 31,
  },
  {
    bill_id: 4,
    title: "Healthcare Price Transparency Act",
    description:
      "Requires healthcare providers and insurers to disclose pricing information to improve market transparency.",
    introduced_date: "2024-01-08",
    sponsor_name: "Sen. Susan Collins (R-ME)",
    state: "US",
    bill_number: "S-2024-023",
    status: "Committee Review",
    party: "Republican",
    topic: "Healthcare",
    engagement: 634,
    threads: 12,
  },
]

function inferPartyFromSponsor(sponsor: string): string {
  if (sponsor.includes("(D-")) return "Democrat"
  if (sponsor.includes("(R-")) return "Republican"
  if (sponsor.includes("(I-")) return "Independent"
  return "Unknown"
}

function inferTopicFromTitle(title: string): string {
  const titleLower = title.toLowerCase()
  if (titleLower.includes("climate") || titleLower.includes("environment") || titleLower.includes("green"))
    return "Climate"
  if (titleLower.includes("immigration") || titleLower.includes("border")) return "Immigration"
  if (titleLower.includes("education") || titleLower.includes("student")) return "Education"
  if (titleLower.includes("healthcare") || titleLower.includes("health")) return "Healthcare"
  if (titleLower.includes("tax") || titleLower.includes("economic")) return "Economics"
  if (titleLower.includes("defense") || titleLower.includes("military")) return "Defense"
  return "Other"
}

async function fetchFromLegiScan(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}&${endpoint}`, {
      headers: {
        "User-Agent": "Advoline-Platform/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("LegiScan API error:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const party = searchParams.get("party")
  const topic = searchParams.get("topic")
  const status = searchParams.get("status")

  try {
    let bills: Bill[] = []

    if (!LEGISCAN_API_KEY) {
      console.warn("LEGISCAN_API_KEY not found, using mock data")
      bills = mockBills
    } else {
      // Try to fetch from LegiScan API
      let apiData = null

      if (query) {
        // Search for bills
        apiData = await fetchFromLegiScan(`op=search&state=US&query=${encodeURIComponent(query)}`)
      } else {
        // Get master list
        apiData = await fetchFromLegiScan(`op=getMasterList&state=US`)
      }

      if (apiData && apiData.masterlist) {
        // Convert masterlist object to array
        const billsArray = Object.values(apiData.masterlist).filter(
          (bill: any) => typeof bill === "object" && bill.bill_id,
        ) as any[]

        bills = billsArray.map((bill: any) => ({
          bill_id: bill.bill_id,
          title: bill.title || "Untitled Bill",
          description: bill.description || bill.title || "No description available",
          introduced_date: bill.introduced || new Date().toISOString().split("T")[0],
          sponsor_name: bill.sponsors?.[0]?.name || "Unknown Sponsor",
          state: bill.state || "US",
          bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
          status: bill.status_desc || bill.status || "Unknown",
          party: inferPartyFromSponsor(bill.sponsors?.[0]?.name || ""),
          topic: inferTopicFromTitle(bill.title || ""),
          engagement: Math.floor(Math.random() * 2000) + 100,
          threads: Math.floor(Math.random() * 50) + 1,
        }))
      } else if (apiData && apiData.searchresult && apiData.searchresult.results) {
        // Handle search results
        bills = apiData.searchresult.results.map((bill: any) => ({
          bill_id: bill.bill_id,
          title: bill.title || "Untitled Bill",
          description: bill.description || bill.title || "No description available",
          introduced_date: bill.introduced || new Date().toISOString().split("T")[0],
          sponsor_name: bill.sponsor_name || "Unknown Sponsor",
          state: bill.state || "US",
          bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
          status: bill.status_desc || bill.status || "Unknown",
          party: inferPartyFromSponsor(bill.sponsor_name || ""),
          topic: inferTopicFromTitle(bill.title || ""),
          engagement: Math.floor(Math.random() * 2000) + 100,
          threads: Math.floor(Math.random() * 50) + 1,
        }))
      } else {
        console.warn("No data from LegiScan API, using mock data")
        bills = mockBills
      }
    }

    // Apply filters
    let filteredBills = bills

    if (party && party !== "all") {
      filteredBills = filteredBills.filter((bill) => bill.party?.toLowerCase() === party.toLowerCase())
    }

    if (topic && topic !== "all") {
      filteredBills = filteredBills.filter((bill) => bill.topic?.toLowerCase() === topic.toLowerCase())
    }

    if (status && status !== "all") {
      filteredBills = filteredBills.filter((bill) => bill.status?.toLowerCase().includes(status.toLowerCase()))
    }

    // Sort by introduced date (most recent first)
    filteredBills.sort((a, b) => new Date(b.introduced_date).getTime() - new Date(a.introduced_date).getTime())

    // Pagination
    const startIndex = (page - 1) * limit
    const paginatedBills = filteredBills.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      bills: paginatedBills,
      total: filteredBills.length,
      page,
      limit,
      hasMore: startIndex + limit < filteredBills.length,
    })
  } catch (error) {
    console.error("Error fetching bills:", error)

    // Return mock data as fallback
    return NextResponse.json({
      bills: mockBills,
      total: mockBills.length,
      page: 1,
      limit,
      hasMore: false,
    })
  }
}
