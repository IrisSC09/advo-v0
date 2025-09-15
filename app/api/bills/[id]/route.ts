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
  status_date?: string
  progress?: Array<{
    date: string
    event: string
  }>
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

    // Process subjects - extract subject names from objects
    const subjects = bill.subjects
      ? Object.values(bill.subjects).map((subject: any) => subject.subject_name || subject)
      : []

    // Process progress events
    const progress = bill.progress
      ? Object.values(bill.progress).map((event: any) => ({
          date: event.date || "",
          event: event.event || "",
        }))
      : []

    return {
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || bill.summary || "No description available",
      introduced_date: bill.introduced || "2024-01-01",
      sponsor_name: bill.sponsors?.[0]?.name || "Unknown Sponsor",
      state: bill.state || "US",
      bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
      status: bill.status_desc || bill.status || "Unknown Status",
      status_date: bill.status_date || "",
      progress,
      committee: bill.committee?.name || "",
      next_action: bill.history?.[0]?.action || "",
      sponsors: bill.sponsors || [],
      subjects,
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

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action")
  const amendmentId = searchParams.get("amendment_id")
  const supplementId = searchParams.get("supplement_id")
  const rollCallId = searchParams.get("roll_call_id")

  try {
    // Await params since it's a Promise in Next.js 15
    const { id } = await params

    // Handle specific actions
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
    const bill = await fetchBillFromLegiScan(id)

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    return NextResponse.json(bill)
  } catch (error) {
    console.error("Error in bill detail API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
