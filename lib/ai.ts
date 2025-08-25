import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function generateBillSummary(billText: string, billTitle: string) {
  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Analyze this bill and provide a comprehensive summary:

Title: ${billTitle}

Bill Text: ${billText}

Please provide:
1. A clear, accessible summary (2-3 sentences) that explains what this bill does in plain language
2. 3-5 key propositions or main points from the bill
3. Potential impact on different communities
4. Any controversial or notable aspects

Format your response as JSON with the following structure:
{
  "summary": "Brief accessible summary",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "impact": "Description of potential impact",
  "controversialAspects": "Any controversial elements"
}`,
      temperature: 0.3,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating AI summary:", error)
    return null
  }
}

export async function generateSentimentAnalysis(threadContent: string[], billTitle: string) {
  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Analyze the sentiment of these community threads about the bill "${billTitle}":

Thread Content:
${threadContent.join("\n\n---\n\n")}

Provide sentiment analysis as JSON:
{
  "support": 65,
  "oppose": 25,
  "neutral": 10,
  "overallSentiment": "positive/negative/mixed",
  "keyThemes": ["theme1", "theme2", "theme3"],
  "summary": "Brief summary of community sentiment"
}

The percentages should add up to 100.`,
      temperature: 0.2,
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Error generating sentiment analysis:", error)
    return {
      support: 50,
      oppose: 30,
      neutral: 20,
      overallSentiment: "mixed",
      keyThemes: ["engagement", "discussion", "community"],
      summary: "Mixed community sentiment with active engagement",
    }
  }
}
