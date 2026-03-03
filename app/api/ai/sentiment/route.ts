import { NextResponse } from "next/server"
import { generateSentimentAnalysis } from "@/lib/ai"

const SENTIMENT_ALLOWED_EMAIL = "iris.cao2009@gmail.com"

export async function POST(request: Request) {
  try {
    const { billTitle, threadContent, userEmail } = await request.json()
    if (!userEmail || userEmail !== SENTIMENT_ALLOWED_EMAIL) {
      return NextResponse.json(
        { error: "Sentiment analysis is not available for this account." },
        { status: 403 },
      )
    }
    if (!billTitle || !Array.isArray(threadContent)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (threadContent.length === 0) {
      return NextResponse.json({
        support: 0,
        oppose: 0,
        neutral: 100,
        overallSentiment: "neutral",
        keyThemes: [],
        summary: "Not enough thread data for sentiment analysis.",
      })
    }
    const result = await generateSentimentAnalysis(threadContent, billTitle)
    if (!result) {
      return NextResponse.json({ error: "Failed to generate sentiment analysis" }, { status: 500 })
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in AI sentiment API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
