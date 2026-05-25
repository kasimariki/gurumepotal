"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  Mail,
  TrendingUp,
  Calendar,
  BarChart3,
  ArrowUpRight,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"

const reports = [
  {
    id: 1,
    period: "2026年4月",
    store: "炭火焼鳥 とり源 渋谷店",
    generatedAt: "2026/05/01",
    status: "生成済",
    size: "2.4MB",
  },
  {
    id: 2,
    period: "2026年3月",
    store: "炭火焼鳥 とり源 渋谷店",
    generatedAt: "2026/04/01",
    status: "生成済",
    size: "2.1MB",
  },
  {
    id: 3,
    period: "2026年2月",
    store: "炭火焼鳥 とり源 渋谷店",
    generatedAt: "2026/03/01",
    status: "生成済",
    size: "1.8MB",
  },
]

const previewStats = [
  {
    label: "MEO平均順位",
    value: "4.6位 → 3.2位",
    note: "改善",
    noteColor: "#27AE60",
  },
  {
    label: "口コミ数",
    value: "新着18件",
    note: "返信率 89%",
    noteColor: "#0F3D7A",
  },
  {
    label: "SNS投稿数",
    value: "16件",
    note: "IG:8, Threads:4, GBP:4",
    noteColor: "#5A7184",
  },
  {
    label: "経路検索数",
    value: "342件",
    note: "+15%",
    noteColor: "#27AE60",
  },
  {
    label: "予約電話数",
    value: "72件",
    note: "+8%",
    noteColor: "#27AE60",
  },
]

export function ReportsDashboard() {
  const [autoGenerate, setAutoGenerate] = useState(true)
  const [email, setEmail] = useState("test@funrix.co.jp")

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Header
        title="レポート"
        subtitle="月次PDFレポートの一覧・ダウンロード"
        sectionLabel="Reports"
      >
        <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]">
          <FileText size={15} />
          レポートを生成
        </Button>
      </Header>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-[#DDE6EE] bg-white">
          <CardContent className="flex items-center gap-4 pt-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <BarChart3 size={20} className="text-[#0F3D7A]" />
            </div>
            <div>
              <p className="text-[12px] text-[#5A7184]">生成済みレポート</p>
              <p className="text-[20px] font-bold text-[#1A2E4A]">3件</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#DDE6EE] bg-white">
          <CardContent className="flex items-center gap-4 pt-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <Calendar size={20} className="text-[#0F3D7A]" />
            </div>
            <div>
              <p className="text-[12px] text-[#5A7184]">最新レポート</p>
              <p className="text-[20px] font-bold text-[#1A2E4A]">2026年4月</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#DDE6EE] bg-white">
          <CardContent className="flex items-center gap-4 pt-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EEF8]">
              <TrendingUp size={20} className="text-[#0F3D7A]" />
            </div>
            <div>
              <p className="text-[12px] text-[#5A7184]">次回自動生成</p>
              <p className="text-[20px] font-bold text-[#1A2E4A]">2026年6月1日</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card className="border-[#DDE6EE] bg-white">
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold text-[#1A2E4A]">
            月次レポート一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#DDE6EE]">
                <TableHead className="text-[12px] text-[#5A7184]">期間</TableHead>
                <TableHead className="text-[12px] text-[#5A7184]">店舗</TableHead>
                <TableHead className="text-[12px] text-[#5A7184]">生成日</TableHead>
                <TableHead className="text-[12px] text-[#5A7184]">ステータス</TableHead>
                <TableHead className="text-[12px] text-[#5A7184]">サイズ</TableHead>
                <TableHead className="text-[12px] text-[#5A7184]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="border-[#DDE6EE]">
                  <TableCell className="text-[13px] font-medium text-[#1A2E4A]">
                    {report.period}
                  </TableCell>
                  <TableCell className="text-[13px] text-[#1A2E4A]">
                    {report.store}
                  </TableCell>
                  <TableCell className="text-[13px] text-[#5A7184]">
                    {report.generatedAt}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#27AE60]/10 text-[11px] font-medium text-[#27AE60]">
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[13px] text-[#5A7184]">
                    {report.size}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        className="border-[#DDE6EE] text-[12px] text-[#0F3D7A] hover:bg-[#E6EEF8]"
                      >
                        <Download size={13} />
                        ダウンロード
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        className="border-[#DDE6EE] text-[12px] text-[#5A7184] hover:bg-[#F5F8FA]"
                      >
                        <Mail size={13} />
                        メール送信
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card className="border-[#DDE6EE] bg-white">
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold text-[#1A2E4A]">
            最新レポート プレビュー（2026年4月）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {previewStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[#DDE6EE] bg-[#F5F8FA] p-4"
              >
                <p className="text-[11px] text-[#5A7184]">{stat.label}</p>
                <p className="mt-1 text-[16px] font-bold text-[#1A2E4A]">
                  {stat.value}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {stat.noteColor === "#27AE60" && (
                    <ArrowUpRight size={12} className="text-[#27AE60]" />
                  )}
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: stat.noteColor }}
                  >
                    {stat.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-generation Settings */}
      <Card className="border-[#DDE6EE] bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-[#0F3D7A]" />
            <CardTitle className="text-[15px] font-semibold text-[#1A2E4A]">
              自動生成設定
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-5">
            {/* Auto-generate toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[13px] text-[#1A2E4A]">自動生成</Label>
                <p className="mt-0.5 text-[12px] text-[#5A7184]">
                  毎月自動でレポートを生成します
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoGenerate(!autoGenerate)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  autoGenerate ? "bg-[#0F3D7A]" : "bg-[#DDE6EE]"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                    autoGenerate ? "translate-x-[22px]" : "translate-x-[2px]"
                  } mt-[2px]`}
                />
              </button>
            </div>

            {/* Generation date */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[13px] text-[#1A2E4A]">生成日</Label>
                <p className="mt-0.5 text-[12px] text-[#5A7184]">
                  レポートが自動生成される日を設定
                </p>
              </div>
              <p className="text-[13px] font-medium text-[#1A2E4A]">毎月1日</p>
            </div>

            {/* Email delivery */}
            <div className="flex items-center justify-between gap-8">
              <div className="shrink-0">
                <Label className="text-[13px] text-[#1A2E4A]">配信先メール</Label>
                <p className="mt-0.5 text-[12px] text-[#5A7184]">
                  生成されたレポートの送信先
                </p>
              </div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-xs border-[#DDE6EE] bg-white text-[13px] text-[#1A2E4A] focus-visible:border-[#0F3D7A] focus-visible:ring-[#0F3D7A]/20"
              />
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <Button className="bg-[#0F3D7A] text-white hover:bg-[#0A2D5E]">
                保存
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
