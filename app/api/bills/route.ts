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
  party?: string
  topic?: string
  engagement?: number
  threads?: number
}

interface BillsResponse {
  bills: Bill[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Mock data as fallback
const mockBills: Bill[] = [
  {
    bill_id: 1,
    title: "Climate Action and Green Jobs Act",
    description:
      "Comprehensive legislation to address climate change through job creation in renewable energy sectors and carbon reduction targets.",
    introduced_date: "2024-01-15",
    sponsor_name: "Rep. Alexandria Ocasio-Cortez",
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
    sponsor_name: "Sen. Ted Cruz",
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
    sponsor_name: "Sen. Bernie Sanders",
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
    sponsor_name: "Sen. Susan Collins",
    state: "US",
    bill_number: "S-2024-023",
    status: "Committee Review",
    party: "Republican",
    topic: "Healthcare",
    engagement: 634,
    threads: 12,
  },
  {
    bill_id: 5,
    title: "Infrastructure Investment and Jobs Act Extension",
    description:
      "Extension of federal infrastructure spending with focus on broadband expansion and electric vehicle charging networks.",
    introduced_date: "2024-01-05",
    sponsor_name: "Rep. Pete Buttigieg",
    state: "US",
    bill_number: "HR-2024-089",
    status: "Passed House",
    party: "Democrat",
    topic: "Economics",
    engagement: 1543,
    threads: 27,
  },
]

function inferPartyFromSponsor(sponsorName: string): string {
  const name = sponsorName.toLowerCase()
  if (name.includes("(d-") || name.includes("democrat")) return "Democrat"
  if (name.includes("(r-") || name.includes("republican")) return "Republican"
  if (name.includes("(i-") || name.includes("independent")) return "Independent"

  // Infer from common names/patterns
  if (name.includes("ocasio-cortez") || name.includes("sanders") || name.includes("warren") || name.includes("biden"))
    return "Democrat"
  if (name.includes("cruz") || name.includes("trump") || name.includes("mcconnell") || name.includes("graham"))
    return "Republican"

  return "Unknown"
}

function inferTopicFromTitle(title: string): string {
  const titleLower = title.toLowerCase()
  if (
    titleLower.includes("climate") ||
    titleLower.includes("environment") ||
    titleLower.includes("green") ||
    titleLower.includes("carbon")
  )
    return "Climate"
  if (
    titleLower.includes("immigration") ||
    titleLower.includes("border") ||
    titleLower.includes("visa") ||
    titleLower.includes("refugee")
  )
    return "Immigration"
  if (
    titleLower.includes("education") ||
    titleLower.includes("student") ||
    titleLower.includes("school") ||
    titleLower.includes("college")
  )
    return "Education"
  if (
    titleLower.includes("health") ||
    titleLower.includes("medical") ||
    titleLower.includes("medicare") ||
    titleLower.includes("medicaid")
  )
    return "Healthcare"
  if (
    titleLower.includes("economic") ||
    titleLower.includes("tax") ||
    titleLower.includes("budget") ||
    titleLower.includes("finance") ||
    titleLower.includes("infrastructure")
  )
    return "Economics"
  if (
    titleLower.includes("defense") ||
    titleLower.includes("military") ||
    titleLower.includes("security") ||
    titleLower.includes("veteran")
  )
    return "Defense"
  return "Other"
}

async function fetchFromLegiScan(page: number, limit: number, query?: string): Promise<Bill[]> {
  const apiKey = process.env.LEGISCAN_API_KEY

  if (!apiKey) {
    console.log("No LegiScan API key found, using mock data")
    return mockBills
  }

  try {
    let url: string
    if (query) {
      url = `https://api.legiscan.com/?key=${apiKey}&op=search&state=US&query=${encodeURIComponent(query)}&page=${page}`
    } else {
      url = `https://api.legiscan.com/?key=${apiKey}&op=getMasterList&state=US&page=${page}`
    }

    const response = await fetch(url)
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
      console.log("No bills returned from LegiScan, using mock data")
      return mockBills
    }

    return bills.slice(0, limit).map((bill: any) => ({
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || bill.summary || "No description available",
      introduced_date: bill.introduced || bill.last_action_date || "2024-01-01",
      sponsor_name: bill.sponsors?.[0]?.name || bill.sponsor_name || "Unknown Sponsor",
      state: bill.state || "US",
      bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
      status: bill.status_desc || bill.status || "Unknown",
      party: inferPartyFromSponsor(bill.sponsors?.[0]?.name || bill.sponsor_name || ""),
      topic: inferTopicFromTitle(bill.title || ""),
      engagement: Math.floor(Math.random() * 2000) + 100,
      threads: Math.floor(Math.random() * 50) + 1,
    }))
  } catch (error) {
    console.error("Error fetching from LegiScan:", error)
    console.log("Falling back to mock data")
    return mockBills
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const query = searchParams.get("query")
  const party = searchParams.get("party")
  const topic = searchParams.get("topic")
  const status = searchParams.get("status")

  try {
    let bills = await fetchFromLegiScan(page, 100, query) // Fetch up to 100 bills

    // Apply filters
    if (party && party !== "all") {
      bills = bills.filter((bill) => bill.party?.toLowerCase() === party.toLowerCase())
    }

    if (topic && topic !== "all") {
      bills = bills.filter((bill) => bill.topic?.toLowerCase() === topic.toLowerCase())
    }

    if (status && status !== "all") {
      bills = bills.filter((bill) => bill.status?.toLowerCase().includes(status.toLowerCase()))
    }

    // Sort by introduction date (most recent first)
    bills.sort((a, b) => new Date(b.introduced_date).getTime() - new Date(a.introduced_date).getTime())

    // Paginate results
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedBills = bills.slice(startIndex, endIndex)

    const response: BillsResponse = {
      bills: paginatedBills,
      total: bills.length,
      page,
      limit,
      hasMore: endIndex < bills.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in bills API:", error)

    // Return mock data as fallback
    const response: BillsResponse = {
      bills: mockBills.slice(0, limit),
      total: mockBills.length,
      page: 1,
      limit,
      hasMore: false,
    }

    return NextResponse.json(response)
  }
}
