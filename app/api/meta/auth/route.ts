import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.META_APP_ID
  if (!clientId) {
    return NextResponse.json({ error: "Meta OAuth not configured" }, { status: 500 })
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/meta/callback`

  const scopes = [
    "instagram_basic",
    "instagram_content_publish",
    "pages_show_list",
    "pages_read_engagement",
    "threads_basic",
    "threads_content_publish",
    "threads_manage_replies",
    "threads_read_replies",
  ]

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(","),
  })

  return NextResponse.redirect(`https://www.facebook.com/v21.0/dialog/oauth?${params}`)
}
