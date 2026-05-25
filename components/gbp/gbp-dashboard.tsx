"use client"

import { useState } from "react"
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Image as ImageIcon,
  FileText,
  Trash2,
  Plus,
  Eye,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"

type TabId = "basic" | "hours" | "photos" | "posts"

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "basic", label: "基本情報", icon: FileText },
  { id: "hours", label: "営業時間", icon: Clock },
  { id: "photos", label: "写真", icon: ImageIcon },
  { id: "posts", label: "投稿履歴", icon: FileText },
]

const weeklyHours = [
  { day: "月曜日", open: "17:00", close: "24:00" },
  { day: "火曜日", open: "17:00", close: "24:00" },
  { day: "水曜日", open: "17:00", close: "24:00" },
  { day: "木曜日", open: "17:00", close: "24:00" },
  { day: "金曜日", open: "17:00", close: "24:00" },
  { day: "土曜日", open: "16:00", close: "24:00" },
  { day: "日曜日", open: "16:00", close: "23:00" },
]

const photoGradients = [
  "linear-gradient(135deg, #8B6F47 0%, #C8A876 100%)",
  "linear-gradient(135deg, #6B4F37 0%, #A88866 100%)",
  "linear-gradient(135deg, #7B5F47 0%, #B89876 100%)",
  "linear-gradient(135deg, #5B3F27 0%, #987856 100%)",
  "linear-gradient(135deg, #9B7F57 0%, #D8B886 100%)",
  "linear-gradient(135deg, #4B2F17 0%, #886846 100%)",
  "linear-gradient(135deg, #AB8F67 0%, #E8C896 100%)",
  "linear-gradient(135deg, #3B1F07 0%, #785836 100%)",
]

const recentPosts = [
  {
    id: 1,
    title: "【本日のおすすめ】比内地鶏の塩焼き",
    date: "2026/05/25",
    views: 234,
  },
  {
    id: 2,
    title: "【お知らせ】6月の貸切宴会プラン",
    date: "2026/05/20",
    views: 189,
  },
  {
    id: 3,
    title: "【週末限定】飲み放題キャンペーン",
    date: "2026/05/15",
    views: 312,
  },
]

export function GbpDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("basic")
  const [businessName, setBusinessName] = useState("炭火焼鳥 とり源 渋谷店")
  const [category, setCategory] = useState("焼鳥店")
  const [address, setAddress] = useState("東京都渋谷区宇田川町1-1")
  const [phoneNumber, setPhoneNumber] = useState("03-1234-5678")
  const [website, setWebsite] = useState("https://torigen-shibuya.jp")
  const [description, setDescription] = useState(
    "渋谷駅徒歩5分。厳選した地鶏を備長炭で丁寧に焼き上げる本格焼鳥店。個室完備。"
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Header
        title="GBP情報管理"
        subtitle="Googleビジネスプロフィールの営業時間・写真・属性を管理"
        sectionLabel="Google Business Profile"
      />

      {/* Connection Status */}
      <Card className="border-[#DDE6EE] bg-white">
        <CardContent className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <MapPin size={22} className="text-[#0F3D7A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold text-[#1A2E4A]">
                  Google ビジネスプロフィール
                </p>
                <Badge className="bg-[#27AE60]/10 text-[11px] font-medium text-[#27AE60]">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#27AE60]" />
                  連携済み
                </Badge>
              </div>
              <p className="mt-0.5 text-[12px] text-[#5A7184]">
                炭火焼鳥 とり源 渋谷店
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[12px] text-[#9EB4C4]">
              最終同期: 2026/05/25 14:32
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-[#DDE6EE] text-[12px] text-[#5A7184] hover:bg-[#F5F8FA]"
            >
              <RefreshCw size={13} />
              同期
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-[#DDE6EE]">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? "border-[#0F3D7A] text-[#0F3D7A]"
                  : "border-transparent text-[#5A7184] hover:text-[#1A2E4A]"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "basic" && (
        <Card className="border-[#DDE6EE] bg-white">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold text-[#1A2E4A]">
              基本情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#1A2E4A]">ビジネス名</Label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#1A2E4A]">カテゴリ</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] text-[#1A2E4A]">
                  <MapPin size={14} className="text-[#5A7184]" />
                  住所
                </Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#1A2E4A]">
                    <Phone size={14} className="text-[#5A7184]" />
                    電話番号
                  </Label>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[13px] text-[#1A2E4A]">
                    <Globe size={14} className="text-[#5A7184]" />
                    ウェブサイト
                  </Label>
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] text-[#1A2E4A]">説明文</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] resize-none border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                />
                <div className="text-right text-[11px] text-[#9EB4C4]">
                  {description.length}/750
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]">
                  <CheckCircle2 size={15} />
                  GBPに反映
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "hours" && (
        <div className="flex flex-col gap-4">
          <Card className="border-[#DDE6EE] bg-white">
            <CardHeader>
              <CardTitle className="text-[15px] font-semibold text-[#1A2E4A]">
                通常営業時間
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {weeklyHours.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center gap-4 rounded-lg border border-[#DDE6EE] bg-[#F5F8FA] px-4 py-3"
                  >
                    <span className="w-16 text-[13px] font-medium text-[#1A2E4A]">
                      {item.day}
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        defaultValue={item.open}
                        className="w-28 border-[#DDE6EE] bg-white text-center text-[13px] text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                      />
                      <span className="text-[13px] text-[#9EB4C4]">-</span>
                      <Input
                        type="time"
                        defaultValue={item.close}
                        className="w-28 border-[#DDE6EE] bg-white text-center text-[13px] text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#DDE6EE] bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[15px] font-semibold text-[#1A2E4A]">
                  特別営業時間
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#DDE6EE] text-[12px] text-[#0F3D7A] hover:bg-[#E6EEF8]"
                >
                  <Plus size={13} />
                  追加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-[#DDE6EE] bg-[#F5F8FA] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-[#1A2E4A]">
                    2026/06/15（日）
                  </span>
                  <Badge className="bg-[#E74C3C]/10 text-[11px] font-medium text-[#E74C3C]">
                    休業日
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-[#9EB4C4] hover:text-[#E74C3C]"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]">
              保存
            </Button>
          </div>
        </div>
      )}

      {activeTab === "photos" && (
        <Card className="border-[#DDE6EE] bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[15px] font-semibold text-[#1A2E4A]">
                写真管理
              </CardTitle>
              <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]">
                <Plus size={15} />
                写真を追加
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {photoGradients.map((gradient, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-lg"
                >
                  <div
                    className="h-full w-full"
                    style={{ background: gradient }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#E74C3C] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    photo_{String(i + 1).padStart(2, "0")}.jpg
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "posts" && (
        <Card className="border-[#DDE6EE] bg-white">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold text-[#1A2E4A]">
              GBP投稿履歴
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-[#DDE6EE] bg-[#F5F8FA] px-4 py-3.5"
                >
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-[#1A2E4A]">
                      {post.title}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-[12px] text-[#5A7184]">
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1 text-[12px] text-[#5A7184]">
                        <Eye size={13} className="text-[#9EB4C4]" />
                        閲覧数 {post.views}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    className="border-[#DDE6EE] text-[12px] text-[#0F3D7A] hover:bg-[#E6EEF8]"
                  >
                    詳細
                    <ExternalLink size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
