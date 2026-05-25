import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(`${origin}/stores?error=meta_auth_failed`)
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || origin}/api/meta/callback`

  // Exchange code for short-lived token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?` +
      new URLSearchParams({
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        redirect_uri: redirectUri,
        code,
      })
  )

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}/stores?error=meta_token_failed`)
  }

  const { access_token: shortToken } = await tokenRes.json()

  // Exchange for long-lived token (60 days)
  const longTokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?` +
      new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: process.env.META_APP_ID!,
        client_secret: process.env.META_APP_SECRET!,
        fb_exchange_token: shortToken,
      })
  )

  if (!longTokenRes.ok) {
    return NextResponse.redirect(`${origin}/stores?error=meta_longtoken_failed`)
  }

  const { access_token: longToken } = await longTokenRes.json()

  // Store the token in the database
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("organization_id")
      .eq("id", user.id)
      .single()

    if (userData) {
      await supabase
        .from("stores")
        .update({ meta_access_token: longToken })
        .eq("organization_id", userData.organization_id)
        .limit(1)
    }
  }

  return NextResponse.redirect(`${origin}/stores?success=meta_connected`)
}
