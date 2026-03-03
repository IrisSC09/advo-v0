import { NextResponse } from "next/server"
import { generateBillSummary } from "@/lib/ai"

const DAILY_LIMIT = 5
const usageByUserDay = new Map<string, number>()

export async function POST(request: Request) {
  try {
    const { billText, billTitle, userId } = await request.json()

    if (!billText || !billTitle || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const today = new Date().toISOString().slice(0, 10)
    const usageKey = `${userId}:${today}`
    const used = usageByUserDay.get(usageKey) || 0

    if (used >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          error: "Daily AI analysis limit reached",
          limit: DAILY_LIMIT,
          used,
          remaining: 0,
        },
        { status: 429 },
      )
    }

    const summary = (await generateBillSummary(billText, billTitle))
    usageByUserDay.set(usageKey, used + 1)
    return NextResponse.json({
      summary,
      usage: {
        limit: DAILY_LIMIT,
        used: used + 1,
        remaining: Math.max(DAILY_LIMIT - (used + 1), 0),
      },
    })
  } catch (error) {
    console.error("Error in AI summarize API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
