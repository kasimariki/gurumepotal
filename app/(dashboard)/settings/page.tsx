import { Header } from "@/components/layout/header"

export default function SettingsPage() {
  return (
    <>
      <Header title="設定" subtitle="通知設定・アカウント・プラン情報" sectionLabel="Settings" />
      <div className="bg-white border border-[#DDE6EE] rounded-xl p-8 shadow-sm">
        <p className="text-[#5A7184] text-sm">設定機能は Sprint 6 で実装予定です。</p>
      </div>
    </>
  )
}
