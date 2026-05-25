import { Header } from "@/components/layout/header"

export default function PostCalendarPage() {
  return (
    <>
      <Header title="投稿カレンダー" subtitle="今月の投稿予定を一覧で確認" sectionLabel="Post Calendar" />
      <div className="bg-white border border-[#DDE6EE] rounded-xl p-8 shadow-sm">
        <p className="text-[#5A7184] text-sm">投稿カレンダー機能は Sprint 5 で実装予定です。</p>
      </div>
    </>
  )
}
