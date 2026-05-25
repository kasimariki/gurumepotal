import { NextRequest, NextResponse } from "next/server"
import { getAnthropicClient } from "@/lib/ai/client"

export async function POST(request: NextRequest) {
  try {
    const { prompt, tone, template } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      )
    }

    const client = getAnthropicClient()

    const systemPrompt = `あなたは飲食店のSNS運用のプロフェッショナルです。以下の写真の説明とプロンプトをもとに、Instagram・Threads・Googleビジネスプロフィールの3つの媒体に最適化された投稿文をそれぞれ生成してください。

ルール:
- Instagramは詳細な文章+ハッシュタグ8-12個（改行で区切る）
- Threadsは短くカジュアル、絵文字OK、ハッシュタグ2個まで
- Googleビジネスは【】で始まる見出し付き、丁寧な敬語、行動喚起を含む
- トーンは指定に従う
- 日本語で生成

必ず以下のJSON形式のみで返してください。他の文章は一切含めないでください:
{
  "instagram": { "content": "本文", "hashtags": "ハッシュタグ" },
  "threads": { "content": "本文" },
  "gbp": { "content": "本文" }
}`

    const userMessage = `プロンプト: ${prompt}
トーン: ${tone || "こだわり職人"}
テンプレート: ${template || "本日のおすすめ"}`

    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    })

    const textBlock = message.content.find((block) => block.type === "text")
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "AIからの応答を取得できませんでした" },
        { status: 500 }
      )
    }

    const rawText = textBlock.text.trim()

    // Extract JSON from the response (handle markdown code blocks)
    let jsonText = rawText
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim()
    }

    const parsed = JSON.parse(jsonText)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("[generate-post] Error:", error)

    const message =
      error instanceof Error ? error.message : "投稿文の生成に失敗しました"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
