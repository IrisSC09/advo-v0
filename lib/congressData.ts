
export interface Bill {
  bill_id: number;
  title: string;
  description: string;
  introduced_date: string;
  sponsor_name: string;
  state: string;
  bill_number: string;
  status: string;
}

const BASE_URL = "https://api.legiscan.com/?key=" + process.env.LEGISCAN_API_KEY;

export async function fetchBills(page = 1, perPage = 20): Promise<Bill[]> {
  try {
    const res = await fetch(`${BASE_URL}&op=getMasterList&state=US&page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch bills");
    const data = await res.json();

    if (!data.masterlist) return [];

    // Convert masterlist into array
    const bills = Object.values(data.masterlist).filter(
      (bill: any) => typeof bill === "object" && bill.bill_id
    ) as any[];

    // Sort by introduction date (descending)
    const sorted = bills.sort(
      (a, b) => new Date(b.introduced).getTime() - new Date(a.introduced).getTime()
    );

    return sorted.slice(0, perPage).map((bill: any) => ({
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || "",
      introduced_date: bill.introduced || "Unknown",
      sponsor_name: bill.sponsors?.[0]?.name || "Unknown",
      state: bill.state || "US",
      bill_number: bill.bill_number,
      status: bill.status || "Unknown",
    }));
  } catch (err) {
    console.error("Error fetching bills:", err);
    return [];
  }
}

export async function searchBills(query: string, page = 1, perPage = 20): Promise<Bill[]> {
  try {
    const res = await fetch(`${BASE_URL}&op=search&state=US&query=${encodeURIComponent(query)}&page=${page}`);
    if (!res.ok) throw new Error("Failed to search bills");
    const data = await res.json();

    if (!data.searchresult || !data.searchresult.results) return [];

    const results = data.searchresult.results;

    return results.slice(0, perPage).map((bill: any) => ({
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || "",
      introduced_date: bill.introduced || "Unknown",
      sponsor_name: bill.sponsor_name || "Unknown",
      state: bill.state || "US",
      bill_number: bill.bill_number,
      status: bill.status_desc || "Unknown",
    }));
  } catch (err) {
    console.error("Error searching bills:", err);
    return [];
  }
}
