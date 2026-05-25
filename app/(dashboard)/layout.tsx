import Sidebar from '@/components/layout/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <Sidebar />
      <main className="overflow-y-auto bg-[#F5F8FA] p-8">{children}</main>
    </div>
  )
}
