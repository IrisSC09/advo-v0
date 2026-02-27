const API_KEY = "mzTlfYrC5xObWKWxJQKgrLNxlJc3KEuTRrYp57qR"
const BASE = "https://api.congress.gov/v3"

function billId(c: number, t: string, n: string) {
  return `${c}-${t.toLowerCase()}-${n}`
}

export async function fetchBillsList(congress: number, offset: number, limit: number) {
  const res = await fetch(`${BASE}/bill/${congress}?api_key=${API_KEY}&limit=${limit}&offset=${offset}&sort=updateDate+desc`, { cache: "no-store" })
  if (!res.ok) throw new Error(`Congress.gov error: ${res.status}`)
  const data = await res.json()
  return data
}

export async function fetchBillSearch(q: string, offset: number, limit: number) {
  const res = await fetch(`${BASE}/bill?api_key=${API_KEY}&q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&sort=updateDate+desc`, { cache: "no-store" })
  if (!res.ok) throw new Error(`Congress.gov error: ${res.status}`)
  const data = await res.json()
  return data
}

export async function fetchBillDetail(congress: number, type: string, number: string) {
  const res = await fetch(`${BASE}/bill/${congress}/${type.toLowerCase()}/${number}?api_key=${API_KEY}`, { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json()
  return data.bill
}

export function parseBillId(id: string): { congress: number; type: string; number: string } | null {
  const m = id.match(/^(\d+)-([a-z]+)-(\d+)$/i)
  if (!m) return null
  return { congress: parseInt(m[1], 10), type: m[2], number: m[3] }
}

export function toLegiScanShape(b: any) {
  const id = billId(b.congress, b.type, b.number)
  return {
    bill_id: id,
    title: b.title || "Untitled Bill",
    description: "",
    introduced_date: b.latestAction?.actionDate || b.updateDate || "",
    sponsor_name: "Unknown Sponsor",
    state: "US",
    bill_number: `${b.type} ${b.number}`,
    status: b.latestAction?.text?.slice(0, 50) || "Unknown",
    last_action_date: b.latestAction?.actionDate,
    subjects: [],
    sponsors: [],
  }
}
