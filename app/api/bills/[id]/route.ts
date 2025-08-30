import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

interface BillDetail {
  bill_id: number
  title: string
  description: string
  introduced_date: string
  sponsor_name: string
  state: string
  bill_number: string
  status: string
  party?: string
  topic?: string
  full_text?: string
  committee?: string
  next_action?: string
  ai_summary?: {
    summary: string
    keyPoints: string[]
    impact: string
    controversialAspects: string
  }
}

async function fetchBillFromLegiScan(billId: string): Promise<BillDetail | null> {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getBill&id=${billId}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()
    const bill = data.bill

    if (!bill) {
      return null
    }

    return {
      bill_id: bill.bill_id,
      title: bill.title || "Untitled Bill",
      description: bill.description || bill.summary || "No description available",
      introduced_date: bill.introduced || "2024-01-01",
      sponsor_name: bill.sponsors?.[0]?.name || "Unknown Sponsor",
      state: bill.state || "US",
      bill_number: bill.bill_number || `BILL-${bill.bill_id}`,
      status: bill.status_desc || "Unknown",
      party: inferPartyFromSponsor(bill.sponsors?.[0]?.name || ""),
      topic: inferTopicFromTitle(bill.title || ""),
      full_text: bill.texts?.[0]?.doc || "",
      committee: bill.committee?.name || "Unknown Committee",
      next_action: bill.history?.[0]?.action || "No upcoming actions",
    }
  } catch (error) {
    console.error("Error fetching bill from LegiScan:", error)
    return null
  }
}

function inferPartyFromSponsor(sponsorName: string): string {
  const name = sponsorName.toLowerCase()
  if (name.includes("(d-") || name.includes("democrat")) return "Democrat"
  if (name.includes("(r-") || name.includes("republican")) return "Republican"
  if (name.includes("(i-") || name.includes("independent")) return "Independent"
  return "Unknown"
}

function inferTopicFromTitle(title: string): string {
  const titleLower = title.toLowerCase()
  if (titleLower.includes("climate") || titleLower.includes("environment") || titleLower.includes("green"))
    return "Climate"
  if (titleLower.includes("immigration") || titleLower.includes("border")) return "Immigration"
  if (titleLower.includes("education") || titleLower.includes("student") || titleLower.includes("school"))
    return "Education"
  if (titleLower.includes("health") || titleLower.includes("medical")) return "Healthcare"
  if (titleLower.includes("economic") || titleLower.includes("tax") || titleLower.includes("infrastructure"))
    return "Economics"
  if (titleLower.includes("defense") || titleLower.includes("military") || titleLower.includes("security"))
    return "Defense"
  return "Other"
}

async function generateAISummary(bill: BillDetail): Promise<BillDetail["ai_summary"]> {
  try {
    const prompt = `Analyze this legislation and provide a comprehensive summary:

Title: ${bill.title}
Description: ${bill.description}
Sponsor: ${bill.sponsor_name}
Status: ${bill.status}

Please provide:
1. A clear, concise summary (2-3 sentences)
2. 3-5 key points or provisions
3. Potential impact on citizens
4. Any controversial or notable aspects

Format your response as JSON with the following structure:
{
  "summary": "...",
  "keyPoints": ["...", "...", "..."],
  "impact": "...",
  "controversialAspects": "..."
}`

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
      maxTokens: 1000,
    })

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(text)
      return {
        summary: parsed.summary || "AI summary unavailable",
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : ["Key points unavailable"],
        impact: parsed.impact || "Impact analysis unavailable",
        controversialAspects: parsed.controversialAspects || "No notable aspects identified",
      }
    } catch (parseError) {
      // If JSON parsing fails, create a basic summary from the text
      return {
        summary: text.substring(0, 300) + "...",
        keyPoints: ["AI analysis available in summary"],
        impact: "Detailed impact analysis in progress",
        controversialAspects: "Analysis pending",
      }
    }
  } catch (error) {
    console.error("Error generating AI summary:", error)
    return {
      summary: "AI summary temporarily unavailable",
      keyPoints: ["Summary generation in progress"],
      impact: "Impact analysis pending",
      controversialAspects: "Analysis unavailable",
    }
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bill = await fetchBillFromLegiScan(params.id)

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    // Generate AI summary
    const aiSummary = await generateAISummary(bill)
    bill.ai_summary = aiSummary

    return NextResponse.json(bill)
  } catch (error) {
    console.error("Error in bill detail API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
