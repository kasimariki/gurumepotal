import { Header } from "@/components/layout/header"

export default function ReviewsPage() {
  return (
    <>
      <Header title="口コミ管理" subtitle="Google・食べログの口コミを一元管理" sectionLabel="Reviews" />
      <div className="bg-white border border-[#DDE6EE] rounded-xl p-8 shadow-sm">
        <p className="text-[#5A7184] text-sm">口コミ管理機能は Sprint 3 で実装予定です。</p>
      </div>
    </>
  )
}
