"use client"

import { useState } from "react"
import {
  Bell,
  Mail,
  User,
  Database,
  Download,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ToggleItem {
  id: string
  label: string
  description?: string
  defaultOn: boolean
}

const NOTIFICATION_TOGGLES: ToggleItem[] = [
  {
    id: "negative_review",
    label: "ネガティブ口コミ通知（★3以下）",
    defaultOn: true,
  },
  {
    id: "new_review",
    label: "新着口コミ通知",
    defaultOn: true,
  },
  {
    id: "meo_rank_drop",
    label: "MEO順位下落通知（3位以上低下）",
    defaultOn: true,
  },
  {
    id: "post_reminder",
    label: "投稿リマインダー",
    defaultOn: false,
  },
  {
    id: "monthly_report",
    label: "月次レポート自動配信",
    defaultOn: true,
  },
]

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        checked ? "bg-[#0F3D7A]" : "bg-[#DDE6EE]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

export function SettingsForm() {
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {}
      for (const item of NOTIFICATION_TOGGLES) {
        initial[item.id] = item.defaultOn
      }
      return initial
    }
  )

  const [slackUrl, setSlackUrl] = useState("")
  const [lineUrl, setLineUrl] = useState("")
  const [emailNotify, setEmailNotify] = useState("test@funrix.co.jp")
  const [displayName, setDisplayName] = useState("嘉島力貴")

  const handleToggle = (id: string, checked: boolean) => {
    setToggleStates((prev) => ({ ...prev, [id]: checked }))
  }

  return (
    <div className="flex flex-col gap-6">
      <Header
        title="設定"
        subtitle="通知・アカウント設定"
        sectionLabel="Settings"
      />

      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Card 1: 通知設定 */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#DDE6EE] px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <Bell size={16} className="text-[#0F3D7A]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[#1A2E4A]">
              通知設定
            </h2>
          </div>
          <div className="divide-y divide-[#DDE6EE]">
            {NOTIFICATION_TOGGLES.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <span className="text-[13px] font-medium text-[#1A2E4A]">
                  {item.label}
                </span>
                <ToggleSwitch
                  checked={toggleStates[item.id]}
                  onChange={(checked) => handleToggle(item.id, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: 通知先 */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#DDE6EE] px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <Mail size={16} className="text-[#0F3D7A]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[#1A2E4A]">
              通知先
            </h2>
          </div>
          <div className="space-y-5 px-6 py-5">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#1A2E4A]">
                Slack Webhook URL
              </Label>
              <Input
                value={slackUrl}
                onChange={(e) => setSlackUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] placeholder:text-[#9EB4C4]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#1A2E4A]">
                LINE Webhook URL
              </Label>
              <Input
                value={lineUrl}
                onChange={(e) => setLineUrl(e.target.value)}
                placeholder="https://api.line.me/v2/bot/message/..."
                className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] placeholder:text-[#9EB4C4]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#1A2E4A]">
                メール通知先
              </Label>
              <Input
                value={emailNotify}
                onChange={(e) => setEmailNotify(e.target.value)}
                className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A]"
              />
            </div>
            <div className="pt-1">
              <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]">
                保存
              </Button>
            </div>
          </div>
        </div>

        {/* Card 3: アカウント */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#DDE6EE] px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <User size={16} className="text-[#0F3D7A]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[#1A2E4A]">
              アカウント
            </h2>
          </div>
          <div className="space-y-5 px-6 py-5">
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#1A2E4A]">表示名</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px] text-[#1A2E4A]">
                メールアドレス
              </Label>
              <Input
                value="test@funrix.co.jp"
                disabled
                className="border-[#DDE6EE] bg-[#F5F8FA] text-[13px] text-[#9EB4C4]"
              />
            </div>
            <div>
              <button
                type="button"
                className="text-[13px] font-medium text-[#0F3D7A] transition-colors hover:text-[#0A2D5E] hover:underline"
              >
                パスワードを変更
              </button>
            </div>
            <div className="pt-1">
              <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]">
                保存
              </Button>
            </div>
          </div>
        </div>

        {/* Card 4: データ管理 */}
        <div className="rounded-xl border border-[#DDE6EE] bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-[#DDE6EE] px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <Database size={16} className="text-[#0F3D7A]" />
            </div>
            <h2 className="text-[15px] font-semibold text-[#1A2E4A]">
              データ管理
            </h2>
          </div>
          <div className="space-y-4 px-6 py-5">
            <Button
              variant="outline"
              className="border-[#DDE6EE] text-[#1A2E4A]"
            >
              <Download size={15} />
              データをエクスポート（CSV）
            </Button>

            <div className="rounded-lg border border-[#E74C3C]/20 bg-[#E74C3C]/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={16}
                  className="mt-0.5 shrink-0 text-[#E74C3C]"
                />
                <div>
                  <p className="text-[12px] leading-relaxed text-[#5A7184]">
                    アカウントを削除すると、全てのデータが完全に削除されます。この操作は取り消せません。
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 border-[#E74C3C]/30 text-[#E74C3C] hover:bg-[#E74C3C]/10"
                    size="sm"
                  >
                    <Trash2 size={14} />
                    アカウントを削除
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
