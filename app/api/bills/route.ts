import { type NextRequest, NextResponse } from "next/server"
import { BillDetail, BillsResponse } from "@/app/interfaces"

const API_KEY = "d0db0d79caefbd288452efcea05eca71"

async function fetchFromLegiScan(page: number, limit: number, query?: string): Promise<BillDetail[]> {
  try {
    let url: string
    if (query) {
      url = `https://api.legiscan.com/?key=${API_KEY}&op=search&state=US&query=${encodeURIComponent(query)}&page=${page}`
    } else {
      url = `https://api.legiscan.com/?key=${API_KEY}&op=getMasterList&state=US&page=${page}`
    }

    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) throw new Error(`LegiScan API error: ${response.status}`)

    const data = await response.json()
    let bills: any[] = []

    if (query && data.searchresult?.results) {
      bills = data.searchresult.results
    } else if (data.masterlist) {
      bills = Object.values(data.masterlist).filter((bill: any) => typeof bill === "object" && bill.bill_id)
    }

    if (bills.length === 0) return []

    bills.sort((a: any, b: any) => {
      const aTime = new Date(a.last_action_date || a.status_date || a.introduced || 0).getTime()
      const bTime = new Date(b.last_action_date || b.status_date || b.introduced || 0).getTime()
      return bTime - aTime
    })

    return bills.slice(0, limit).map((bill: any) => ({
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || bill.summary || "No description available",
      introduced_date: bill.introduced || bill.last_action_date || "2024-01-01",
      last_action_date: bill.last_action_date || bill.status_date || "",
      status_date: bill.status_date || "",
      sponsor_name: bill.sponsor_name || "Unknown Sponsor",
      state: bill.state || "US",
      bill_number: bill.bill_number || bill.number || `BILL-${bill.bill_id}`,
      status: bill.status_desc || bill.status || "Unknown",
      progress: [],
      committee: "",
      next_action: "",
      sponsors: [],
      subjects: [],
      history: [],
      votes: [],
      texts: [],
      amendments: [],
      supplements: [],
    }))
  } catch (error) {
    console.error("Error fetching from LegiScan:", error)
    return []
  }
}

async function fetchBillFromLegiScan(billId: string): Promise<BillDetail | null> {
  try {
    const url = `https://api.legiscan.com/?key=${API_KEY}&op=getBill&id=${billId}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`LegiScan API error: ${response.status}`)

    const data = await response.json()
    const bill = data.bill
    if (!bill) return null

    const subjects = bill.subjects
      ? Object.values(bill.subjects).map((subject: any) => subject.subject_name || subject)
      : []

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
      last_action_date: bill.last_action_date || bill.status_date || "",
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
  try {
    const url = `https://api.legiscan.com/?key=${API_KEY}&op=getAmendment&id=${amendmentId}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`LegiScan API error: ${response.status}`)
    return (await response.json()).amendment || null
  } catch (error) {
    console.error("Error fetching amendment:", error)
    return null
  }
}

async function fetchSupplement(supplementId: string): Promise<any | null> {
  try {
    const url = `https://api.legiscan.com/?key=${API_KEY}&op=getSupplement&id=${supplementId}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`LegiScan API error: ${response.status}`)
    return (await response.json()).supplement || null
  } catch (error) {
    console.error("Error fetching supplement:", error)
    return null
  }
}

async function fetchRollCall(rollCallId: string): Promise<any | null> {
  try {
    const url = `https://api.legiscan.com/?key=${API_KEY}&op=getRollCall&id=${rollCallId}`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`LegiScan API error: ${response.status}`)
    return (await response.json()).roll_call || null
  } catch (error) {
    console.error("Error fetching roll call:", error)
    return null
  }
}

export async function GET(request: NextRequest, { params }: { params?: { id?: string } } = {}) {
  const searchParams = request.nextUrl.searchParams
  const billId = params?.id
  const action = searchParams.get("action")
  const amendmentId = searchParams.get("amendment_id")
  const supplementId = searchParams.get("supplement_id")
  const rollCallId = searchParams.get("roll_call_id")

  try {
    // Sub-resource actions
    if (action === "getAmendment" && amendmentId) {
      return NextResponse.json({ amendment: await fetchAmendment(amendmentId) })
    }
    if (action === "getSupplement" && supplementId) {
      return NextResponse.json({ supplement: await fetchSupplement(supplementId) })
    }
    if (action === "getRollCall" && rollCallId) {
      return NextResponse.json({ rollCall: await fetchRollCall(rollCallId) })
    }

    // Single bill detail
    if (billId) {
      const bill = await fetchBillFromLegiScan(billId)
      if (!bill) return NextResponse.json({ error: "Bill not found" }, { status: 404 })
      return NextResponse.json(bill)
    }

    // Bill list with search, filtering, and pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const query = searchParams.get("query")
    const status = searchParams.get("status")

    let bills = await fetchFromLegiScan(page, limit, query || undefined)

    if (status && status !== "all") {
      const normalized = status.toLowerCase()
      bills = bills.filter((bill) => {
        const s = String(bill.status || "").toLowerCase()
        if (normalized === "introduced") return s.includes("intro")
        if (normalized === "committee") return s.includes("committee")
        if (normalized === "passed") return s.includes("pass")
        if (normalized === "enacted") return s.includes("enact") || s.includes("public law")
        return s.includes(normalized)
      })
    }

    bills.sort((a, b) => {
      const aTime = new Date(a.last_action_date || a.introduced_date).getTime()
      const bTime = new Date(b.last_action_date || b.introduced_date).getTime()
      return bTime - aTime
    })

    return NextResponse.json({
      bills,
      total: bills.length,
      page,
      limit,
      hasMore: bills.length >= limit,
    } as BillsResponse)
  } catch (error) {
    console.error("Error in bills API:", error)
    return NextResponse.json(
      { bills: [], total: 0, page: 1, limit: 20, hasMore: false } as BillsResponse,
      { status: 500 }
    )
  }
}