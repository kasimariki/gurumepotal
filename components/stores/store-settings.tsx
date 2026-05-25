"use client"

import { useState } from "react"
import {
  Store,
  Link2,
  Users,
  CreditCard,
  Globe,
  Camera,
  AtSign,
  MessageSquare,
  Bell,
  Shield,
  MoreHorizontal,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TabId = "basic" | "api" | "members" | "plan"

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "basic", label: "基本情報", icon: <Store size={15} /> },
  { id: "api", label: "API連携", icon: <Link2 size={15} /> },
  { id: "members", label: "メンバー", icon: <Users size={15} /> },
  { id: "plan", label: "プラン", icon: <CreditCard size={15} /> },
]

interface Integration {
  id: string
  name: string
  icon: React.ReactNode
  connected: boolean
  type: "oauth" | "webhook"
}

const INTEGRATIONS: Integration[] = [
  {
    id: "gbp",
    name: "Google ビジネスプロフィール",
    icon: <Globe size={20} className="text-[#4285F4]" />,
    connected: false,
    type: "oauth",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <Camera size={20} className="text-[#E1306C]" />,
    connected: false,
    type: "oauth",
  },
  {
    id: "threads",
    name: "Threads",
    icon: <AtSign size={20} className="text-[#1A2E4A]" />,
    connected: false,
    type: "oauth",
  },
  {
    id: "slack",
    name: "Slack通知",
    icon: <MessageSquare size={20} className="text-[#4A154B]" />,
    connected: false,
    type: "webhook",
  },
  {
    id: "line",
    name: "LINE通知",
    icon: <Bell size={20} className="text-[#06C755]" />,
    connected: false,
    type: "webhook",
  },
]

const MEMBERS = [
  {
    name: "嘉島力貴",
    email: "test@funrix.co.jp",
    role: "オーナー",
    status: "アクティブ",
  },
]

export function StoreSettings() {
  const [activeTab, setActiveTab] = useState<TabId>("basic")
  const [storeName, setStoreName] = useState("炭火焼鳥 とり源 渋谷店")
  const [address, setAddress] = useState("東京都渋谷区宇田川町1-1")
  const [phone, setPhone] = useState("03-1234-5678")
  const [slackWebhook, setSlackWebhook] = useState("")
  const [lineWebhook, setLineWebhook] = useState("")

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="店舗管理"
        subtitle="店舗情報・API連携・メンバー管理"
        sectionLabel="Store Settings"
      />

      {/* Tab navigation */}
      <div className="flex gap-1 overflow-hidden rounded-lg border border-[#DDE6EE] bg-white p-1 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-[13px] font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[#0F3D7A] text-white"
                : "text-[#5A7184] hover:bg-[#F5F8FA] hover:text-[#1A2E4A]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "basic" && (
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-[16px] font-semibold text-[#1A2E4A]">
            基本情報
          </h2>
          <div className="max-w-xl space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#1A2E4A]">店舗名</Label>
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#1A2E4A]">住所</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#1A2E4A]">電話番号</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#1A2E4A]">営業時間</Label>
              <div className="rounded-lg border border-[#DDE6EE] bg-[#F5F8FA] p-3">
                <div className="space-y-1 text-[13px] text-[#5A7184]">
                  <p>月〜金: 17:00 - 24:00</p>
                  <p>土・日: 16:00 - 24:00</p>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]">
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "api" && (
        <div className="space-y-4">
          {INTEGRATIONS.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between rounded-xl border border-[#DDE6EE] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F8FA]">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-[#1A2E4A]">
                    {integration.name}
                  </h3>
                  <div className="mt-1">
                    {integration.connected ? (
                      <Badge className="bg-[#27AE60]/10 text-[11px] text-[#27AE60]">
                        連携済
                      </Badge>
                    ) : (
                      <Badge className="bg-[#9EB4C4]/10 text-[11px] text-[#9EB4C4]">
                        未連携
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {integration.type === "oauth" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#DDE6EE] text-[#0F3D7A]"
                >
                  連携する
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Webhook URL を入力"
                    value={
                      integration.id === "slack" ? slackWebhook : lineWebhook
                    }
                    onChange={(e) =>
                      integration.id === "slack"
                        ? setSlackWebhook(e.target.value)
                        : setLineWebhook(e.target.value)
                    }
                    className="w-[280px] border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] placeholder:text-[#9EB4C4]"
                  />
                  <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]" size="sm">
                    保存
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "members" && (
        <div className="rounded-xl border border-[#DDE6EE] bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-[#DDE6EE]">
                <TableHead className="text-[13px] text-[#5A7184]">名前</TableHead>
                <TableHead className="text-[13px] text-[#5A7184]">
                  メールアドレス
                </TableHead>
                <TableHead className="text-[13px] text-[#5A7184]">権限</TableHead>
                <TableHead className="text-[13px] text-[#5A7184]">
                  ステータス
                </TableHead>
                <TableHead className="text-[13px] text-[#5A7184]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MEMBERS.map((member) => (
                <TableRow key={member.email} className="border-[#DDE6EE]">
                  <TableCell className="text-[13px] font-medium text-[#1A2E4A]">
                    {member.name}
                  </TableCell>
                  <TableCell className="font-en text-[13px] text-[#5A7184]">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#0F3D7A]/10 text-[11px] text-[#0F3D7A]">
                      <Shield size={10} />
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#27AE60]/10 text-[11px] text-[#27AE60]">
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-[#5A7184] transition-colors hover:bg-[#F5F8FA]"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="border-t border-[#DDE6EE] px-4 py-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#DDE6EE] text-[#0F3D7A]"
            >
              <Users size={15} />
              メンバーを招待
            </Button>
          </div>
        </div>
      )}

      {activeTab === "plan" && (
        <div className="rounded-xl border border-[#DDE6EE] bg-white p-6 shadow-sm">
          <div className="max-w-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[#1A2E4A]">
                  セルフプラン
                </h2>
                <p className="mt-1 font-en text-[28px] font-bold text-[#0F3D7A]">
                  ¥9,800
                  <span className="text-[14px] font-normal text-[#5A7184]">
                    /月
                  </span>
                </p>
              </div>
              <Badge className="bg-[#0F3D7A]/10 text-[11px] text-[#0F3D7A]">
                現在のプラン
              </Badge>
            </div>

            <div className="mt-6 space-y-3 rounded-lg border border-[#DDE6EE] bg-[#F5F8FA] p-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5A7184]">利用店舗数</span>
                <span className="font-medium text-[#1A2E4A]">1 / 1</span>
              </div>
              <div className="h-px bg-[#DDE6EE]" />
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5A7184]">次回請求日</span>
                <span className="font-medium text-[#1A2E4A]">
                  2026年6月25日
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="border-[#DDE6EE] text-[#0F3D7A]"
              >
                プランを変更
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
