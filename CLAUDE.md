# Funrix Store Portal (FSP) — CLAUDE.md

## プロダクト概要
飲食店オーナー向け「MEO + SNS統合ポータル」。
1画面でGBP順位計測・口コミ管理・Instagram/Threads/GBP同時投稿・AI文面生成を実現する。

## 技術スタック
| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| ホスティング | Vercel |
| DB | Supabase (PostgreSQL) + RLS必須 |
| 認証 | Supabase Auth (メール + Google OAuth) |
| AI | Claude API (claude-sonnet-4-5) |
| UI | TypeScript + Tailwind CSS 4 + shadcn/ui |
| アイコン | lucide-react |
| バリデーション | Zod |
| 状態管理 | Zustand |

## プロジェクト構造
```
app/
├── (auth)/login/       # ログインページ
├── (dashboard)/        # ダッシュボードレイアウト (サイドバー付き)
│   ├── page.tsx        # ダッシュボード (/)
│   ├── meo/            # MEO順位
│   ├── reviews/        # 口コミ管理
│   ├── posts/new/      # 投稿作成
│   ├── posts/calendar/ # 投稿カレンダー
│   ├── gbp/            # GBP情報管理
│   ├── reports/        # レポート
│   ├── stores/         # 店舗管理
│   └── settings/       # 設定
├── api/auth/callback/  # OAuth callback
components/
├── auth/               # 認証コンポーネント
├── layout/             # サイドバー, ヘッダー
├── posts/              # 投稿作成関連
├── ui/                 # shadcn/ui コンポーネント
lib/
├── supabase/           # client.ts, server.ts, middleware.ts
├── utils.ts            # cn() ユーティリティ
supabase/
└── migrations/         # DBマイグレーション
```

## デザインシステム
- ブランドカラー: `#0F3D7A` (ネイビーブルー)
- `/root/projects/DESIGN.md` に準拠
- 日本語フォント: Noto Sans JP
- 英語/数値フォント: DM Sans (class="font-en")

## 開発コマンド
```bash
pnpm dev          # 開発サーバー起動
pnpm build        # ビルド
pnpm start        # 本番起動
```

## Next.js 16 注意点
- middleware.ts → **proxy.ts** にリネームされている
- `cookies()` は **Promise** を返すので `await` 必須
- `params` も **Promise** なので `await params` 必須

## RLS必須ルール
- 全テーブルにRLS有効化
- `get_user_org_id()` で組織単位のアクセス制御
- 越境テスト必須

## 環境変数
- `.env.example` 参照
- 本番値は Vercel Environment Variables で管理
