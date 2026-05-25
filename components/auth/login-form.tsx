"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません")
      setLoading(false)
      return
    }

    window.location.href = "/"
  }

  async function handleGoogleLogin() {
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError("Google認証に失敗しました")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8FA] p-4">
      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#0F3D7A] rounded-lg flex items-center justify-center mb-3">
            <span className="text-white text-2xl font-bold font-en">F</span>
          </div>
          <span className="text-lg font-semibold text-[#0F3D7A] font-en">
            Funrix Store Portal
          </span>
        </div>

        <h1 className="text-xl font-semibold text-[#1A2E4A] text-center mb-6">
          ログイン
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-1.5">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 border border-[#DDE6EE] rounded-lg text-sm outline-none focus:border-[#0F3D7A] focus:ring-2 focus:ring-[#0F3D7A]/20"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-[#374151] mb-1.5">
              パスワード
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full px-3 py-2.5 border border-[#DDE6EE] rounded-lg text-sm outline-none focus:border-[#0F3D7A] focus:ring-2 focus:ring-[#0F3D7A]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#0F3D7A] text-white rounded-lg text-sm font-semibold hover:bg-[#0A2D5E] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <div className="flex items-center my-6 gap-3">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="text-[13px] text-[#9CA3AF]">または</span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 bg-white text-[#374151] border border-[#D1D5DB] rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4" />
            <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.08 0-3.84-1.4-4.47-3.29H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853" />
            <path d="M4.51 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.68-2.07z" fill="#FBBC05" />
            <path d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4l2.68 2.07c.63-1.88 2.4-3.29 4.47-3.29z" fill="#EA4335" />
          </svg>
          Googleでログイン
        </button>
      </div>

      <p className="mt-8 text-xs text-[#9CA3AF] font-en">
        &copy; 2026 Funrix Inc.
      </p>
    </div>
  )
}
