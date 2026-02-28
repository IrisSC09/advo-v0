import { type NextRequest, NextResponse } from "next/server"
import { fetchBillDetail, parseBillId } from "@/lib/congressGov"

const API_KEY = "mzTlfYrC5xObWKWxJQKgrLNxlJc3KEuTRrYp57qR"

async function fetchSubResource(path: string): Promise<any> {
  const sep = path.includes("?") ? "&" : "?"
  const res = await fetch(`${path}${sep}api_key=${API_KEY}`, { cache: "no-store" })
  return res.ok ? res.json() : null
}

// Parse "225 - 204" or "Passed by Yeas and Nays: 225 - 204" from action text
function parseVoteCounts(text: string): { yea: number; nay: number; passed?: boolean } {
  const m = text.match(/(\d+)\s*[-–]\s*(\d+)/)
  if (!m) return { yea: 0, nay: 0 }
  const yea = parseInt(m[1], 10)
  const nay = parseInt(m[2], 10)
  const passed = text.toLowerCase().includes("passed")
  return { yea, nay, passed }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const parsed = parseBillId(id)

  if (!parsed) {
    return NextResponse.json({ error: "Bill not found" }, { status: 404 })
  }

  try {
    const bill = await fetchBillDetail(parsed.congress, parsed.type, parsed.number)
    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    const fetchPromises: Promise<any>[] = []
    if (bill.summaries?.url) fetchPromises.push(fetchSubResource(bill.summaries.url))
    else fetchPromises.push(Promise.resolve(null))
    if (bill.actions?.url) fetchPromises.push(fetchSubResource(bill.actions.url))
    else fetchPromises.push(Promise.resolve(null))
    if (bill.subjects?.url) fetchPromises.push(fetchSubResource(bill.subjects.url))
    else fetchPromises.push(Promise.resolve(null))
    if (bill.textVersions?.url) fetchPromises.push(fetchSubResource(bill.textVersions.url))
    else fetchPromises.push(Promise.resolve(null))
    if (bill.amendments?.url) fetchPromises.push(fetchSubResource(bill.amendments.url))
    else fetchPromises.push(Promise.resolve(null))

    const [summariesRes, actionsRes, subjectsRes, textRes, amendmentsRes] = await Promise.all(fetchPromises)

    const description = summariesRes?.summaries?.[0]?.text?.replace(/<[^>]+>/g, " ").trim().slice(0, 2000) || bill.title || "No description"
    const subjects = subjectsRes?.subjects?.legislativeSubjects?.map((s: any) => s.name) || []
    const sponsors = (bill.sponsors || []).map((s: any) => ({
      people_id: 0,
      name: s.fullName,
      first_name: s.firstName || "",
      last_name: s.lastName || "",
      party: s.party || "Unknown",
      role: s.district ? `${s.state}-${s.district}` : s.state || "",
    }))
    const actions = actionsRes?.actions || []
    const history = actions.slice(0, 30).map((a: any) => ({
      date: a.actionDate,
      action: a.text,
      chamber: a.sourceSystem?.name?.includes("House") ? "house" : "senate",
    }))

    // Text versions: Congress.gov returns textVersions with type, date, formats[]
    const texts = (textRes?.textVersions || []).flatMap((tv: any, vi: number) =>
      (tv.formats || []).map((f: any, fi: number) => ({
        doc_id: vi * 10 + fi,
        type: `${tv.type || "Text"} - ${f.type || "Document"}`,
        mime: f.type === "PDF" ? "application/pdf" : "text/html",
        url: f.url || "",
        state_link: f.url || "",
        text_size: 0,
      }))
    )

    // Amendments: Congress.gov returns amendments with number, type, description, latestAction
    const amendments = (amendmentsRes?.amendments || []).map((a: any) => ({
      amendment_id: parseInt(a.number, 10) || 0,
      chamber: a.type?.startsWith("H") ? "house" : "senate",
      number: a.number?.toString() || "",
      description: a.description || a.purpose || "",
      status: a.latestAction?.text?.slice(0, 80) || "Unknown",
    }))

    // Votes: from actions with recordedVotes, parse yea/nay from text (dedupe by rollNumber)
    const seenRolls = new Set<string>()
    const votes = actions.flatMap((a: any) =>
      (a.recordedVotes || [])
        .filter((v: any) => {
          const key = `${v.chamber}-${v.rollNumber}-${v.date}`
          if (seenRolls.has(key)) return false
          seenRolls.add(key)
          return true
        })
        .map((v: any) => {
          const { yea, nay, passed } = parseVoteCounts(a.text || "")
          return {
            roll_call_id: v.rollNumber || 0,
            date: v.date,
            desc: a.text,
            yea,
            nay,
            nv: 0,
            absent: 0,
            total: yea + nay,
            passed: passed ? 1 : 0,
            vote_url: v.url,
          }
        })
    )

    // Supplements: Congress.gov uses cboCostEstimates
    const supplements = (bill.cboCostEstimates || []).map((c: any, i: number) => ({
      supplement_id: i,
      type: "CBO Cost Estimate",
      title: c.title || "",
      description: c.description || "",
    }))

    return NextResponse.json({
      bill_id: id,
      title: bill.title || "Untitled Bill",
      description,
      introduced_date: bill.introducedDate || bill.latestAction?.actionDate || "",
      sponsor_name: sponsors[0]?.name || "Unknown Sponsor",
      state: "US",
      bill_number: `${bill.type} ${bill.number}`,
      status: bill.latestAction?.text?.slice(0, 80) || "Unknown",
      status_date: bill.latestAction?.actionDate || "",
      progress: history,
      committee: bill.committees?.url ? "See committees" : "",
      next_action: bill.latestAction?.text || "",
      sponsors,
      subjects,
      history,
      votes,
      texts,
      amendments,
      supplements,
    })
  } catch (error) {
    console.error("Error fetching bill:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
