import { Header } from "@/components/layout/header"

export default function MeoPage() {
  return (
    <>
      <Header title="MEO順位" subtitle="指定キーワードの日次順位推移" sectionLabel="MEO Ranking" />
      <div className="bg-white border border-[#DDE6EE] rounded-xl p-8 shadow-sm">
        <p className="text-[#5A7184] text-sm">MEO順位計測機能は Sprint 2 で実装予定です。</p>
      </div>
    </>
  )
}
