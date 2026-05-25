import { NextRequest, NextResponse } from "next/server"
import { getAnthropicClient } from "@/lib/ai/client"

export async function POST(request: NextRequest) {
  try {
    const { reviewBody, rating, source, tone, storeName } =
      await request.json()

    if (!reviewBody || typeof reviewBody !== "string") {
      return NextResponse.json(
        { error: "reviewBody is required" },
        { status: 400 }
      )
    }

    const client = getAnthropicClient()

    const systemPrompt = `あなたは飲食店「${storeName || "当店"}」の店主として口コミに返信します。

ルール:
- まず感謝の気持ちを伝える
- ネガティブな点があれば真摯に受け止め、改善を約束する
- 再来店を促す言葉で締める
- トーンは指定に従う（丁寧/フレンドリー/フォーマル）
- 100-200文字程度
- 日本語で生成

必ず以下のJSON形式のみで返してください。他の文章は一切含めないでください:
{ "reply": "返信文" }`

    const toneLabel =
      tone === "friendly"
        ? "フレンドリー"
        : tone === "formal"
          ? "フォーマル"
          : "丁寧"

    const userMessage = `口コミ内容: ${reviewBody}
評価: ${rating || "不明"}星
媒体: ${source || "不明"}
トーン: ${toneLabel}`

    const message = await client.messages.create({
      model: "claude-sonnet-4-6-20250515",
      max_tokens: 512,
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
    console.error("[generate-reply] Error:", error)

    const message =
      error instanceof Error ? error.message : "返信文の生成に失敗しました"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
