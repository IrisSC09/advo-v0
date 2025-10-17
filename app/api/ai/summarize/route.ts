import { NextResponse } from "next/server"
import { generateBillSummary } from "@/lib/ai"

export async function POST(request: Request) {
  try {
    const { billText, billTitle } = await request.json()

    if (!billText || !billTitle) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const summary = await generateBillSummary(billText, billTitle)

    if (!summary) {
      return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error in AI summarize API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
