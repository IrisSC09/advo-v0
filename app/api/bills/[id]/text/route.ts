import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"
  const { searchParams } = new URL(request.url)
  const docId = searchParams.get("doc_id")

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getBillText&id=${docId || params.id}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.text) {
      return NextResponse.json({ error: "Bill text not found" }, { status: 404 })
    }

    return NextResponse.json({
      doc_id: data.text.doc_id,
      bill_id: data.text.bill_id,
      type: data.text.type,
      mime: data.text.mime,
      date: data.text.date,
      url: data.text.url,
      state_link: data.text.state_link,
      text_size: data.text.text_size,
      doc: data.text.doc, // Base64 encoded document content
    })
  } catch (error) {
    console.error("Error fetching bill text:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
