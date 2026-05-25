import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// This endpoint would be called by Vercel Cron daily
// vercel.json: { "crons": [{ "path": "/api/meo/measure", "schedule": "0 3 * * *" }] }
export async function POST(request: Request) {
  // Verify cron secret in production
  const authHeader = request.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  // Get all active keywords across all stores
  const { data: keywords, error } = await supabase
    .from("meo_keywords")
    .select("id, keyword, radius_km, store_id, stores(google_place_id)")
    .eq("is_active", true)

  if (error || !keywords) {
    return NextResponse.json({ error: "Failed to fetch keywords" }, { status: 500 })
  }

  // For each keyword, measure ranking via Google Places API
  // In production: use Google Places API (Text Search) to find ranking
  const results = []
  for (const kw of keywords) {
    // Placeholder: In production, call Google Places API here
    // const ranking = await measureRanking(kw.keyword, kw.radius_km, storeGooglePlaceId)

    const { error: insertError } = await supabase
      .from("meo_rankings")
      .insert({
        keyword_id: kw.id,
        store_id: kw.store_id,
        rank: null, // Will be filled by actual API call
        measured_at: new Date().toISOString(),
      })

    results.push({
      keyword: kw.keyword,
      status: insertError ? "error" : "measured",
    })
  }

  return NextResponse.json({
    measured: results.length,
    results,
  })
}
