import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const billId = searchParams.get("bill_id")

  try {
    let query = createServerClient()
      .from("threads")
      .select(`
        *,
        profiles:author_id (username, full_name, avatar_url)
      `)
      .order("created_at", { ascending: false })

    if (billId) {
      query = query.eq("bill_id", billId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching threads:", error)
      return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
    }

    return NextResponse.json({ threads: data || [] })
  } catch (error) {
    console.error("Error in threads API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received thread creation request:", body)

    const { title, content, type, bill_id, author_id, tags, file_url, preview_url } = body

    if (!title || !content || !type || !bill_id || !author_id) {
      console.error("Missing required fields:", {
        title: !!title,
        content: !!content,
        type: !!type,
        bill_id: !!bill_id,
        author_id: !!author_id,
      })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the server client for database operations
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("threads")
      .insert([
        {
          title,
          content,
          type,
          bill_id,
          author_id,
          tags: tags || [],
          file_url: file_url || null,
          preview_url: preview_url || null,
          likes_count: 0,
          shares_count: 0,
          comments_count: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Supabase error creating thread:", error)
      return NextResponse.json({ error: `Failed to create thread: ${error.message}` }, { status: 500 })
    }

    console.log("Thread created successfully:", data)
    return NextResponse.json({ thread: data })
  } catch (error) {
    console.error("Error in thread creation API:", error)
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 })
  }
}
