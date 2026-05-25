"use client"

import { useState, useCallback } from "react"
import {
  ChevronRight,
  Plus,
  Sparkles,
  Clock,
  Check,
  Hash,
  Star,
  FileText,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const toneOptions = [
  { id: "kodawari", label: "こだわり職人" },
  { id: "friendly", label: "親しみやすい" },
  { id: "luxury", label: "高級感" },
  { id: "casual", label: "カジュアル" },
  { id: "urgency", label: "期間限定の煽り" },
]

const hashtagOptions = [
  { tag: "#渋谷焼鳥", active: true },
  { tag: "#比内地鶏", active: true },
  { tag: "#炭火焼鳥", active: true },
  { tag: "#渋谷ディナー", active: true },
  { tag: "#渋谷駅徒歩5分", active: false },
  { tag: "#日本酒好き", active: false },
  { tag: "#東京グルメ", active: false },
  { tag: "#串焼き", active: false },
  { tag: "#週末ディナー", active: false },
  { tag: "#接待ディナー", active: false },
  { tag: "#貸切宴会", active: false },
  { tag: "#焼き鳥屋さん", active: false },
]

export function PostCreateForm() {
  const [activeTab, setActiveTab] = useState("all")
  const [activeTone, setActiveTone] = useState("kodawari")
  const [scheduleType, setScheduleType] = useState<"now" | "scheduled">("scheduled")
  const [promptText, setPromptText] = useState(
    "比内地鶏の塩焼きを推したい。炭火の香ばしさと素材の旨味を強調して"
  )
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(
    hashtagOptions.filter((h) => h.active).map((h) => h.tag)
  )
  const [selectedTemplate, setSelectedTemplate] = useState("recommend")
  const [scheduleDate, setScheduleDate] = useState("2026-05-30")
  const [scheduleTime, setScheduleTime] = useState("18:00")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<{
    instagram: { content: string; hashtags: string }
    threads: { content: string }
    gbp: { content: string }
  } | null>(null)

  const templateLabels: Record<string, string> = {
    recommend: "本日のおすすめ",
    "new-menu": "新メニュー紹介",
    campaign: "キャンペーン告知",
    hours: "営業時間変更",
    regulars: "常連感謝",
  }

  const handleGeneratePost = useCallback(async () => {
    if (!promptText.trim()) return
    setIsGenerating(true)
    try {
      const toneLabel =
        toneOptions.find((t) => t.id === activeTone)?.label || "こだわり職人"
      const res = await fetch("/api/ai/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          tone: toneLabel,
          template: templateLabels[selectedTemplate] || "本日のおすすめ",
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "生成に失敗しました")
      }
      const data = await res.json()
      setGeneratedContent(data)
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "投稿文の生成に失敗しました"
      )
    } finally {
      setIsGenerating(false)
    }
  }, [promptText, activeTone, selectedTemplate])

  const toggleHashtag = (tag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[13px] text-[#5A7184]">
            <span>SNS投稿</span>
            <ChevronRight size={14} className="text-[#9EB4C4]" />
            <span className="text-[#1A2E4A]">新規作成</span>
          </div>
          <h1 className="text-[22px] font-bold text-[#1A2E4A]">投稿を作成</h1>
          <p className="mt-1 text-[13px] text-[#5A7184]">
            1枚の写真と短いプロンプトで、Instagram・Threads・Googleビジネスの3媒体を同時投稿
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-[#5A7184]">
            <FileText size={15} />
            下書き保存
          </Button>
          <Button variant="outline" size="sm">
            プレビュー
          </Button>
        </div>
      </div>

      {/* Main 2-column grid */}
      <div className="grid flex-1 grid-cols-[360px_1fr] gap-6">
        {/* Left panel */}
        <div className="flex flex-col gap-4">
          {/* Card 1: Photo Upload */}
          <Card className="border-[#DDE6EE] bg-white">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F3D7A] text-[11px] font-bold text-white">
                  1
                </div>
                <CardTitle className="text-[14px] font-semibold text-[#1A2E4A]">
                  写真をアップロード
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Upload preview (mock: uploaded state) */}
              <div className="relative overflow-hidden rounded-lg">
                <div
                  className="flex h-[200px] items-end p-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #8B6F47 0%, #C8A876 100%)",
                  }}
                >
                  <div className="flex items-center gap-2 rounded-md bg-black/40 px-2.5 py-1.5 text-[11px] text-white backdrop-blur-sm">
                    <span className="font-medium">biindori_shio_001.jpg</span>
                    <span className="text-white/70">2.4MB</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail grid */}
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-lg border-2 border-transparent"
                    style={{
                      ...(i === 0 && {
                        borderColor: "#0F3D7A",
                      }),
                    }}
                  >
                    <div
                      className="h-full w-full"
                      style={{
                        background:
                          i === 0
                            ? "linear-gradient(135deg, #8B6F47 0%, #C8A876 100%)"
                            : i === 1
                              ? "linear-gradient(135deg, #6B4F37 0%, #A88866 100%)"
                              : "linear-gradient(135deg, #7B5F47 0%, #B89876 100%)",
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-[#DDE6EE] text-[#9EB4C4] transition-colors hover:border-[#0F3D7A] hover:text-[#0F3D7A]"
                >
                  <Plus size={18} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: AI Prompt */}
          <Card className="border-[#DDE6EE] bg-white">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F3D7A] text-[11px] font-bold text-white">
                  2
                </div>
                <CardTitle className="text-[14px] font-semibold text-[#1A2E4A]">
                  AIに伝える
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Prompt textarea */}
              <div className="space-y-1.5">
                <Label className="text-[13px] text-[#1A2E4A]">
                  投稿の意図・キーワード
                </Label>
                <Textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="min-h-[80px] resize-none border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] placeholder:text-[#9EB4C4] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                  maxLength={200}
                />
                <div className="text-right text-[11px] text-[#9EB4C4]">
                  {promptText.length}/200
                </div>
              </div>

              {/* Tone chips */}
              <div className="space-y-1.5">
                <Label className="text-[13px] text-[#1A2E4A]">トーン</Label>
                <div className="flex flex-wrap gap-1.5">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setActiveTone(tone.id)}
                      className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                        activeTone === tone.id
                          ? "bg-[#0F3D7A] text-white"
                          : "bg-[#F5F8FA] text-[#5A7184] hover:bg-[#E6EEF8] hover:text-[#0F3D7A]"
                      }`}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template select */}
              <div className="space-y-1.5">
                <Label className="text-[13px] text-[#1A2E4A]">
                  テンプレート
                </Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={(v) => {
                    if (v) setSelectedTemplate(v)
                  }}
                >
                  <SelectTrigger className="w-full border-[#DDE6EE] bg-white text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommend">本日のおすすめ</SelectItem>
                    <SelectItem value="new-menu">新メニュー紹介</SelectItem>
                    <SelectItem value="campaign">キャンペーン告知</SelectItem>
                    <SelectItem value="hours">営業時間変更</SelectItem>
                    <SelectItem value="regulars">常連感謝</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AI Generate button */}
              <Button
                className="w-full bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]"
                size="lg"
                onClick={handleGeneratePost}
                disabled={isGenerating || !promptText.trim()}
              >
                {isGenerating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                {isGenerating ? "生成中..." : "AIで3媒体の文面を生成"}
              </Button>
              <p className="text-center text-[11px] text-[#9EB4C4]">
                {isGenerating
                  ? "AIが投稿文を生成しています..."
                  : "生成に約8秒かかります"}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Schedule */}
          <Card className="border-[#DDE6EE] bg-white">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0F3D7A] text-[11px] font-bold text-white">
                  3
                </div>
                <CardTitle className="text-[14px] font-semibold text-[#1A2E4A]">
                  配信タイミング
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Radio options */}
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleType === "now"}
                    onChange={() => setScheduleType("now")}
                    className="h-4 w-4 accent-[#0F3D7A]"
                  />
                  <span className="text-[13px] font-medium text-[#1A2E4A]">
                    今すぐ投稿
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleType === "scheduled"}
                    onChange={() => setScheduleType("scheduled")}
                    className="h-4 w-4 accent-[#0F3D7A]"
                  />
                  <span className="text-[13px] font-medium text-[#1A2E4A]">
                    予約配信
                  </span>
                </label>
              </div>

              {/* Date/time inputs */}
              {scheduleType === "scheduled" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-[#5A7184]">日付</Label>
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-[#5A7184]">時刻</Label>
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A]"
                    />
                  </div>
                </div>
              )}

              {/* Hint */}
              <div className="flex items-start gap-2 rounded-lg bg-[#F5F8FA] p-2.5">
                <Clock size={14} className="mt-0.5 shrink-0 text-[#0F3D7A]" />
                <p className="text-[11px] leading-relaxed text-[#5A7184]">
                  推奨配信時刻：金 18:00（過去データの平均エンゲージメント+24%）
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Platform Preview */}
          <Card className="overflow-hidden border-[#DDE6EE] bg-white p-0">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as string)}
            >
              <div className="flex items-center justify-between border-b border-[#DDE6EE] px-4 py-0">
                <TabsList
                  variant="line"
                  className="h-auto gap-0 bg-transparent p-0"
                >
                  <TabsTrigger
                    value="all"
                    className="rounded-none px-3 py-3 text-[13px] data-active:text-[#0F3D7A]"
                  >
                    全媒体プレビュー
                  </TabsTrigger>
                  <TabsTrigger
                    value="instagram"
                    className="rounded-none px-3 py-3 text-[13px] data-active:text-[#0F3D7A]"
                  >
                    Instagram
                  </TabsTrigger>
                  <TabsTrigger
                    value="threads"
                    className="rounded-none px-3 py-3 text-[13px] data-active:text-[#0F3D7A]"
                  >
                    Threads
                  </TabsTrigger>
                  <TabsTrigger
                    value="gbp"
                    className="rounded-none px-3 py-3 text-[13px] data-active:text-[#0F3D7A]"
                  >
                    Googleビジネス
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-1.5 text-[12px] text-[#27AE60]">
                  <span className="h-2 w-2 rounded-full bg-[#27AE60]" />
                  3媒体すべて連携済み
                </div>
              </div>

              <TabsContent value="all" className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* Instagram Preview */}
                  <PreviewColumn
                    platform="Instagram"
                    platformColor="#E1306C"
                    charCount={
                      generatedContent
                        ? `${generatedContent.instagram.content.length} / 2,200`
                        : "128 / 2,200"
                    }
                    aspectRatio="aspect-square"
                    text={
                      generatedContent ? (
                        <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#1A2E4A]">
                          {generatedContent.instagram.content}
                        </p>
                      ) : (
                        <>
                          <p className="text-[12px] leading-relaxed text-[#1A2E4A]">
                            職人が一本一本、備長炭で丁寧に焼き上げる比内地鶏の塩焼き。
                          </p>
                          <p className="mt-1.5 text-[12px] leading-relaxed text-[#1A2E4A]">
                            秋田が誇る日本三大地鶏のひとつ、比内地鶏。その旨味を最大限に引き出すため、私たちは「塩」と「炭火」だけで勝負します。
                          </p>
                        </>
                      )
                    }
                    hashtags={
                      generatedContent
                        ? generatedContent.instagram.hashtags
                        : "#比内地鶏 #炭火焼鳥 #渋谷焼鳥 #渋谷ディナー #焼鳥好きな人と繋がりたい #東京グルメ"
                    }
                  />

                  {/* Threads Preview */}
                  <PreviewColumn
                    platform="Threads"
                    platformColor="#1A2E4A"
                    charCount={
                      generatedContent
                        ? `${generatedContent.threads.content.length} / 500`
                        : "96 / 500"
                    }
                    aspectRatio="aspect-square"
                    text={
                      <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#1A2E4A]">
                        {generatedContent
                          ? generatedContent.threads.content
                          : "うちの比内地鶏の塩焼き、マジで一回食べてみてほしい。備長炭でじっくり焼くから、皮パリッパリで肉汁がじゅわっと... これは言葉じゃ伝わらないやつ。渋谷で待ってます!"}
                      </p>
                    }
                    hashtags="#渋谷焼鳥 #比内地鶏"
                  />

                  {/* GBP Preview */}
                  <PreviewColumn
                    platform="Googleビジネス"
                    platformColor="#4285F4"
                    charCount={
                      generatedContent
                        ? `${generatedContent.gbp.content.length} / 1,500`
                        : "112 / 1,500"
                    }
                    aspectRatio="aspect-video"
                    text={
                      generatedContent ? (
                        <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#1A2E4A]">
                          {generatedContent.gbp.content}
                        </p>
                      ) : (
                        <>
                          <p className="text-[12px] font-semibold text-[#1A2E4A]">
                            【本日のおすすめ】比内地鶏の塩焼き
                          </p>
                          <p className="mt-1.5 text-[12px] leading-relaxed text-[#1A2E4A]">
                            日本三大地鶏「比内地鶏」を備長炭で丁寧に焼き上げました。塩のみで味わう、素材本来の旨味をお楽しみください。
                          </p>
                        </>
                      )
                    }
                    hashtags=""
                    actionText="詳細を見る"
                  />
                </div>
              </TabsContent>

              <TabsContent value="instagram" className="p-4">
                <div className="mx-auto max-w-md">
                  <PreviewColumn
                    platform="Instagram"
                    platformColor="#E1306C"
                    charCount={
                      generatedContent
                        ? `${generatedContent.instagram.content.length} / 2,200`
                        : "128 / 2,200"
                    }
                    aspectRatio="aspect-square"
                    text={
                      generatedContent ? (
                        <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#1A2E4A]">
                          {generatedContent.instagram.content}
                        </p>
                      ) : (
                        <>
                          <p className="text-[12px] leading-relaxed text-[#1A2E4A]">
                            職人が一本一本、備長炭で丁寧に焼き上げる比内地鶏の塩焼き。
                          </p>
                          <p className="mt-1.5 text-[12px] leading-relaxed text-[#1A2E4A]">
                            秋田が誇る日本三大地鶏のひとつ、比内地鶏。その旨味を最大限に引き出すため、私たちは「塩」と「炭火」だけで勝負します。
                          </p>
                        </>
                      )
                    }
                    hashtags={
                      generatedContent
                        ? generatedContent.instagram.hashtags
                        : "#比内地鶏 #炭火焼鳥 #渋谷焼鳥 #渋谷ディナー #焼鳥好きな人と繋がりたい #東京グルメ"
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="threads" className="p-4">
                <div className="mx-auto max-w-md">
                  <PreviewColumn
                    platform="Threads"
                    platformColor="#1A2E4A"
                    charCount={
                      generatedContent
                        ? `${generatedContent.threads.content.length} / 500`
                        : "96 / 500"
                    }
                    aspectRatio="aspect-square"
                    text={
                      <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#1A2E4A]">
                        {generatedContent
                          ? generatedContent.threads.content
                          : "うちの比内地鶏の塩焼き、マジで一回食べてみてほしい。備長炭でじっくり焼くから、皮パリッパリで肉汁がじゅわっと... これは言葉じゃ伝わらないやつ。渋谷で待ってます!"}
                      </p>
                    }
                    hashtags="#渋谷焼鳥 #比内地鶏"
                  />
                </div>
              </TabsContent>

              <TabsContent value="gbp" className="p-4">
                <div className="mx-auto max-w-md">
                  <PreviewColumn
                    platform="Googleビジネス"
                    platformColor="#4285F4"
                    charCount={
                      generatedContent
                        ? `${generatedContent.gbp.content.length} / 1,500`
                        : "112 / 1,500"
                    }
                    aspectRatio="aspect-video"
                    text={
                      generatedContent ? (
                        <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#1A2E4A]">
                          {generatedContent.gbp.content}
                        </p>
                      ) : (
                        <>
                          <p className="text-[12px] font-semibold text-[#1A2E4A]">
                            【本日のおすすめ】比内地鶏の塩焼き
                          </p>
                          <p className="mt-1.5 text-[12px] leading-relaxed text-[#1A2E4A]">
                            日本三大地鶏「比内地鶏」を備長炭で丁寧に焼き上げました。塩のみで味わう、素材本来の旨味をお楽しみください。
                          </p>
                        </>
                      )
                    }
                    hashtags=""
                    actionText="詳細を見る"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* AI Recommended Hashtags */}
          <Card className="border-[#DDE6EE] bg-white">
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-[#0F3D7A]" />
                <CardTitle className="text-[14px] font-semibold text-[#1A2E4A]">
                  AI推奨ハッシュタグ
                </CardTitle>
              </div>
              <p className="text-[12px] text-[#5A7184]">
                競合アカウントのハッシュタグから抽出
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {hashtagOptions.map((item) => {
                  const isSelected = selectedHashtags.includes(item.tag)
                  return (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => toggleHashtag(item.tag)}
                      className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                        isSelected
                          ? "bg-[#0F3D7A] text-white"
                          : "bg-[#F5F8FA] text-[#5A7184] hover:bg-[#E6EEF8] hover:text-[#0F3D7A]"
                      }`}
                    >
                      {item.tag}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Advice */}
          <div className="rounded-xl border border-[#DDE6EE] border-l-[3px] border-l-[#0F3D7A] bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E6EEF8]">
                <Star size={16} className="text-[#0F3D7A]" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#1A2E4A]">
                  AIからのアドバイス
                </h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#5A7184]">
                  「比内地鶏」キーワードは渋谷エリアで検索トレンドが上昇中です（前月比
                  +18%）。投稿文に地鶏の産地や飼育方法に触れると、グルメ層のエンゲージメントが平均
                  32% 向上する傾向があります。金曜 18:00
                  の配信は、過去の投稿データから最もリーチが伸びる時間帯です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 -mx-8 mt-6 flex items-center justify-between border-t border-[#DDE6EE] bg-white px-8 py-3">
        <div className="flex items-center gap-2 text-[13px] text-[#5A7184]">
          <Badge className="bg-gradient-to-r from-[#E1306C] to-[#C13584] text-[11px] text-white">
            IG
          </Badge>
          <Badge className="bg-[#1A2E4A] text-[11px] text-white">
            Threads
          </Badge>
          <Badge className="bg-[#4285F4] text-[11px] text-white">
            Googleビジネス
          </Badge>
          <span className="ml-1">
            に配信予定 →{" "}
            <span className="font-medium text-[#1A2E4A]">
              {scheduleType === "scheduled"
                ? `${scheduleDate} ${scheduleTime}`
                : "今すぐ"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[#5A7184]">
            下書き保存
          </Button>
          <Button
            size="sm"
            className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]"
          >
            <Check size={15} />
            {scheduleType === "scheduled" ? "予約配信を確定" : "今すぐ投稿"}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Preview Column Sub-component                                      */
/* ------------------------------------------------------------------ */

function PreviewColumn({
  platform,
  platformColor,
  charCount,
  aspectRatio,
  text,
  hashtags,
  actionText,
}: {
  platform: string
  platformColor: string
  charCount: string
  aspectRatio: string
  text: React.ReactNode
  hashtags: string
  actionText?: string
}) {
  return (
    <div className="flex flex-col rounded-lg border border-[#DDE6EE] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#DDE6EE] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: platformColor }}
          />
          <span className="text-[12px] font-semibold text-[#1A2E4A]">
            {platform}
          </span>
        </div>
        <span className="text-[11px] text-[#9EB4C4]">{charCount}</span>
      </div>

      {/* Image placeholder */}
      <div
        className={`${aspectRatio} w-full`}
        style={{
          background: "linear-gradient(135deg, #8B6F47 0%, #C8A876 100%)",
        }}
      />

      {/* Text content */}
      <div className="flex-1 p-3">{text}</div>

      {/* Hashtags or action */}
      {hashtags ? (
        <div className="border-t border-[#DDE6EE] px-3 py-2">
          <p className="text-[11px] leading-relaxed text-[#0F3D7A]">
            {hashtags}
          </p>
        </div>
      ) : actionText ? (
        <div className="border-t border-[#DDE6EE] px-3 py-2">
          <span className="text-[12px] font-medium text-[#4285F4]">
            {actionText}
          </span>
        </div>
      ) : null}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#DDE6EE] px-3 py-2">
        <Badge className="bg-[#E6EEF8] text-[10px] font-medium text-[#0F3D7A]">
          AI
        </Badge>
        <button
          type="button"
          className="text-[12px] font-medium text-[#0F3D7A] transition-colors hover:text-[#0A2D5E]"
        >
          編集 →
        </button>
      </div>
    </div>
  )
}
