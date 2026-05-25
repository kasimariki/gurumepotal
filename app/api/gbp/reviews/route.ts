import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Try to get store's GBP token
  const { data: userData } = await supabase
    .from("users")
    .select("organization_id")
    .eq("id", user.id)
    .single()

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { data: stores } = await supabase
    .from("stores")
    .select("id, gbp_access_token, google_place_id")
    .eq("organization_id", userData.organization_id)
    .limit(1)

  const store = stores?.[0]

  if (!store?.gbp_access_token) {
    // Return mock data if GBP not connected
    return NextResponse.json({
      reviews: [],
      connected: false,
      message: "GBP未連携。店舗管理→API連携からGoogleビジネスプロフィールを連携してください。",
    })
  }

  // In production, use GBPReviewsClient to fetch real reviews
  // For now return the connected status
  return NextResponse.json({
    reviews: [],
    connected: true,
    message: "GBP connected. Review fetching will be implemented with real API.",
  })
}
