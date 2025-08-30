import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, type, bill_id, author_id, tags } = body

    // Validate required fields
    if (!title || !content || !type || !bill_id || !author_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert thread into database
    const { data: thread, error } = await supabase
      .from("threads")
      .insert({
        title,
        content,
        type,
        bill_id,
        author_id,
        tags: tags || [],
        likes_count: 0,
        shares_count: 0,
        comments_count: 0,
        is_trending: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating thread:", error)
      return NextResponse.json({ error: "Failed to create thread" }, { status: 500 })
    }

    return NextResponse.json({ thread }, { status: 201 })
  } catch (error) {
    console.error("Error in thread creation API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const billId = searchParams.get("bill_id")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  try {
    let query = supabase
      .from("threads")
      .select(
        `
        *,
        profiles:author_id (username, avatar_url),
        bills:bill_id (title)
      `,
      )
      .order("created_at", { ascending: false })

    if (billId) {
      query = query.eq("bill_id", billId)
    }

    const { data: threads, error } = await query.range((page - 1) * limit, page * limit - 1)

    if (error) {
      console.error("Error fetching threads:", error)
      return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
    }

    return NextResponse.json({ threads })
  } catch (error) {
    console.error("Error in threads API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
