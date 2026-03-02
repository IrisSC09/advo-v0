import { NextResponse } from "next/server" //NEED FIXING - need to use gemini api to get sentiment

export async function POST(request: Request) {
  try {
    const { billTitle, threadContent } = await request.json()
    if (!billTitle || !Array.isArray(threadContent)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (threadContent.length === 0) {
      return NextResponse.json({ support: 0, oppose: 0, neutral: 100, overallSentiment: "neutral", keyThemes: [], summary: "Not enough thread data for sentiment analysis." })
    }
    const supportWords = ["support", "approve", "good", "benefit", "help", "important", "strong", "agree"]
    const opposeWords = ["oppose", "bad", "harm", "atrocious", "worse", "reject", "disagree", "against"]
    let supportCount = 0, opposeCount = 0, neutralCount = 0
    const tokens = new Map<string, number>()
    for (const raw of threadContent as string[]) {
      const text = String(raw || "").toLowerCase()
      const s = supportWords.reduce((n, w) => n + (text.includes(w) ? 1 : 0), 0)
      const o = opposeWords.reduce((n, w) => n + (text.includes(w) ? 1 : 0), 0)
      if (s > o) supportCount++
      else if (o > s) opposeCount++
      else neutralCount++
      text.replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 4).forEach((w) => tokens.set(w, (tokens.get(w) || 0) + 1))
    }
    const total = supportCount + opposeCount + neutralCount || 1
    const support = Math.round((supportCount / total) * 100)
    const oppose = Math.round((opposeCount / total) * 100)
    const neutral = Math.max(0, 100 - support - oppose)
    const overallSentiment = support > oppose ? "positive" : oppose > support ? "negative" : "mixed"
    const keyThemes = [...tokens.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k)
    return NextResponse.json({
      support,
      oppose,
      neutral,
      overallSentiment,
      keyThemes,
      summary: `Based on ${total} community threads about ${billTitle}, sentiment is ${overallSentiment}.`,
    })
  } catch (error) {
    console.error("Error in AI sentiment API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
