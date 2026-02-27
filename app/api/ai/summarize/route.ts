import { NextResponse } from "next/server"
import { generateBillSummary } from "@/lib/ai"

const DAILY_LIMIT = 5
const usageByUserDay = new Map<string, number>()

function buildFallbackSummary(billText: string, billTitle: string) {
  const cleaned = billText.replace(/\s+/g, " ").trim()
  const preview = cleaned.slice(0, 600)
  const sentences = preview
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)

  return {
    summary: sentences.length
      ? sentences.join(". ") + "."
      : `${billTitle} is currently available, but AI generation is temporarily unavailable.`,
    keyPoints: [
      "Review the bill text and status timeline for exact language.",
      "Check sponsors, committee activity, and recent actions for context.",
      "Use community threads to compare different interpretations.",
    ],
    impact: "Potential impact depends on implementation details and who is covered by the bill.",
    controversialAspects: "No automated analysis available right now; review source text for debated clauses.",
  }
}

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

    const summary = (await generateBillSummary(billText, billTitle)) || buildFallbackSummary(billText, billTitle)
    usageByUserDay.set(usageKey, used + 1)
    return NextResponse.json({
      ...summary,
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
