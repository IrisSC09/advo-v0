import { type NextRequest, NextResponse } from "next/server"

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
  full_text?: string
  committee?: string
  next_action?: string
  sponsors?: Array<{
    people_id: number
    name: string
    first_name: string
    last_name: string
    party: string
    role: string
  }>
  subjects?: string[]
  history?: Array<{
    date: string
    action: string
    chamber: string
  }>
  votes?: Array<{
    roll_call_id: number
    date: string
    desc: string
    yea: number
    nay: number
    nv: number
    absent: number
    total: number
    passed: number
  }>
  texts?: Array<{
    doc_id: number
    type: string
    mime: string
    url: string
    state_link: string
    text_size: number
  }>
  amendments?: Array<{
    amendment_id: number
    chamber: string
    number: string
    description: string
    status: string
  }>
  supplements?: Array<{
    supplement_id: number
    type: string
    title: string
    description: string
  }>
}

async function fetchBillFromLegiScan(billId: string): Promise<BillDetail | null> {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getBill&id=${billId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()
    const bill = data.bill

    if (!bill) {
      return null
    }

    return {
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || bill.summary || "No description available",
      introduced_date: bill.introduced || "2024-01-01",
      sponsor_name: bill.sponsors?.[0]?.name || "Unknown Sponsor",
      state: bill.state || "US",
      bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
      status: bill.status_desc || "Unknown",
      party: inferPartyFromSponsor(bill.sponsors?.[0]?.name || ""),
      topic: inferTopicFromTitle(bill.title || ""),
      full_text: bill.texts?.[0]?.doc || "",
      committee: bill.committee?.name || "Unknown Committee",
      next_action: bill.history?.[0]?.action || "No upcoming actions",
      sponsors: bill.sponsors || [],
      subjects: bill.subjects || [],
      history: bill.history || [],
      votes: bill.votes || [],
      texts: bill.texts || [],
      amendments: bill.amendments || [],
      supplements: bill.supplements || [],
    }
  } catch (error) {
    console.error("Error fetching bill from LegiScan:", error)
    return null
  }
}

async function fetchBillText(docId: string): Promise<string | null> {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getBillText&id=${docId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()
    return data.text?.doc || null
  } catch (error) {
    console.error("Error fetching bill text:", error)
    return null
  }
}

async function fetchAmendment(amendmentId: string): Promise<any | null> {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getAmendment&id=${amendmentId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()
    return data.amendment || null
  } catch (error) {
    console.error("Error fetching amendment:", error)
    return null
  }
}

async function fetchSupplement(supplementId: string): Promise<any | null> {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getSupplement&id=${supplementId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()
    return data.supplement || null
  } catch (error) {
    console.error("Error fetching supplement:", error)
    return null
  }
}

async function fetchRollCall(rollCallId: string): Promise<any | null> {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getRollCall&id=${rollCallId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()
    return data.roll_call || null
  } catch (error) {
    console.error("Error fetching roll call:", error)
    return null
  }
}

function inferPartyFromSponsor(sponsorName: string): string {
  const name = sponsorName.toLowerCase()
  if (name.includes("(d-") || name.includes("democrat")) return "Democrat"
  if (name.includes("(r-") || name.includes("republican")) return "Republican"
  if (name.includes("(i-") || name.includes("independent")) return "Independent"
  return "Unknown"
}

function inferTopicFromTitle(title: string): string {
  const titleLower = title.toLowerCase()
  if (titleLower.includes("climate") || titleLower.includes("environment") || titleLower.includes("green"))
    return "Climate"
  if (titleLower.includes("immigration") || titleLower.includes("border")) return "Immigration"
  if (titleLower.includes("education") || titleLower.includes("student") || titleLower.includes("school"))
    return "Education"
  if (titleLower.includes("health") || titleLower.includes("medical")) return "Healthcare"
  if (titleLower.includes("economic") || titleLower.includes("tax") || titleLower.includes("infrastructure"))
    return "Economics"
  if (titleLower.includes("defense") || titleLower.includes("military") || titleLower.includes("security"))
    return "Defense"
  return "Other"
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action")
  const docId = searchParams.get("doc_id")
  const amendmentId = searchParams.get("amendment_id")
  const supplementId = searchParams.get("supplement_id")
  const rollCallId = searchParams.get("roll_call_id")

  try {
    // Handle specific actions
    if (action === "getBillText" && docId) {
      const text = await fetchBillText(docId)
      return NextResponse.json({ text })
    }

    if (action === "getAmendment" && amendmentId) {
      const amendment = await fetchAmendment(amendmentId)
      return NextResponse.json({ amendment })
    }

    if (action === "getSupplement" && supplementId) {
      const supplement = await fetchSupplement(supplementId)
      return NextResponse.json({ supplement })
    }

    if (action === "getRollCall" && rollCallId) {
      const rollCall = await fetchRollCall(rollCallId)
      return NextResponse.json({ rollCall })
    }

    // Default: get bill details
    const bill = await fetchBillFromLegiScan(params.id)

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    return NextResponse.json(bill)
  } catch (error) {
    console.error("Error in bill detail API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
