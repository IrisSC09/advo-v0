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
    name: string
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
    description: string
    chamber: string
    yea: number
    nay: number
    nv: number
    absent: number
    total: number
    passed: boolean
  }>
  texts?: Array<{
    doc_id: number
    type: string
    mime: string
    url: string
    date: string
  }>
  amendments?: Array<{
    amendment_id: number
    title: string
    description: string
    adopted: boolean
  }>
  supplements?: Array<{
    supplement_id: number
    title: string
    type: string
    date: string
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

    // Process sponsors
    const sponsors = bill.sponsors
      ? Object.values(bill.sponsors).map((sponsor: any) => ({
          name: sponsor.name || "Unknown",
          party: sponsor.party || "Unknown",
          role: sponsor.role || "Sponsor",
        }))
      : []

    // Process history
    const history = bill.history
      ? Object.values(bill.history).map((item: any) => ({
          date: item.date || "",
          action: item.action || "",
          chamber: item.chamber || "",
        }))
      : []

    // Process votes
    const votes = bill.votes
      ? Object.values(bill.votes).map((vote: any) => ({
          roll_call_id: vote.roll_call_id || 0,
          date: vote.date || "",
          description: vote.desc || "",
          chamber: vote.chamber || "",
          yea: vote.yea || 0,
          nay: vote.nay || 0,
          nv: vote.nv || 0,
          absent: vote.absent || 0,
          total: vote.total || 0,
          passed: vote.passed === 1,
        }))
      : []

    // Process texts
    const texts = bill.texts
      ? Object.values(bill.texts).map((text: any) => ({
          doc_id: text.doc_id || 0,
          type: text.type || "",
          mime: text.mime || "",
          url: text.url || "",
          date: text.date || "",
        }))
      : []

    // Process amendments
    const amendments = bill.amendments
      ? Object.values(bill.amendments).map((amendment: any) => ({
          amendment_id: amendment.amendment_id || 0,
          title: amendment.title || "",
          description: amendment.description || "",
          adopted: amendment.adopted === 1,
        }))
      : []

    // Process supplements
    const supplements = bill.supplements
      ? Object.values(bill.supplements).map((supplement: any) => ({
          supplement_id: supplement.supplement_id || 0,
          title: supplement.title || "",
          type: supplement.type || "",
          date: supplement.date || "",
        }))
      : []

    return {
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || bill.summary || "No description available",
      introduced_date: bill.introduced || "2024-01-01",
      sponsor_name: sponsors[0]?.name || "Unknown Sponsor",
      state: bill.state || "US",
      bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
      status: bill.status_desc || "Unknown",
      party: sponsors[0]?.party || inferPartyFromSponsor(sponsors[0]?.name || ""),
      topic: inferTopicFromTitle(bill.title || ""),
      full_text: texts[0]?.url || "",
      committee: bill.committee?.name || "Unknown Committee",
      next_action: history[0]?.action || "No upcoming actions",
      sponsors,
      subjects: bill.subjects ? Object.values(bill.subjects).map((s: any) => s.subject_name) : [],
      history,
      votes,
      texts,
      amendments,
      supplements,
    }
  } catch (error) {
    console.error("Error fetching bill from LegiScan:", error)
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
  try {
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
