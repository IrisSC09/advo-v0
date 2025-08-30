import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const apiKey = "d0db0d79caefbd288452efcea05eca71"

  try {
    const url = `https://api.legiscan.com/?key=${apiKey}&op=getRollCall&id=${params.id}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`LegiScan API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.roll_call) {
      return NextResponse.json({ error: "Roll call not found" }, { status: 404 })
    }

    const rollCall = data.roll_call

    // Process votes
    const votes = rollCall.votes
      ? Object.values(rollCall.votes).map((vote: any) => ({
          people_id: vote.people_id,
          vote_id: vote.vote_id,
          vote_text: vote.vote_text,
          name: vote.name,
          first_name: vote.first_name,
          middle_name: vote.middle_name,
          last_name: vote.last_name,
          suffix: vote.suffix,
          nickname: vote.nickname,
          district: vote.district,
          party: vote.party,
        }))
      : []

    return NextResponse.json({
      roll_call_id: rollCall.roll_call_id,
      bill_id: rollCall.bill_id,
      date: rollCall.date,
      description: rollCall.desc,
      yea: rollCall.yea,
      nay: rollCall.nay,
      nv: rollCall.nv,
      absent: rollCall.absent,
      total: rollCall.total,
      passed: rollCall.passed === 1,
      chamber: rollCall.chamber,
      votes,
    })
  } catch (error) {
    console.error("Error fetching roll call:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
