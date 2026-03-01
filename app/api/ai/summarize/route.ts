import { NextResponse } from "next/server"
import { generateBillSummary } from "@/lib/ai"
import { createServerClient } from "@/lib/supabase-server"

const DAILY_LIMIT = 5

function buildFallbackSummary(billText: string, billTitle: string) {
  const cleaned = billText.replace(/\s+/g, " ").trim()
  const sentences = cleaned
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  const summarySentences = sentences.slice(0, 3)
  const keyPointSentences = sentences.slice(0, 5)

  return {
    summary: summarySentences.length
      ? summarySentences.join(". ") + "."
      : `${billTitle} is currently available, but AI generation is temporarily unavailable.`,
    keyPoints: keyPointSentences.length
      ? keyPointSentences.map((s) => (s.endsWith(".") ? s : `${s}.`))
      : ["Could not extract concrete key points from the available bill text."],
    impact: "Potential impact depends on implementation details and who is covered by the bill.",
    controversialAspects: "No automated analysis available right now; review source text for debated clauses.",
  }
}

export async function POST(request: Request) {
  try {
    const { billText, billTitle, billId, userId } = await request.json()

    if (!billText || !billTitle || !billId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()
    const today = new Date().toISOString().slice(0, 10) // UTC day

    const { data: existing } = await supabase
      .from("ai_daily_summaries")
      .select("analysis")
      .eq("user_id", userId)
      .eq("bill_id", billId.toString())
      .eq("analysis_date", today)
      .maybeSingle()

    if (existing?.analysis) {
      const { count } = await supabase
        .from("ai_daily_summaries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("analysis_date", today)

      return NextResponse.json({
        ...(existing.analysis as object),
        usage: {
          limit: DAILY_LIMIT,
          used: count || 0,
          remaining: Math.max(DAILY_LIMIT - (count || 0), 0),
        },
      })
    }

    const { count } = await supabase
      .from("ai_daily_summaries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("analysis_date", today)

    const used = count || 0
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

    await supabase.from("ai_daily_summaries").insert({
      user_id: userId,
      bill_id: billId.toString(),
      analysis_date: today,
      analysis: summary,
      created_at: new Date().toISOString(),
    })

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
