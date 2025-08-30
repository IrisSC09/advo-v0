import { type NextRequest, NextResponse } from "next/server"
import { generateBillSummary } from "@/lib/ai"

interface BillDetail {
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
  full_text?: string
  committee?: string
  next_action?: string
  ai_summary?: {
    summary: string
    keyPoints: string[]
    impact: string
    controversialAspects: string
  }
}

// Mock bill details
const mockBillDetails: Record<string, BillDetail> = {
  "1": {
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
    full_text:
      "A comprehensive bill to address climate change through massive investment in renewable energy infrastructure, creation of green jobs, and establishment of ambitious carbon reduction targets. This legislation proposes a $500 billion investment over 5 years to transition the United States to a clean energy economy while ensuring no worker is left behind in the transition.",
    committee: "House Committee on Energy and Commerce",
    next_action: "Committee markup scheduled for January 25, 2024",
  },
  "hr-2024-001": {
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
    full_text:
      "A comprehensive bill to address climate change through massive investment in renewable energy infrastructure, creation of green jobs, and establishment of ambitious carbon reduction targets. This legislation proposes a $500 billion investment over 5 years to transition the United States to a clean energy economy while ensuring no worker is left behind in the transition.",
    committee: "House Committee on Energy and Commerce",
    next_action: "Committee markup scheduled for January 25, 2024",
  },
}

async function fetchBillFromLegiScan(billId: string): Promise<BillDetail | null> {
  const apiKey = process.env.LEGISCAN_API_KEY

  if (!apiKey) {
    console.log("No LegiScan API key found, using mock data")
    return mockBillDetails[billId] || null
  }

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getBill&id=${billId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.bill) {
      return mockBillDetails[billId] || null
    }

    const bill = data.bill

    return {
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || bill.summary || "No description available",
      introduced_date: bill.introduced || "2024-01-01",
      sponsor_name: bill.sponsors?.[0]?.name || "Unknown Sponsor",
      state: bill.state || "US",
      bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
      status: bill.status_desc || bill.status || "Unknown",
      party: bill.sponsors?.[0]?.party || "Unknown",
      topic: inferTopicFromTitle(bill.title || ""),
      engagement: Math.floor(Math.random() * 2000) + 100,
      threads: Math.floor(Math.random() * 50) + 1,
      full_text: bill.text || bill.description || "Full text not available",
      committee: bill.committee || "Unknown Committee",
      next_action: bill.next_action || "No scheduled action",
    }
  } catch (error) {
    console.error("Error fetching bill from LegiScan:", error)
    return mockBillDetails[billId] || null
  }
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const billId = params.id

  try {
    const bill = await fetchBillFromLegiScan(billId)

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    // Generate AI summary if we have the full text
    if (bill.full_text && !bill.ai_summary) {
      try {
        const aiSummary = await generateBillSummary(bill.full_text, bill.title)
        if (aiSummary) {
          bill.ai_summary = aiSummary
        }
      } catch (error) {
        console.error("Error generating AI summary:", error)
      }
    }

    return NextResponse.json(bill)
  } catch (error) {
    console.error("Error in bill detail API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
