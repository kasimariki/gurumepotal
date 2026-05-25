"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Star,
  MessageSquare,
  TrendingUp,
  Bell,
  CalendarDays,
  Sparkles,
  RefreshCw,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react"

// ---------- Types ----------
type ReviewSource = "all" | "google" | "tabelog" | "instagram"
type RatingFilter = "all" | "5" | "4" | "3below"
type StatusFilter = "all" | "unreplied" | "ai_draft" | "replied"
type ReviewStatus = "unreplied" | "ai_draft" | "replied"

interface Review {
  id: number
  source: "google" | "tabelog" | "instagram"
  rating: number
  body: string
  author: string
  date: string
  status: ReviewStatus
}

// ---------- Mock Data ----------
const REVIEWS: Review[] = [
  {
    id: 1,
    source: "google",
    rating: 5,
    body: "焼鳥のクオリティが抜群でした。個室の雰囲気もよく、接客も丁寧。また伺います。",
    author: "Yamada T.",
    date: "2時間前",
    status: "unreplied",
  },
  {
    id: 2,
    source: "google",
    rating: 3,
    body: "料理は美味しかったが、店員さんが忙しそうで注文が伝わりにくかった。改善希望。",
    author: "田中健太",
    date: "本日",
    status: "unreplied",
  },
  {
    id: 3,
    source: "tabelog",
    rating: 2,
    body: "予約時間に席が用意されておらず20分待たされた。料理は普通。",
    author: "anonymous",
    date: "昨日",
    status: "unreplied",
  },
  {
    id: 4,
    source: "google",
    rating: 5,
    body: "誕生日サプライズありがとうございました！スタッフの心遣いに感動。",
    author: "Suzuki M.",
    date: "2日前",
    status: "ai_draft",
  },
  {
    id: 5,
    source: "google",
    rating: 4,
    body: "焼き加減が絶妙。日本酒の品揃えもよい。ただ喫煙席と禁煙席が分かれてないのが残念。",
    author: "K.Tanaka",
    date: "3日前",
    status: "replied",
  },
  {
    id: 6,
    source: "google",
    rating: 5,
    body: "渋谷で一番の焼鳥屋。比内地鶏は絶品。予約必須。",
    author: "Food Lover",
    date: "5日前",
    status: "replied",
  },
]

const AI_DRAFTS: Record<number, string> = {
  1: "Yamada T.様、この度はご来店いただき誠にありがとうございます。焼鳥のクオリティや個室の雰囲気、接客についてお褒めの言葉をいただき、スタッフ一同大変嬉しく思っております。お客様にご満足いただけるよう、今後もより一層精進してまいります。またのご来店を心よりお待ちしております。",
  2: "田中健太様、この度はご来店いただきありがとうございます。お料理をお楽しみいただけたとのこと、嬉しく存じます。一方で、注文時にご不便をおかけしてしまい大変申し訳ございませんでした。スタッフの対応について改善に努め、より快適にお過ごしいただけるよう取り組んでまいります。貴重なご意見をありがとうございました。",
  3: "この度はご来店いただきありがとうございます。ご予約いただいたにもかかわらず、お席のご用意にお時間をいただいてしまい、大変申し訳ございませんでした。予約管理の体制を見直し、再発防止に努めてまいります。何卒ご容赦いただけますと幸いです。またの機会がございましたら、改善した姿をお見せできるよう精進いたします。",
  4: "Suzuki M.様、お誕生日おめでとうございます！また、大切な日に当店をお選びいただき誠にありがとうございます。スタッフの心遣いに感動いただけたとのこと、私たちにとってもこの上ない喜びです。これからも特別な日のお手伝いができるよう、スタッフ一同心を込めてお迎えいたします。",
}

// ---------- Helper functions ----------
function getSourceLabel(source: Review["source"]) {
  switch (source) {
    case "google":
      return "GOOGLE"
    case "tabelog":
      return "食べログ"
    case "instagram":
      return "INSTAGRAM"
  }
}

function getSourceColor(source: Review["source"]) {
  switch (source) {
    case "google":
      return "bg-[#4285F4]/10 text-[#4285F4]"
    case "tabelog":
      return "bg-[#E74C3C]/10 text-[#E74C3C]"
    case "instagram":
      return "bg-[#E1306C]/10 text-[#E1306C]"
  }
}

function getStatusLabel(status: ReviewStatus) {
  switch (status) {
    case "unreplied":
      return "未返信"
    case "ai_draft":
      return "AI下書き済"
    case "replied":
      return "返信済"
  }
}

function getStatusStyle(status: ReviewStatus) {
  switch (status) {
    case "unreplied":
      return "bg-[#F39C12]/10 text-[#F39C12] border-[#F39C12]/20"
    case "ai_draft":
      return "bg-[#0F3D7A]/10 text-[#0F3D7A] border-[#0F3D7A]/20"
    case "replied":
      return "bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/20"
  }
}

function getBorderColor(rating: number) {
  if (rating >= 4) return "border-l-[#0F3D7A]"
  if (rating === 3) return "border-l-[#F39C12]"
  return "border-l-[#E74C3C]"
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-3.5 w-3.5 ${
        i < rating
          ? "fill-[#F39C12] text-[#F39C12]"
          : "fill-none text-[#DDE6EE]"
      }`}
    />
  ))
}

// ---------- Main Component ----------
export function ReviewsDashboard() {
  const [sourceFilter, setSourceFilter] = useState<ReviewSource>("all")
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReviewId, setSelectedReviewId] = useState<number>(1)
  const [tone, setTone] = useState<"polite" | "friendly" | "formal">("polite")
  const [draftText, setDraftText] = useState(AI_DRAFTS[1] || "")

  // Filter reviews
  const filteredReviews = REVIEWS.filter((r) => {
    if (sourceFilter !== "all" && r.source !== sourceFilter) return false
    if (ratingFilter === "5" && r.rating !== 5) return false
    if (ratingFilter === "4" && r.rating !== 4) return false
    if (ratingFilter === "3below" && r.rating > 3) return false
    if (statusFilter === "unreplied" && r.status !== "unreplied") return false
    if (statusFilter === "ai_draft" && r.status !== "ai_draft") return false
    if (statusFilter === "replied" && r.status !== "replied") return false
    if (
      searchQuery &&
      !r.body.includes(searchQuery) &&
      !r.author.includes(searchQuery)
    )
      return false
    return true
  })

  const selectedReview = REVIEWS.find((r) => r.id === selectedReviewId)

  function handleSelectReview(id: number) {
    setSelectedReviewId(id)
    setDraftText(AI_DRAFTS[id] || "")
  }

  // ---------- Source filter tabs ----------
  const sourceTabs: { value: ReviewSource; label: string }[] = [
    { value: "all", label: "すべて" },
    { value: "google", label: "Google" },
    { value: "tabelog", label: "食べログ" },
    { value: "instagram", label: "Instagram" },
  ]

  const ratingOptions: { value: RatingFilter; label: string }[] = [
    { value: "all", label: "すべて" },
    { value: "5", label: "★5" },
    { value: "4", label: "★4" },
    { value: "3below", label: "★3以下" },
  ]

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "すべて" },
    { value: "unreplied", label: "未返信" },
    { value: "ai_draft", label: "AI下書き済" },
    { value: "replied", label: "返信済" },
  ]

  const toneOptions: {
    value: "polite" | "friendly" | "formal"
    label: string
  }[] = [
    { value: "polite", label: "丁寧" },
    { value: "friendly", label: "フレンドリー" },
    { value: "formal", label: "フォーマル" },
  ]

  return (
    <>
      <Header
        title="口コミ管理"
        subtitle="Google・食べログ・Instagramの口コミを一元管理し、AI返信で効率的に対応"
        sectionLabel="Reviews"
      />

      {/* ===== Filter Bar ===== */}
      <div className="rounded-xl border border-[#DDE6EE] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Source tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-[#F5F8FA] p-1">
            {sourceTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSourceFilter(tab.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  sourceFilter === tab.value
                    ? "bg-[#0F3D7A] text-white shadow-sm"
                    : "text-[#5A7184] hover:text-[#1A2E4A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Rating filter */}
          <div className="flex items-center gap-1">
            <span className="mr-1 text-xs font-medium text-[#5A7184]">
              評価:
            </span>
            {ratingOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRatingFilter(opt.value)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                  ratingFilter === opt.value
                    ? "border-[#0F3D7A] bg-[#E6EEF8] text-[#0F3D7A]"
                    : "border-[#DDE6EE] text-[#5A7184] hover:border-[#B0C4D4]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            <span className="mr-1 text-xs font-medium text-[#5A7184]">
              状態:
            </span>
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                  statusFilter === opt.value
                    ? "border-[#0F3D7A] bg-[#E6EEF8] text-[#0F3D7A]"
                    : "border-[#DDE6EE] text-[#5A7184] hover:border-[#B0C4D4]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9EB4C4]" />
            <Input
              placeholder="口コミを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-56 border-[#DDE6EE] pl-8 text-xs placeholder:text-[#9EB4C4] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
            />
          </div>
        </div>
      </div>

      {/* ===== Summary Stats ===== */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total reviews */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#5A7184]">総口コミ数</p>
              <p className="mt-1 font-en text-2xl font-bold text-[#1A2E4A]">
                156
                <span className="ml-0.5 text-sm font-normal text-[#5A7184]">
                  件
                </span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <MessageSquare className="h-5 w-5 text-[#0F3D7A]" />
            </div>
          </div>
        </div>

        {/* Average rating */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#5A7184]">平均評価</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <p className="font-en text-2xl font-bold text-[#1A2E4A]">
                  4.6
                  <span className="text-sm font-normal text-[#5A7184]">
                    /5.0
                  </span>
                </p>
                <span className="flex items-center gap-0.5 rounded-full bg-[#27AE60]/10 px-1.5 py-0.5 text-xs font-medium text-[#27AE60]">
                  <TrendingUp className="h-3 w-3" />
                  0.2
                </span>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F39C12]/10">
              <Star className="h-5 w-5 fill-[#F39C12] text-[#F39C12]" />
            </div>
          </div>
        </div>

        {/* Unreplied */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#5A7184]">未返信</p>
              <p className="mt-1 font-en text-2xl font-bold text-[#F39C12]">
                4
                <span className="ml-0.5 text-sm font-normal text-[#5A7184]">
                  件
                </span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F39C12]/10">
              <Bell className="h-5 w-5 text-[#F39C12]" />
            </div>
          </div>
        </div>

        {/* New this month */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#5A7184]">今月新着</p>
              <p className="mt-1 font-en text-2xl font-bold text-[#1A2E4A]">
                12
                <span className="ml-0.5 text-sm font-normal text-[#5A7184]">
                  件
                </span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <CalendarDays className="h-5 w-5 text-[#0F3D7A]" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Content: Reviews List + AI Panel ===== */}
      <div className="grid grid-cols-5 gap-4">
        {/* Reviews List (3 cols) */}
        <div className="col-span-3 space-y-3">
          {filteredReviews.map((review) => (
            <button
              key={review.id}
              type="button"
              onClick={() => handleSelectReview(review.id)}
              className={`block w-full rounded-xl border border-l-4 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md ${getBorderColor(review.rating)} ${
                selectedReviewId === review.id
                  ? "border-[#0F3D7A]/30 ring-2 ring-[#0F3D7A]/10"
                  : "border-[#DDE6EE]"
              }`}
            >
              {/* Top row: source badge + stars + status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${getSourceColor(review.source)}`}
                  >
                    {getSourceLabel(review.source)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {renderStars(review.rating)}
                  </div>
                  {review.rating <= 2 && (
                    <span className="flex items-center gap-1 rounded-md bg-[#E74C3C]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#E74C3C]">
                      <AlertTriangle className="h-3 w-3" />
                      緊急
                    </span>
                  )}
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${getStatusStyle(review.status)}`}
                >
                  {review.status === "unreplied" && (
                    <Clock className="h-3 w-3" />
                  )}
                  {review.status === "ai_draft" && (
                    <Sparkles className="h-3 w-3" />
                  )}
                  {review.status === "replied" && (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {getStatusLabel(review.status)}
                </span>
              </div>

              {/* Body */}
              <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-[#1A2E4A]">
                {review.body}
              </p>

              {/* Bottom row: author + date + action */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#5A7184]">
                  <span className="font-medium">{review.author}</span>
                  <span className="text-[#9EB4C4]">|</span>
                  <span>{review.date}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    review.status === "unreplied"
                      ? "bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]"
                      : review.status === "ai_draft"
                        ? "border border-[#0F3D7A] text-[#0F3D7A] hover:bg-[#E6EEF8]"
                        : "border border-[#DDE6EE] text-[#5A7184] hover:bg-[#F5F8FA]"
                  }`}
                >
                  {review.status === "unreplied" && (
                    <>
                      <Sparkles className="h-3 w-3" />
                      AI返信を作成
                    </>
                  )}
                  {review.status === "ai_draft" && (
                    <>
                      <ExternalLink className="h-3 w-3" />
                      返信を確認
                    </>
                  )}
                  {review.status === "replied" && (
                    <>
                      <ExternalLink className="h-3 w-3" />
                      返信を確認
                    </>
                  )}
                </span>
              </div>
            </button>
          ))}

          {filteredReviews.length === 0 && (
            <div className="rounded-xl border border-[#DDE6EE] bg-white p-12 text-center shadow-sm">
              <MessageSquare className="mx-auto h-8 w-8 text-[#9EB4C4]" />
              <p className="mt-2 text-sm text-[#5A7184]">
                条件に一致する口コミがありません
              </p>
            </div>
          )}
        </div>

        {/* ===== AI Reply Panel (2 cols) ===== */}
        <div className="col-span-2">
          {selectedReview ? (
            <div className="sticky top-4 space-y-4">
              {/* Original review */}
              <div className="rounded-xl border border-[#DDE6EE] bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${getSourceColor(selectedReview.source)}`}
                  >
                    {getSourceLabel(selectedReview.source)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-[#1A2E4A]">
                  {selectedReview.body}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-[#5A7184]">
                  <span className="font-medium">{selectedReview.author}</span>
                  <span className="text-[#9EB4C4]">|</span>
                  <span>{selectedReview.date}</span>
                </div>
              </div>

              {/* AI Draft */}
              <div className="rounded-xl border border-[#DDE6EE] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#DDE6EE] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-[#0F3D7A]/10 px-2 py-0.5 text-[11px] font-bold text-[#0F3D7A]">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </span>
                    <h3 className="text-sm font-semibold text-[#1A2E4A]">
                      AI返信ドラフト
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <Textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={6}
                    className="min-h-[140px] border-[#DDE6EE] text-sm leading-relaxed text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                  />

                  {/* Tone selector */}
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-medium text-[#5A7184]">
                      トーン
                    </p>
                    <div className="flex gap-2">
                      {toneOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setTone(opt.value)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                            tone === opt.value
                              ? "border-[#0F3D7A] bg-[#0F3D7A] text-white"
                              : "border-[#DDE6EE] text-[#5A7184] hover:border-[#B0C4D4]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-5 flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="default"
                      className="gap-1.5 border-[#DDE6EE] text-xs text-[#5A7184] hover:border-[#B0C4D4] hover:text-[#1A2E4A]"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      再生成
                    </Button>
                    <Button
                      size="default"
                      className="flex-1 gap-1.5 bg-[#0F3D7A] text-xs text-white hover:bg-[#0A2D5E]"
                    >
                      <Send className="h-3.5 w-3.5" />
                      この返信を送信
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[#DDE6EE] bg-white p-12 text-center shadow-sm">
              <Sparkles className="mx-auto h-8 w-8 text-[#9EB4C4]" />
              <p className="mt-2 text-sm text-[#5A7184]">
                口コミを選択してAI返信を作成
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
