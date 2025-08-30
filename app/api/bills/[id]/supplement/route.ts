import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getSupplement&id=${params.id}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.supplement) {
      return NextResponse.json({ error: "Supplement not found" }, { status: 404 })
    }

    const supplement = data.supplement

    return NextResponse.json({
      supplement_id: supplement.supplement_id,
      bill_id: supplement.bill_id,
      date: supplement.date,
      type: supplement.type,
      title: supplement.title,
      description: supplement.description,
      mime: supplement.mime,
      url: supplement.url,
      state_link: supplement.state_link,
      doc: supplement.doc, // Base64 encoded document content
    })
  } catch (error) {
    console.error("Error fetching supplement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
