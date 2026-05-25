import { Header } from "@/components/layout/header"

export default function ReportsPage() {
  return (
    <>
      <Header title="レポート" subtitle="月次PDFレポートの一覧" sectionLabel="Reports" />
      <div className="bg-white border border-[#DDE6EE] rounded-xl p-8 shadow-sm">
        <p className="text-[#5A7184] text-sm">レポート機能は Sprint 5 で実装予定です。</p>
      </div>
    </>
  )
}
