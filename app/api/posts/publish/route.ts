import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { InstagramClient } from "@/lib/meta/instagram-client"
import { ThreadsClient } from "@/lib/meta/threads-client"

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { postId } = await request.json()

  // Get post data
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*, stores(meta_access_token, gbp_access_token, google_place_id, settings)")
    .eq("id", postId)
    .single()

  if (postError || !post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  const store = (post as any).stores
  const results: Record<string, { success: boolean; externalId?: string; error?: string }> = {}
  const imageUrl = post.image_urls?.[0]

  // Publish to Instagram
  if (post.ig_content && store?.meta_access_token) {
    try {
      const igSettings = store.settings?.instagram || {}
      const ig = new InstagramClient(store.meta_access_token, igSettings.userId || "")
      const caption = `${post.ig_content}\n\n${post.ig_hashtags || ""}`
      if (imageUrl) {
        const result = await ig.post(imageUrl, caption)
        results.instagram = { success: true, externalId: result.id }
      }
    } catch (e) {
      results.instagram = { success: false, error: (e as Error).message }
    }
  }

  // Publish to Threads
  if (post.threads_content && store?.meta_access_token) {
    try {
      const thSettings = store.settings?.threads || {}
      const threads = new ThreadsClient(store.meta_access_token, thSettings.userId || "")
      const result = await threads.post(post.threads_content, imageUrl)
      results.threads = { success: true, externalId: result.id }
    } catch (e) {
      results.threads = { success: false, error: (e as Error).message }
    }
  }

  // Update post status
  const allSuccess = Object.values(results).every((r) => r.success)
  const anySuccess = Object.values(results).some((r) => r.success)

  await supabase
    .from("posts")
    .update({
      status: allSuccess ? "published" : anySuccess ? "published" : "failed",
      published_at: anySuccess ? new Date().toISOString() : null,
    })
    .eq("id", postId)

  // Create post_platform records
  for (const [platform, result] of Object.entries(results)) {
    await supabase.from("post_platforms").insert({
      post_id: postId,
      platform: platform === "instagram" ? "instagram" : platform === "threads" ? "threads" : "gbp",
      external_id: result.externalId || null,
      status: result.success ? "published" : "failed",
      error_message: result.error || null,
      published_at: result.success ? new Date().toISOString() : null,
    })
  }

  return NextResponse.json({ results, status: allSuccess ? "published" : "partial" })
}
