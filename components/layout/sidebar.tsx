'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Star,
  MessageSquare,
  Send,
  Calendar,
  BarChart3,
  Store,
  Settings,
} from 'lucide-react'

const mainNavItems = [
  { label: 'ダッシュボード', href: '/', icon: Home },
  { label: 'MEO順位', href: '/meo', icon: Star },
  { label: '口コミ管理', href: '/reviews', icon: MessageSquare },
  { label: 'SNS投稿', href: '/posts/new', icon: Send },
  { label: '投稿カレンダー', href: '/posts/calendar', icon: Calendar },
  { label: 'レポート', href: '/reports', icon: BarChart3 },
]

const settingsNavItems = [
  { label: '店舗管理', href: '/stores', icon: Store },
  { label: '設定', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[240px] flex-col border-r border-[#DDE6EE] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #1A2E4A 0%, #0F3D7A 100%)',
          }}
        >
          F
        </div>
        <div>
          <div className="text-[15px] font-bold leading-tight text-[#1A2E4A]">
            Funrix
          </div>
          <div className="text-[11px] font-medium leading-tight text-[#9EB4C4]">
            Store Portal
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 pt-2">
        <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
          MAIN
        </div>
        <ul className="space-y-0.5">
          {mainNavItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors ${
                    active
                      ? 'border-l-[3px] border-[#0F3D7A] bg-[#E6EEF8] pl-[9px] text-[#0F3D7A]'
                      : 'border-l-[3px] border-transparent pl-[9px] text-[#5A7184] hover:bg-[#F5F8FA] hover:text-[#1A2E4A]'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Settings Nav */}
        <div className="mb-2 mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9EB4C4]">
          SETTINGS
        </div>
        <ul className="space-y-0.5">
          {settingsNavItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors ${
                    active
                      ? 'border-l-[3px] border-[#0F3D7A] bg-[#E6EEF8] pl-[9px] text-[#0F3D7A]'
                      : 'border-l-[3px] border-transparent pl-[9px] text-[#5A7184] hover:bg-[#F5F8FA] hover:text-[#1A2E4A]'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#DDE6EE] px-5 py-4">
        <div className="font-en text-[10px] text-[#9EB4C4]">
          v0.1 beta
        </div>
      </div>
    </aside>
  )
}
