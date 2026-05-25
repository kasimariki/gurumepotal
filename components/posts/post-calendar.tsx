"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  List,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Platform = "ig" | "threads" | "gbp"

interface PostEntry {
  day: number
  platforms: Platform[]
}

interface UpcomingPost {
  date: string
  time: string
  platforms: Platform[]
  preview: string
  status: "投稿済" | "予約済" | "下書き"
}

const PLATFORM_COLORS: Record<Platform, string> = {
  ig: "#E1306C",
  threads: "#1A2E4A",
  gbp: "#0F3D7A",
}

const PLATFORM_LABELS: Record<Platform, string> = {
  ig: "Instagram",
  threads: "Threads",
  gbp: "Googleビジネス",
}

const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"]

const MOCK_POSTS: PostEntry[] = [
  { day: 5, platforms: ["ig", "threads"] },
  { day: 8, platforms: ["gbp"] },
  { day: 12, platforms: ["ig"] },
  { day: 15, platforms: ["ig", "threads", "gbp"] },
  { day: 19, platforms: ["ig"] },
  { day: 22, platforms: ["threads"] },
  { day: 25, platforms: ["ig", "threads"] },
  { day: 26, platforms: ["gbp"] },
  { day: 27, platforms: ["ig"] },
  { day: 29, platforms: ["ig", "threads", "gbp"] },
  { day: 30, platforms: ["ig"] },
]

const UPCOMING_POSTS: UpcomingPost[] = [
  {
    date: "5/25",
    time: "18:00",
    platforms: ["ig", "threads"],
    preview: "比内地鶏の塩焼き 本日のおすすめ",
    status: "予約済",
  },
  {
    date: "5/26",
    time: "12:00",
    platforms: ["gbp"],
    preview: "週末限定コース 予約受付中",
    status: "予約済",
  },
  {
    date: "5/27",
    time: "18:00",
    platforms: ["ig"],
    preview: "新メニュー 地鶏の親子丼ランチ",
    status: "予約済",
  },
  {
    date: "5/29",
    time: "19:00",
    platforms: ["ig", "threads", "gbp"],
    preview: "6月限定メニューのお知らせ",
    status: "下書き",
  },
  {
    date: "5/30",
    time: "18:00",
    platforms: ["ig"],
    preview: "週末のご来店ありがとうございます",
    status: "下書き",
  },
]

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days: (number | null)[] = []

  // Fill leading blanks
  for (let i = 0; i < startDow; i++) {
    days.push(null)
  }

  // Fill actual days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d)
  }

  // Fill trailing blanks to complete the last week
  while (days.length % 7 !== 0) {
    days.push(null)
  }

  return days
}

function getStatusColor(status: string) {
  switch (status) {
    case "投稿済":
      return "bg-[#27AE60]/10 text-[#27AE60]"
    case "予約済":
      return "bg-[#0F3D7A]/10 text-[#0F3D7A]"
    case "下書き":
      return "bg-[#F39C12]/10 text-[#F39C12]"
    default:
      return "bg-[#9EB4C4]/10 text-[#9EB4C4]"
  }
}

export function PostCalendar() {
  const [viewMode, setViewMode] = useState<"月" | "週" | "リスト">("月")

  const year = 2026
  const month = 4 // May (0-indexed)
  const today = 25
  const days = getCalendarDays(year, month)

  const getPostsForDay = (day: number) => {
    return MOCK_POSTS.find((p) => p.day === day)
  }

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="投稿カレンダー"
        subtitle="投稿の予定を管理"
        sectionLabel="Post Calendar"
      >
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex overflow-hidden rounded-lg border border-[#DDE6EE]">
            {(["月", "週", "リスト"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-[#0F3D7A] text-white"
                    : "bg-white text-[#5A7184] hover:bg-[#F5F8FA]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]" size="sm">
            <Plus size={15} />
            投稿を作成
          </Button>
        </div>
      </Header>

      <div className="flex gap-6">
        {/* Calendar Grid */}
        <div className="flex-1">
          <div className="overflow-hidden rounded-xl border border-[#DDE6EE] bg-white shadow-sm">
            {/* Month navigation */}
            <div className="flex items-center justify-between border-b border-[#DDE6EE] px-5 py-3">
              <button
                type="button"
                className="rounded-lg p-1.5 text-[#5A7184] transition-colors hover:bg-[#F5F8FA]"
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="font-en text-[15px] font-semibold text-[#1A2E4A]">
                2026年 5月
              </h2>
              <button
                type="button"
                className="rounded-lg p-1.5 text-[#5A7184] transition-colors hover:bg-[#F5F8FA]"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-[#DDE6EE]">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-[12px] font-medium text-[#5A7184]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                const post = day ? getPostsForDay(day) : null
                const isToday = day === today
                const isWeekend = idx % 7 >= 5

                return (
                  <div
                    key={idx}
                    className={`min-h-[90px] border-b border-r border-[#DDE6EE] p-2 transition-colors last:border-r-0 [&:nth-child(7n)]:border-r-0 ${
                      day
                        ? "cursor-pointer hover:bg-[#F5F8FA]"
                        : "bg-[#FAFBFC]"
                    } ${isToday ? "ring-2 ring-inset ring-[#0F3D7A]" : ""}`}
                  >
                    {day && (
                      <>
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-medium ${
                            isToday
                              ? "bg-[#0F3D7A] text-white"
                              : isWeekend
                                ? "text-[#9EB4C4]"
                                : "text-[#1A2E4A]"
                          }`}
                        >
                          {day}
                        </span>
                        {post && (
                          <div className="mt-1.5 flex gap-1">
                            {post.platforms.map((platform) => (
                              <span
                                key={platform}
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: PLATFORM_COLORS[platform],
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-5 rounded-lg border border-[#DDE6EE] bg-white px-4 py-3">
            <span className="text-[12px] font-medium text-[#5A7184]">凡例:</span>
            {(Object.keys(PLATFORM_COLORS) as Platform[]).map((platform) => (
              <div key={platform} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: PLATFORM_COLORS[platform] }}
                />
                <span className="text-[12px] text-[#5A7184]">
                  {PLATFORM_LABELS[platform]}
                </span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {[
              { label: "今月の投稿数", value: "12件", color: "#0F3D7A" },
              { label: "予約済", value: "3件", color: "#27AE60" },
              { label: "下書き", value: "2件", color: "#F39C12" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-[#DDE6EE] bg-white px-4 py-3 shadow-sm"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${stat.color}10` }}
                >
                  <Calendar size={18} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-[12px] text-[#5A7184]">{stat.label}</p>
                  <p
                    className="font-en text-[18px] font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-[300px] shrink-0">
          <div className="rounded-xl border border-[#DDE6EE] bg-white shadow-sm">
            <div className="border-b border-[#DDE6EE] px-4 py-3">
              <div className="flex items-center gap-2">
                <List size={16} className="text-[#0F3D7A]" />
                <h3 className="text-[14px] font-semibold text-[#1A2E4A]">
                  5月の投稿予定
                </h3>
              </div>
            </div>
            <div className="divide-y divide-[#DDE6EE]">
              {UPCOMING_POSTS.map((post, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 transition-colors hover:bg-[#F5F8FA]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-en text-[12px] font-medium text-[#1A2E4A]">
                      {post.date} {post.time}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(post.status)}`}
                    >
                      {post.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#5A7184]">
                    {post.preview}
                  </p>
                  <div className="mt-1.5 flex gap-1">
                    {post.platforms.map((platform) => (
                      <Badge
                        key={platform}
                        className="text-[9px] text-white"
                        style={{ backgroundColor: PLATFORM_COLORS[platform] }}
                      >
                        {platform === "ig"
                          ? "IG"
                          : platform === "threads"
                            ? "Threads"
                            : "GBP"}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
