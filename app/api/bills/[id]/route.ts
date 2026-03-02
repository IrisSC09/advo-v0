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

    const sponsors = Array.isArray(bill.sponsors) ? bill.sponsors : Object.values(bill.sponsors || {})
    const history = Array.isArray(bill.history) ? bill.history : Object.values(bill.history || {})
    const rawVotes = Array.isArray(bill.votes) ? bill.votes : Object.values(bill.votes || {})
    const texts = Array.isArray(bill.texts) ? bill.texts : Object.values(bill.texts || {})
    const amendments = Array.isArray(bill.amendments) ? bill.amendments : Object.values(bill.amendments || {})
    const supplements = Array.isArray(bill.supplements) ? bill.supplements : Object.values(bill.supplements || {})

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

    const votes = await Promise.all(
      (rawVotes as any[]).map(async (v: any) => {
        const base = {
          roll_call_id: v.roll_call_id || v.id || 0,
          date: v.date || v.vote_date || bill.status_date || bill.introduced || "",
          desc: v.desc || v.motion || v.description || "Roll call vote",
          yea: Number(v.yea ?? v.total_yea ?? 0),
          nay: Number(v.nay ?? v.total_nay ?? 0),
          nv: Number(v.nv ?? v.total_nv ?? 0),
          absent: Number(v.absent ?? v.total_absent ?? 0),
          total: Number(v.total ?? v.total_vote ?? ((v.total_yea || 0) + (v.total_nay || 0) + (v.total_nv || 0) + (v.total_absent || 0))),
          passed: Number(v.passed ?? v.pass ?? 0),
          vote_url: v.url || "",
        }
        if (base.yea || base.nay || base.nv || base.absent) return base
        if (base.roll_call_id) {
          const rc = await fetchRollCall(String(base.roll_call_id))
          if (rc) {
            return {
              ...base,
              date: rc.date || base.date,
              desc: rc.desc || base.desc,
              yea: Number(rc.yea ?? rc.total_yea ?? 0),
              nay: Number(rc.nay ?? rc.total_nay ?? 0),
              nv: Number(rc.nv ?? rc.total_nv ?? 0),
              absent: Number(rc.absent ?? rc.total_absent ?? 0),
              total: Number(rc.total ?? rc.total_vote ?? 0),
              passed: Number(rc.passed ?? rc.pass ?? 0),
              vote_url: rc.url || base.vote_url,
            }
          }
        }
        return base
      }),
    )

    return {
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || bill.summary || "No description available",
      introduced_date: bill.introduced || "2024-01-01",
      sponsor_name: (sponsors as any[])?.[0]?.name || "Unknown Sponsor",
      state: bill.state || "US",
      bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
      status: bill.status_desc || bill.status || "Unknown Status",
      status_date: bill.status_date || "",
      progress,
      committee: bill.committee?.name || "",
      next_action: (history as any[])?.[0]?.action || "",
      sponsors: sponsors || [],
      subjects,
      history: history || [],
      votes: (votes || []).filter((v: any) => v.roll_call_id || v.desc),
      texts: texts || [],
      amendments: amendments || [],
      supplements: supplements || [],
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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get("action")
  const amendmentId = searchParams.get("amendment_id")
  const supplementId = searchParams.get("supplement_id")
  const rollCallId = searchParams.get("roll_call_id")

  try {
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
    const {id}=await params
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