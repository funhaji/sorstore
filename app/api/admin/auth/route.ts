import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    // Get admin key from environment variable
    const adminKey = process.env.ADMIN_KEY

    if (!adminKey) {
      console.error("[v0] ADMIN_KEY environment variable is not set")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    if (password === adminKey) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  } catch (error) {
    console.error("[v0] Admin auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
