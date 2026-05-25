import { Header } from "@/components/layout/header"

export default function StoresPage() {
  return (
    <>
      <Header title="店舗管理" subtitle="店舗の追加・API連携・メンバー招待" sectionLabel="Store Settings" />
      <div className="bg-white border border-[#DDE6EE] rounded-xl p-8 shadow-sm">
        <p className="text-[#5A7184] text-sm">店舗管理機能は Sprint 6 で実装予定です。</p>
      </div>
    </>
  )
}
