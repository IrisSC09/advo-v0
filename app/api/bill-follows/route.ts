import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, bill_id } = await request.json()
    if (!user_id || !bill_id) return NextResponse.json({ error: "Missing user_id or bill_id" }, { status: 400 })
    const supabase = createServerClient()
    const { data, error } = await supabase.from("bill_follows").upsert({ user_id, bill_id: String(bill_id) }, { onConflict: "user_id,bill_id" }).select().single()
    if (error) throw error
    return NextResponse.json({ followed: true, data })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const user_id = searchParams.get("user_id")
    const bill_id = searchParams.get("bill_id")
    if (!user_id || !bill_id) return NextResponse.json({ error: "Missing user_id or bill_id" }, { status: 400 })
    const supabase = createServerClient()
    await supabase.from("bill_follows").delete().eq("user_id", user_id).eq("bill_id", bill_id)
    return NextResponse.json({ followed: false })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const user_id = searchParams.get("user_id")
    const bill_id = searchParams.get("bill_id")
    if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 })
    const supabase = createServerClient()
    let q = supabase.from("bill_follows").select("bill_id, created_at").eq("user_id", user_id)
    if (bill_id) q = q.eq("bill_id", bill_id)
    const { data, error } = await q
    if (error) throw error
    return NextResponse.json(bill_id ? { followed: (data?.length ?? 0) > 0 } : { follows: data ?? [] })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}