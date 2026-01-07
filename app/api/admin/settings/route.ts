import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("site_settings").select("*").single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()
  const { id, ...updateData } = body

  const { data, error } = await supabase.from("site_settings").update(updateData).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Settings update error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
