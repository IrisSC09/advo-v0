import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getAmendment&id=${params.id}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.amendment) {
      return NextResponse.json({ error: "Amendment not found" }, { status: 404 })
    }

    const amendment = data.amendment

    return NextResponse.json({
      amendment_id: amendment.amendment_id,
      bill_id: amendment.bill_id,
      adopted: amendment.adopted === 1,
      date: amendment.date,
      title: amendment.title,
      description: amendment.description,
      mime: amendment.mime,
      url: amendment.url,
      state_link: amendment.state_link,
      doc: amendment.doc, // Base64 encoded document content
    })
  } catch (error) {
    console.error("Error fetching amendment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
