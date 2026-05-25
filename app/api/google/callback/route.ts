import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(`${origin}/stores?error=google_auth_failed`)
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || origin}/api/google/callback`

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}/stores?error=google_token_failed`)
  }

  const tokens = await tokenRes.json()

  // Store tokens in the database (update the store's gbp_access_token)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Get user's organization stores and update the first one
    // In production, you'd let the user pick which store to connect
    await supabase.rpc("update_store_gbp_token", {
      p_user_id: user.id,
      p_access_token: tokens.access_token,
      p_refresh_token: tokens.refresh_token || "",
    })
  }

  return NextResponse.redirect(`${origin}/stores?success=google_connected`)
}
