export interface Bill {
  bill_id: string | number
  title: string
  description: string
  introduced_date: string
  sponsor_name: string
  state: string
  bill_number: string
  status: string
}

export async function fetchBills(page = 1, perPage = 20): Promise<Bill[]> {
  try {
    const res = await fetch(`/api/bills?page=${page}&limit=${perPage}`)
    if (!res.ok) throw new Error("Failed to fetch bills")
    const data = await res.json()
    return data.bills || []
  } catch (err) {
    console.error("Error fetching bills:", err)
    return []
  }
}

export async function searchBills(query: string, page = 1, perPage = 20): Promise<Bill[]> {
  try {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&page=${page}`)
    if (!res.ok) throw new Error("Failed to search bills")
    const data = await res.json()
    return data.results || []
  } catch (err) {
    console.error("Error searching bills:", err)
    return []
  }
}
