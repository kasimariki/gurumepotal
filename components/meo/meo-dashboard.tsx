"use client"

import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  Trash2,
  Plus,
  Target,
  Trophy,
  Hash,
  Clock,
} from "lucide-react"
import { useState } from "react"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface KeywordData {
  keyword: string
  currentRank: number
  lastWeekRank: number
  delta: number
  sparkline: number[]
  competitorTop: string
  lastMeasured: string
}

interface CompetitorData {
  name: string
  currentRank: number
  lastWeekRank: number
  delta: number
  reviewCount: number
  avgRating: number
  isSelf: boolean
}

interface ManagedKeyword {
  id: number
  keyword: string
  active: boolean
  radius: number
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const keywordData: KeywordData[] = [
  {
    keyword: "渋谷 焼鳥",
    currentRank: 2,
    lastWeekRank: 5,
    delta: 3,
    sparkline: [8, 7, 7, 6, 6, 5, 5, 5, 4, 4, 5, 4, 4, 3, 3, 4, 3, 3, 3, 3, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2],
    competitorTop: "とりこ家",
    lastMeasured: "2026.05.25",
  },
  {
    keyword: "渋谷 居酒屋 個室",
    currentRank: 3,
    lastWeekRank: 3,
    delta: 0,
    sparkline: [4, 4, 3, 3, 4, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    competitorTop: "個室居酒屋 凛",
    lastMeasured: "2026.05.25",
  },
  {
    keyword: "渋谷 デート ディナー",
    currentRank: 7,
    lastWeekRank: 9,
    delta: 2,
    sparkline: [14, 13, 12, 12, 11, 11, 10, 10, 10, 9, 10, 9, 9, 9, 9, 8, 9, 8, 8, 8, 8, 8, 7, 8, 7, 7, 7, 7, 7, 7],
    competitorTop: "SHIBUYA SKY DINING",
    lastMeasured: "2026.05.25",
  },
  {
    keyword: "渋谷 接待",
    currentRank: 5,
    lastWeekRank: 4,
    delta: -1,
    sparkline: [4, 4, 4, 3, 3, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 5, 5, 5, 5, 5, 5],
    competitorTop: "炭火 鳥源",
    lastMeasured: "2026.05.25",
  },
  {
    keyword: "渋谷 飲み放題",
    currentRank: 12,
    lastWeekRank: 15,
    delta: 3,
    sparkline: [20, 19, 18, 18, 17, 17, 16, 16, 16, 15, 16, 15, 15, 15, 14, 14, 14, 14, 13, 14, 13, 13, 13, 12, 13, 12, 12, 12, 12, 12],
    competitorTop: "金の蔵",
    lastMeasured: "2026.05.25",
  },
]

const competitorData: CompetitorData[] = [
  { name: "とりこ家", currentRank: 1, lastWeekRank: 1, delta: 0, reviewCount: 342, avgRating: 4.5, isSelf: false },
  { name: "炭火焼鳥 とり源（自店）", currentRank: 2, lastWeekRank: 5, delta: 3, reviewCount: 128, avgRating: 4.6, isSelf: true },
  { name: "鳥升", currentRank: 4, lastWeekRank: 3, delta: -1, reviewCount: 215, avgRating: 4.2, isSelf: false },
  { name: "やきとり○金", currentRank: 6, lastWeekRank: 7, delta: 1, reviewCount: 89, avgRating: 3.9, isSelf: false },
]

const initialManagedKeywords: ManagedKeyword[] = [
  { id: 1, keyword: "渋谷 焼鳥", active: true, radius: 3 },
  { id: 2, keyword: "渋谷 居酒屋 個室", active: true, radius: 3 },
  { id: 3, keyword: "渋谷 デート ディナー", active: true, radius: 3 },
  { id: 4, keyword: "渋谷 接待", active: true, radius: 3 },
  { id: 5, keyword: "渋谷 飲み放題", active: true, radius: 3 },
]

/* Trend chart data: 30 days for 5 keywords (lower = better for rank) */
const trendChartData = {
  labels: Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 3, 26 + i) // April 26 to May 25
    return `${d.getMonth() + 1}/${d.getDate()}`
  }),
  series: [
    { label: "渋谷 焼鳥", color: "#0F3D7A", data: [8, 7, 7, 6, 6, 5, 5, 5, 4, 4, 5, 4, 4, 3, 3, 4, 3, 3, 3, 3, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2] },
    { label: "渋谷 居酒屋 個室", color: "#27AE60", data: [4, 4, 3, 3, 4, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
    { label: "渋谷 デート ディナー", color: "#F39C12", data: [14, 13, 12, 12, 11, 11, 10, 10, 10, 9, 10, 9, 9, 9, 9, 8, 9, 8, 8, 8, 8, 8, 7, 8, 7, 7, 7, 7, 7, 7] },
    { label: "渋谷 接待", color: "#E74C3C", data: [4, 4, 4, 3, 3, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 5, 5, 5, 5, 5, 5] },
    { label: "渋谷 飲み放題", color: "#9B59B6", data: [20, 19, 18, 18, 17, 17, 16, 16, 16, 15, 16, 15, 15, 15, 14, 14, 14, 14, 13, 14, 13, 13, 13, 12, 13, 12, 12, 12, 12, 12] },
  ],
}

/* ------------------------------------------------------------------ */
/*  Sparkline SVG                                                      */
/* ------------------------------------------------------------------ */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80
  const h = 24
  const pad = 2
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const stepX = (w - pad * 2) / (data.length - 1)

  // For rank data, invert (lower rank = higher position on chart)
  const points = data
    .map((v, i) => {
      const x = pad + i * stepX
      const y = pad + ((v - min) / range) * (h - pad * 2)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current position dot */}
      <circle
        cx={pad + (data.length - 1) * stepX}
        cy={pad + ((data[data.length - 1] - min) / range) * (h - pad * 2)}
        r="2.5"
        fill={color}
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Rank Badge                                                         */
/* ------------------------------------------------------------------ */

function RankBadge({ rank }: { rank: number }) {
  const style =
    rank <= 3
      ? "bg-[#0F3D7A] text-white"
      : rank <= 10
        ? "bg-[#E6EEF8] text-[#0F3D7A]"
        : "bg-[#F5F8FA] text-[#5A7184]"

  return (
    <span
      className={`font-en inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-[13px] font-bold ${style}`}
    >
      {rank}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Delta Badge                                                        */
/* ------------------------------------------------------------------ */

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <span className="flex items-center gap-0.5 text-[12px] font-medium text-[#9EB4C4]">
        <Minus size={12} />
        <span>---</span>
      </span>
    )
  }

  const positive = delta > 0
  return (
    <span
      className={`flex items-center gap-0.5 text-[12px] font-semibold ${
        positive ? "text-[#27AE60]" : "text-[#E74C3C]"
      }`}
    >
      {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      {positive ? "▲" : "▼"}
      {Math.abs(delta)}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Toggle Switch                                                      */
/* ------------------------------------------------------------------ */

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        checked ? "bg-[#0F3D7A]" : "bg-[#DDE6EE]"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Trend Chart                                                        */
/* ------------------------------------------------------------------ */

function TrendChart() {
  const width = 800
  const height = 200
  const padLeft = 40
  const padRight = 20
  const padTop = 20
  const padBottom = 30

  const allValues = trendChartData.series.flatMap((s) => s.data)
  const maxVal = Math.max(...allValues)
  const minVal = Math.min(...allValues)
  const range = maxVal - minVal || 1
  const dataLen = trendChartData.series[0].data.length

  const chartW = width - padLeft - padRight
  const chartH = height - padTop - padBottom
  const stepX = chartW / (dataLen - 1)

  function toPath(data: number[]) {
    return data
      .map((v, i) => {
        const x = padLeft + i * stepX
        // Invert: lower rank = higher on chart
        const y = padTop + ((v - minVal) / range) * chartH
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(" ")
  }

  // Y-axis labels (rank values, inverted)
  const yTicks = [1, 5, 10, 15, 20]

  // X-axis labels (show every 5th label)
  const xLabels = trendChartData.labels.filter((_, i) => i % 5 === 0 || i === dataLen - 1)
  const xLabelIndices = trendChartData.labels
    .map((_, i) => i)
    .filter((i) => i % 5 === 0 || i === dataLen - 1)

  return (
    <div className="rounded-xl border border-[#DDE6EE] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#1A2E4A]">
          順位推移（直近30日）
        </h3>
        <span className="font-en text-[11px] text-[#9EB4C4]">RANKING TREND</span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = padTop + ((tick - minVal) / range) * chartH
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#DDE6EE"
                strokeWidth="0.5"
                strokeDasharray="4,4"
              />
              <text
                x={padLeft - 8}
                y={y + 3.5}
                textAnchor="end"
                className="font-en"
                fill="#9EB4C4"
                fontSize="9"
              >
                {tick}位
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {xLabelIndices.map((idx, i) => {
          const x = padLeft + idx * stepX
          return (
            <text
              key={idx}
              x={x}
              y={height - 5}
              textAnchor="middle"
              className="font-en"
              fill="#9EB4C4"
              fontSize="8"
            >
              {xLabels[i]}
            </text>
          )
        })}

        {/* Data lines */}
        {trendChartData.series.map((s) => (
          <polyline
            key={s.label}
            points={toPath(s.data)}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* End dots */}
        {trendChartData.series.map((s) => {
          const lastVal = s.data[s.data.length - 1]
          const x = padLeft + (dataLen - 1) * stepX
          const y = padTop + ((lastVal - minVal) / range) * chartH
          return <circle key={`dot-${s.label}`} cx={x} cy={y} r="3" fill={s.color} />
        })}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-5">
        {trendChartData.series.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div
              className="h-[3px] w-4 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[11px] text-[#5A7184]">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Star Rating (compact)                                              */
/* ------------------------------------------------------------------ */

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="font-en text-[13px] font-semibold text-[#F39C12]">
      {"★".repeat(Math.floor(rating))}
      {rating % 1 !== 0 && "☆"}
      <span className="ml-1 text-[12px] text-[#5A7184]">{rating.toFixed(1)}</span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  MEO Dashboard                                                      */
/* ------------------------------------------------------------------ */

export function MeoDashboard() {
  const [managedKeywords, setManagedKeywords] = useState<ManagedKeyword[]>(initialManagedKeywords)

  const toggleKeyword = (id: number) => {
    setManagedKeywords((prev) =>
      prev.map((kw) => (kw.id === id ? { ...kw, active: !kw.active } : kw))
    )
  }

  const deleteKeyword = (id: number) => {
    setManagedKeywords((prev) => prev.filter((kw) => kw.id !== id))
  }

  // Calculate KPI values
  const avgRank = 3.2
  const top3Count = keywordData.filter((kw) => kw.currentRank <= 3).length
  const totalKeywords = keywordData.length

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* Section 1: Summary KPI Cards                                  */}
      {/* ============================================================ */}
      <div className="grid grid-cols-3 gap-4">
        {/* Average Rank */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <Target size={16} className="text-[#0F3D7A]" />
            </div>
            <span className="text-[12px] font-medium text-[#5A7184]">平均順位</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-en text-[28px] font-bold leading-none text-[#1A2E4A]">
              {avgRank}
            </span>
            <span className="text-[14px] font-medium text-[#5A7184]">位</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-[12px] font-semibold text-[#27AE60]">
              <TrendingUp size={13} />
              ▲1.4
            </span>
            <span className="text-[11px] text-[#9EB4C4]">前月比</span>
          </div>
        </div>

        {/* Top 3 Keywords */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <Trophy size={16} className="text-[#0F3D7A]" />
            </div>
            <span className="text-[12px] font-medium text-[#5A7184]">トップ3入りキーワード</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-en text-[28px] font-bold leading-none text-[#1A2E4A]">
              {top3Count}/{totalKeywords}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-[12px] font-semibold text-[#27AE60]">
              <TrendingUp size={13} />
              ▲1
            </span>
            <span className="text-[11px] text-[#9EB4C4]">前月比</span>
          </div>
        </div>

        {/* Total Keywords */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <Hash size={16} className="text-[#0F3D7A]" />
            </div>
            <span className="text-[12px] font-medium text-[#5A7184]">計測キーワード数</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-en text-[28px] font-bold leading-none text-[#1A2E4A]">
              {totalKeywords}
            </span>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-[#E6EEF8] px-2.5 py-0.5 text-[11px] font-semibold text-[#0F3D7A]">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section 2: Keyword Ranking Table                              */}
      {/* ============================================================ */}
      <div className="rounded-xl border border-[#DDE6EE] bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-[#1A2E4A]">キーワード順位</h3>
          <span className="font-en text-[11px] text-[#9EB4C4]">KEYWORD RANKING</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#DDE6EE]">
                <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                  キーワード
                </th>
                <th className="pb-3 px-4 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                  現在順位
                </th>
                <th className="pb-3 px-4 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                  先週
                </th>
                <th className="pb-3 px-4 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                  変動
                </th>
                <th className="pb-3 px-4 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                  30日推移
                </th>
                <th className="pb-3 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                  競合トップ
                </th>
                <th className="pb-3 pl-4 text-right text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                  最終計測
                </th>
              </tr>
            </thead>
            <tbody>
              {keywordData.map((kw) => {
                const sparklineColor =
                  kw.delta > 0 ? "#27AE60" : kw.delta < 0 ? "#E74C3C" : "#9EB4C4"
                return (
                  <tr
                    key={kw.keyword}
                    className="border-b border-[#DDE6EE] last:border-b-0 transition-colors hover:bg-[#F5F8FA]"
                  >
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <Search size={13} className="shrink-0 text-[#9EB4C4]" />
                        <span className="text-[13px] font-semibold text-[#1A2E4A]">
                          {kw.keyword}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <RankBadge rank={kw.currentRank} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-en text-[13px] text-[#5A7184]">
                        {kw.lastWeekRank}位
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <DeltaBadge delta={kw.delta} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={kw.sparkline} color={sparklineColor} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[12px] text-[#5A7184]">{kw.competitorTop}</span>
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <span className="flex items-center justify-end gap-1 font-en text-[11px] text-[#9EB4C4]">
                        <Clock size={11} />
                        {kw.lastMeasured}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section 3: Trend Chart                                        */}
      {/* ============================================================ */}
      <TrendChart />

      {/* ============================================================ */}
      {/* Section 4 & 5: Competitor + Keyword Management                */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 gap-4">
        {/* Competitor Comparison */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-6">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#1A2E4A]">競合比較</h3>
            <span className="font-en text-[11px] text-[#9EB4C4]">COMPETITOR</span>
          </div>
          <p className="mb-4 text-[12px] text-[#5A7184]">
            「渋谷 焼鳥」キーワード
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#DDE6EE]">
                  <th className="pb-3 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                    店舗名
                  </th>
                  <th className="pb-3 px-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                    現在順位
                  </th>
                  <th className="pb-3 px-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                    先週
                  </th>
                  <th className="pb-3 px-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                    変動
                  </th>
                  <th className="pb-3 px-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                    口コミ数
                  </th>
                  <th className="pb-3 pl-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
                    平均評価
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitorData.map((comp) => (
                  <tr
                    key={comp.name}
                    className={`border-b border-[#DDE6EE] last:border-b-0 transition-colors ${
                      comp.isSelf
                        ? "bg-[#E6EEF8]/50"
                        : "hover:bg-[#F5F8FA]"
                    }`}
                  >
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-[#1A2E4A]">
                          {comp.name}
                        </span>
                        {comp.isSelf && (
                          <span className="rounded-full bg-[#0F3D7A] px-2 py-0.5 text-[9px] font-bold text-white">
                            自店
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <RankBadge rank={comp.currentRank} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-en text-[13px] text-[#5A7184]">
                        {comp.lastWeekRank}位
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <DeltaBadge delta={comp.delta} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-en text-[13px] font-medium text-[#1A2E4A]">
                        {comp.reviewCount}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-center">
                      <StarDisplay rating={comp.avgRating} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Keyword Management */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#1A2E4A]">計測キーワード設定</h3>
            <span className="font-en text-[11px] text-[#9EB4C4]">SETTINGS</span>
          </div>

          <div className="space-y-2">
            {managedKeywords.map((kw) => (
              <div
                key={kw.id}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  kw.active
                    ? "border-[#DDE6EE] bg-white"
                    : "border-[#DDE6EE] bg-[#F5F8FA]"
                }`}
              >
                <ToggleSwitch
                  checked={kw.active}
                  onChange={() => toggleKeyword(kw.id)}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-[13px] font-semibold ${
                      kw.active ? "text-[#1A2E4A]" : "text-[#9EB4C4]"
                    }`}
                  >
                    {kw.keyword}
                  </span>
                </div>
                <span className="shrink-0 rounded-full bg-[#F5F8FA] px-2.5 py-0.5 text-[11px] font-medium text-[#5A7184]">
                  {kw.radius}km
                </span>
                <button
                  type="button"
                  onClick={() => deleteKeyword(kw.id)}
                  className="shrink-0 rounded-lg p-1.5 text-[#9EB4C4] transition-colors hover:bg-[#F5F8FA] hover:text-[#E74C3C]"
                  aria-label={`${kw.keyword}を削除`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#B0C4D4] bg-[#F5F8FA] py-3 text-[13px] font-medium text-[#5A7184] transition-colors hover:border-[#0F3D7A] hover:bg-[#E6EEF8] hover:text-[#0F3D7A]"
          >
            <Plus size={14} />
            <span>キーワードを追加</span>
          </button>
        </div>
      </div>
    </div>
  )
}
