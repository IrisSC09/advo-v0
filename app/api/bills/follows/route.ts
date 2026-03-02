import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-server"

const err = (msg: string, status = 500) => NextResponse.json({ error: msg }, { status })

export async function POST(request: NextRequest) {
  try {
    const { user_id, bill_id } = await request.json()
    if (!user_id || !bill_id) return err("Missing user_id or bill_id", 400)

    const { data, error } = await supabase
      .from("bill_follows")
      .upsert({ user_id, bill_id: String(bill_id) }, { onConflict: "user_id,bill_id" })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ followed: true, data })
  } catch (e) {
    return err(String(e))
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const user_id = searchParams.get("user_id")
    const bill_id = searchParams.get("bill_id")
    if (!user_id || !bill_id) return err("Missing user_id or bill_id", 400)

    await supabase.from("bill_follows").delete().eq("user_id", user_id).eq("bill_id", bill_id)
    return NextResponse.json({ followed: false })
  } catch (e) {
    return err(String(e))
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const user_id = searchParams.get("user_id")
    const bill_id = searchParams.get("bill_id")
    if (!user_id) return err("Missing user_id", 400)

    let query = supabase.from("bill_follows").select("bill_id, created_at").eq("user_id", user_id)
    if (bill_id) query = query.eq("bill_id", bill_id)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(
      bill_id ? { followed: (data?.length ?? 0) > 0 } : { follows: data ?? [] }
    )
  } catch (e) {
    return err(String(e))
  }
}