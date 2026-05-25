import type { Metadata } from "next"
import { DM_Sans, Noto_Sans_JP } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Funrix Store Portal",
  description: "飲食店向けMEO + SNS統合ポータル",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${dmSans.variable} ${notoSansJP.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
