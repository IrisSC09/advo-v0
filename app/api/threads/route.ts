import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client for server-side operations
function createServerClient() {
  const supabaseUrl = "https://mweaqdserejokxniakyn.supabase.co"
  const supabaseServiceKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWFxZHNlcmVqb2t4bmlha3luIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjA3MzM1NSwiZXhwIjoyMDcxNjQ5MzU1fQ.L2mLPEm4VSlWP8LlOli0FF67yqqhl3nIxHzEJtMRixU"

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const billId = searchParams.get("bill_id")

  try {
    const supabase = createServerClient()

    let query = supabase
      .from("threads")
      .select(`
        *,
        profiles:author_id (username, full_name, avatar_url)
      `)
      .order("likes_count", { ascending: false })
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

    // Validate thread type
    const validTypes = ["zine", "art", "music", "blog"]
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid thread type" }, { status: 400 })
    }

    // Create the server client for database operations
    const supabase = createServerClient()

    // First, check if the user profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", author_id)
      .single()

    if (profileError || !profile) {
      console.error("Profile not found, creating new profile:", profileError)

      // Create a basic profile if it doesn't exist
      const { error: createProfileError } = await supabase.from("profiles").insert([
        {
          id: author_id,
          username: `user_${author_id.slice(0, 8)}`,
          full_name: "Anonymous User",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (createProfileError) {
        console.error("Error creating profile:", createProfileError)
        return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
      }
    }

    // Create the thread with external bill reference
    const threadData = {
      title: title.trim(),
      content: content.trim(),
      type,
      bill_id: bill_id.toString(), // Ensure it's a string
      author_id,
      tags: Array.isArray(tags) ? tags : [],
      file_url: file_url || null,
      preview_url: preview_url || null,
      likes_count: 0,
      shares_count: 0,
      comments_count: 0,
      external_bill_reference: true,
      is_trending: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Inserting thread data:", threadData)

    const { data, error } = await supabase
      .from("threads")
      .insert([threadData])
      .select(`
        *,
        profiles:author_id (username, full_name, avatar_url)
      `)
      .single()

    if (error) {
      console.error("Supabase error creating thread:", error)
      return NextResponse.json(
        {
          error: `Failed to create thread: ${error.message}`,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 },
      )
    }

    console.log("Thread created successfully:", data)
    return NextResponse.json({ thread: data })
  } catch (error) {
    console.error("Error in thread creation API:", error)
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
