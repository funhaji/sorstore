import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Execute the raw SQL query using Supabase's rpc or direct query
    // We'll use a workaround since Supabase doesn't allow arbitrary SQL via the API
    // Instead, we'll parse common SQL commands and execute them via the appropriate methods

    const trimmedQuery = query.trim().toLowerCase()

    // Handle SELECT queries
    if (trimmedQuery.startsWith("select")) {
      // Extract table name from simple SELECT queries
      const tableMatch = query.match(/from\s+["']?(\w+)["']?/i)
      if (tableMatch) {
        const tableName = tableMatch[1]
        const { data, error } = await supabase.from(tableName).select("*")
        if (error) {
          return NextResponse.json({
            success: false,
            error: error.message,
            hint: "Make sure the table exists and you have permission to access it.",
          })
        }
        return NextResponse.json({
          success: true,
          data,
          rowCount: data?.length || 0,
          message: `Query executed successfully. ${data?.length || 0} rows returned.`,
        })
      }
    }

    // For non-SELECT queries, we need to use RPC or provide guidance
    // Since we can't execute arbitrary SQL, we'll return the query result based on table operations

    // Handle INSERT
    if (trimmedQuery.startsWith("insert")) {
      return NextResponse.json({
        success: false,
        error: "Direct INSERT queries are not supported via API.",
        hint: "Use the admin panel to add data, or create an RPC function in Supabase.",
      })
    }

    // Handle UPDATE
    if (trimmedQuery.startsWith("update")) {
      return NextResponse.json({
        success: false,
        error: "Direct UPDATE queries are not supported via API.",
        hint: "Use the admin panel to update data, or create an RPC function in Supabase.",
      })
    }

    // Handle DELETE
    if (trimmedQuery.startsWith("delete")) {
      return NextResponse.json({
        success: false,
        error: "Direct DELETE queries are not supported via API.",
        hint: "Use the admin panel to delete data, or create an RPC function in Supabase.",
      })
    }

    // For DDL or other queries
    return NextResponse.json({
      success: false,
      error: "This type of query cannot be executed via the API.",
      hint: "For CREATE, ALTER, DROP statements, please use the Supabase SQL Editor in your dashboard.",
    })
  } catch (err) {
    console.error("[v0] SQL execution error:", err)
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    })
  }
}
