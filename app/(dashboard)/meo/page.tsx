import { Header } from "@/components/layout/header"
import { MeoDashboard } from "@/components/meo/meo-dashboard"

export default function MeoPage() {
  return (
    <>
      <Header
        title="MEO順位"
        subtitle="指定キーワードの日次順位推移を計測・分析"
        sectionLabel="MEO Ranking"
      />
      <MeoDashboard />
    </>
  )
}
