import { Header } from '@/components/layout/header'
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Star,
  ArrowUp,
  ArrowDown,
  Clock,
  Camera,
  MessageCircle,
  MapPin,
  Plus,
  AlertCircle,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const kpiCards = [
  {
    label: 'MEO平均順位',
    value: '3.2',
    unit: '位',
    delta: '1.4位',
    deltaLabel: '前月比',
    positive: true,
  },
  {
    label: 'Google口コミ',
    value: '4.6',
    unit: '/5.0',
    delta: '0.2',
    deltaLabel: '前月比',
    extra: '新着7件',
    positive: true,
  },
  {
    label: 'SNS総フォロワー',
    value: '2,847',
    unit: '',
    delta: '124',
    deltaLabel: '今週',
    positive: true,
  },
  {
    label: '予約電話数',
    value: '68',
    unit: '件',
    delta: '4',
    deltaLabel: '前週比',
    positive: false,
  },
]

const meoKeywords = [
  { keyword: '渋谷 焼鳥', rank: 1, prev: 3, delta: 2, competitor: '鳥貴族 渋谷店' },
  { keyword: '渋谷 居酒屋 個室', rank: 2, prev: 4, delta: 2, competitor: '和民 渋谷店' },
  { keyword: '渋谷 デート ディナー', rank: 4, prev: 5, delta: 1, competitor: 'ぐるなび掲載店' },
  { keyword: '渋谷 飲み放題', rank: 6, prev: 3, delta: -3, competitor: '笑笑 渋谷店' },
  { keyword: '渋谷 誕生日 サプライズ', rank: 8, prev: 10, delta: 2, competitor: '甘太郎 渋谷店' },
]

const reviews = [
  {
    name: '山田太郎',
    rating: 5,
    date: '2日前',
    text: '雰囲気も料理も最高でした！特に焼き鳥の盛り合わせが絶品。また来ます。',
    status: 'positive' as const,
  },
  {
    name: '佐藤花子',
    rating: 3,
    date: '3日前',
    text: '料理は美味しかったですが、待ち時間が少し長かったです。',
    status: 'warning' as const,
  },
  {
    name: '鈴木一郎',
    rating: 2,
    date: '5日前',
    text: '予約したのに席が用意されていませんでした。改善を希望します。',
    status: 'error' as const,
  },
]

const weekDays = ['月', '火', '水', '木', '金', '土', '日']
const calendarData = [
  { day: '月', date: '5/19', posts: [{ type: 'ig' }, { type: 'threads' }] },
  { day: '火', date: '5/20', posts: [] },
  { day: '水', date: '5/21', posts: [{ type: 'gbp' }] },
  { day: '木', date: '5/22', posts: [{ type: 'ig' }] },
  { day: '金', date: '5/23', posts: [] },
  { day: '土', date: '5/24', posts: [{ type: 'ig' }, { type: 'gbp' }] },
  { day: '日', date: '5/25', posts: [{ type: 'threads' }] },
]

const upcomingPosts = [
  {
    title: '週末限定！焼鳥盛り合わせ半額',
    platform: 'Instagram',
    date: '5/26 12:00',
    status: '予約済み',
  },
  {
    title: '新メニュー「炭火焼きレバー」登場',
    platform: 'Google ビジネス',
    date: '5/27 18:00',
    status: '下書き',
  },
  {
    title: '6月のおすすめドリンクメニュー',
    platform: 'Threads',
    date: '5/28 10:00',
    status: '下書き',
  },
]

/* ------------------------------------------------------------------ */
/*  Trend Chart (SVG sparklines)                                       */
/* ------------------------------------------------------------------ */

function TrendChart() {
  // Mock data points for 30 days
  const meoViews = [120, 135, 128, 142, 155, 148, 162, 170, 158, 175, 180, 172, 190, 185, 195, 200, 188, 205, 210, 198, 215, 220, 208, 225, 230, 218, 235, 240, 228, 245]
  const routeSearches = [45, 52, 48, 55, 60, 57, 63, 68, 62, 70, 72, 68, 75, 73, 78, 80, 76, 82, 85, 80, 88, 90, 86, 92, 95, 90, 97, 100, 95, 102]
  const phoneCalls = [8, 10, 7, 12, 9, 11, 13, 10, 14, 11, 12, 9, 15, 13, 11, 16, 12, 14, 10, 17, 13, 15, 11, 18, 14, 12, 16, 19, 15, 13]

  const width = 720
  const height = 160
  const padX = 40
  const padY = 20

  function toPath(data: number[], color: string) {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const stepX = (width - padX * 2) / (data.length - 1)

    const points = data.map((v, i) => {
      const x = padX + i * stepX
      const y = padY + (1 - (v - min) / range) * (height - padY * 2)
      return `${x},${y}`
    })

    return (
      <polyline
        key={color}
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  }

  return (
    <div className="rounded-xl border border-[#DDE6EE] bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#1A2E4A]">
          来店動向トレンド（直近30日）
        </h3>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <div className="h-[3px] w-4 rounded-full bg-[#0F3D7A]" />
            <span className="text-[11px] text-[#5A7184]">MEO閲覧数</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-[3px] w-4 rounded-full bg-[#27AE60]" />
            <span className="text-[11px] text-[#5A7184]">経路検索</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-[3px] w-4 rounded-full bg-[#F39C12]" />
            <span className="text-[11px] text-[#5A7184]">予約電話</span>
          </div>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {toPath(meoViews, '#0F3D7A')}
        {toPath(routeSearches, '#27AE60')}
        {toPath(phoneCalls, '#F39C12')}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Rank Badge                                                         */
/* ------------------------------------------------------------------ */

function RankBadge({ rank }: { rank: number }) {
  const bg =
    rank <= 3
      ? 'bg-[#0F3D7A] text-white'
      : rank <= 5
        ? 'bg-[#E6EEF8] text-[#0F3D7A]'
        : 'bg-[#F5F8FA] text-[#5A7184]'

  return (
    <span
      className={`font-en inline-flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-bold ${bg}`}
    >
      {rank}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Star Rating                                                        */
/* ------------------------------------------------------------------ */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating
              ? 'fill-[#F39C12] text-[#F39C12]'
              : 'fill-[#DDE6EE] text-[#DDE6EE]'
          }
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Post type dot                                                      */
/* ------------------------------------------------------------------ */

function PostDot({ type }: { type: string }) {
  const colors: Record<string, string> = {
    ig: 'bg-[#E1306C]',
    threads: 'bg-[#1A2E4A]',
    gbp: 'bg-[#0F3D7A]',
  }
  return <div className={`h-2 w-2 rounded-full ${colors[type] ?? 'bg-[#9EB4C4]'}`} />
}

/* ------------------------------------------------------------------ */
/*  Dashboard Page                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-8">
      {/* Header */}
      <Header
        sectionLabel="DASHBOARD"
        title="おかえりなさい、嘉島さん"
        subtitle="今週、MEO順位が2つ改善し、新着口コミが7件届いています。"
      >
        {/* Store Selector */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[#DDE6EE] bg-white px-4 py-2 text-[13px] font-medium text-[#1A2E4A] transition-colors hover:border-[#B0C4D4]"
        >
          <MapPin size={14} className="text-[#5A7184]" />
          <span>渋谷本店</span>
          <ChevronDown size={14} className="text-[#9EB4C4]" />
        </button>

        {/* CTA Button */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#0F3D7A] px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#0A2D5E]"
        >
          <Plus size={15} />
          <span>投稿を作成</span>
        </button>
      </Header>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#DDE6EE] bg-white p-5"
          >
            <div className="mb-1 text-[12px] font-medium text-[#5A7184]">
              {card.label}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-en text-[28px] font-bold leading-none text-[#1A2E4A]">
                {card.value}
              </span>
              {card.unit && (
                <span className="text-[14px] font-medium text-[#5A7184]">
                  {card.unit}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`flex items-center gap-0.5 text-[12px] font-semibold ${
                  card.positive ? 'text-[#27AE60]' : 'text-[#E74C3C]'
                }`}
              >
                {card.positive ? (
                  <TrendingUp size={13} />
                ) : (
                  <TrendingDown size={13} />
                )}
                {card.positive ? '▲' : '▼'}
                {card.delta}
              </span>
              <span className="text-[11px] text-[#9EB4C4]">
                {card.deltaLabel}
              </span>
              {card.extra && (
                <>
                  <span className="text-[11px] text-[#9EB4C4]">/</span>
                  <span className="text-[11px] font-medium text-[#0F3D7A]">
                    {card.extra}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <TrendChart />

      {/* MEO Keywords + Reviews */}
      <div className="grid grid-cols-2 gap-4">
        {/* MEO Rank Table */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#1A2E4A]">
              MEO順位テーブル
            </h3>
            <span className="font-en text-[11px] text-[#9EB4C4]">TOP 5 KEYWORDS</span>
          </div>
          <div className="space-y-3">
            {meoKeywords.map((kw) => (
              <div
                key={kw.keyword}
                className="flex items-center gap-3 rounded-lg border border-[#DDE6EE] px-4 py-3"
              >
                <RankBadge rank={kw.rank} />
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#1A2E4A]">
                    {kw.keyword}
                  </div>
                  <div className="text-[11px] text-[#9EB4C4]">
                    vs {kw.competitor}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-en text-[11px] text-[#9EB4C4]">
                    前回: {kw.prev}位
                  </div>
                  <div
                    className={`flex items-center justify-end gap-0.5 text-[12px] font-semibold ${
                      kw.delta > 0 ? 'text-[#27AE60]' : 'text-[#E74C3C]'
                    }`}
                  >
                    {kw.delta > 0 ? (
                      <ArrowUp size={12} />
                    ) : (
                      <ArrowDown size={12} />
                    )}
                    {Math.abs(kw.delta)}位
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#1A2E4A]">
              新着口コミ
            </h3>
            <span className="font-en text-[11px] text-[#9EB4C4]">RECENT 3</span>
          </div>
          <div className="space-y-3">
            {reviews.map((review, i) => {
              const borderColor =
                review.status === 'positive'
                  ? 'border-l-[#27AE60]'
                  : review.status === 'warning'
                    ? 'border-l-[#F39C12]'
                    : 'border-l-[#E74C3C]'

              return (
                <div
                  key={i}
                  className={`rounded-lg border border-[#DDE6EE] border-l-[3px] ${borderColor} px-4 py-3`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#1A2E4A]">
                        {review.name}
                      </span>
                      <StarRating rating={review.rating} />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-[#9EB4C4]">
                      <Clock size={11} />
                      {review.date}
                    </span>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-[#5A7184]">
                    {review.text}
                  </p>
                  {review.status === 'error' && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#E74C3C]">
                      <AlertCircle size={12} />
                      要対応
                    </div>
                  )}
                  {review.status === 'warning' && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-[#F39C12]">
                      <AlertCircle size={12} />
                      確認推奨
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Calendar + Upcoming Posts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Week Calendar */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#1A2E4A]">
              投稿カレンダー
            </h3>
            <span className="font-en text-[11px] text-[#9EB4C4]">THIS WEEK</span>
          </div>

          {/* Legend */}
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#E1306C]" />
              <span className="font-en text-[11px] text-[#5A7184]">Instagram</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#1A2E4A]" />
              <span className="font-en text-[11px] text-[#5A7184]">Threads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[#0F3D7A]" />
              <span className="font-en text-[11px] text-[#5A7184]">GBP</span>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((day) => {
              const isToday = day.date === '5/25'
              return (
                <div
                  key={day.date}
                  className={`flex flex-col items-center rounded-lg border px-2 py-3 ${
                    isToday
                      ? 'border-[#0F3D7A] bg-[#E6EEF8]'
                      : 'border-[#DDE6EE] bg-[#F5F8FA]'
                  }`}
                >
                  <span
                    className={`text-[11px] font-semibold ${
                      isToday ? 'text-[#0F3D7A]' : 'text-[#9EB4C4]'
                    }`}
                  >
                    {day.day}
                  </span>
                  <span
                    className={`font-en text-[13px] font-bold ${
                      isToday ? 'text-[#0F3D7A]' : 'text-[#1A2E4A]'
                    }`}
                  >
                    {day.date.split('/')[1]}
                  </span>
                  <div className="mt-2 flex items-center gap-1">
                    {day.posts.length > 0 ? (
                      day.posts.map((p, j) => <PostDot key={j} type={p.type} />)
                    ) : (
                      <div className="h-2 w-2" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming Posts */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-[#1A2E4A]">
              予定の投稿
            </h3>
            <span className="font-en text-[11px] text-[#9EB4C4]">UPCOMING</span>
          </div>
          <div className="space-y-3">
            {upcomingPosts.map((post, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-[#DDE6EE] px-4 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E6EEF8]">
                  {post.platform === 'Instagram' ? (
                    <Camera size={16} className="text-[#E1306C]" />
                  ) : post.platform === 'Threads' ? (
                    <MessageCircle size={16} className="text-[#1A2E4A]" />
                  ) : (
                    <MapPin size={16} className="text-[#0F3D7A]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#1A2E4A]">
                    {post.title}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#9EB4C4]">
                    <span className="font-en">{post.platform}</span>
                    <span>-</span>
                    <span className="font-en">{post.date}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-0.5 text-[11px] font-semibold ${
                    post.status === '予約済み'
                      ? 'bg-[#E6EEF8] text-[#0F3D7A]'
                      : 'bg-[#F5F8FA] text-[#9EB4C4]'
                  }`}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-[#DDE6EE] pt-6">
        <span className="font-en text-[11px] tracking-wide text-[#9EB4C4]">
          &copy; 2026 FUNRIX INC. &mdash; STORE PORTAL v0.1
        </span>
        <span className="font-en text-[11px] text-[#9EB4C4]">
          LAST SYNC: 2026.05.25 14:32
        </span>
      </footer>
    </div>
  )
}
