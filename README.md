# AT Tennis

テニスギアの口コミ投稿サイト。@cosme のテニス版。MVP ではラケットとストリングに対応。

## 技術スタック

- Next.js 16 (App Router, Server Actions)
- TypeScript + Tailwind CSS v4
- Supabase (Auth + Postgres + RLS)

## 機能 (MVP)

- 新規登録・ログイン (Supabase Auth, email + password)
- プロフィール編集（テニスレベル / プレースタイル）
- ラケット / ストリングの一覧・詳細ページ
- **詳細ページで口コミ投稿・編集・削除**（1ユーザー1商品1件）
- 投稿者のレベル・プレースタイルが口コミに表示される
- 商品名・ブランド名は日本語/英語の両方を保持

## データ設計

カテゴリごとにテーブルを分割（class-table 分割）:

- `brands (id, name_ja, name_en)`
- `racquets (id, brand_id, name_ja, name_en, head_size_sqin, weight_g, balance_mm, stiffness_ra, …)`
- `strings  (id, brand_id, name_ja, name_en, gauge_mm, material, …)`
- `racquet_reviews (id, racquet_id FK, user_id FK, rating, title, body)`
- `string_reviews  (id, string_id FK,  user_id FK, rating, title, body)`
- `profiles (id, display_name, level, style, bio)`

集計は `racquet_stats` / `string_stats` ビュー。口コミは RLS で本人のみ編集可。

## セットアップ

### 1. Supabase プロジェクトを作成

[supabase.com](https://supabase.com) でプロジェクトを作成し、SQL Editor から以下を順に実行する。

1. `supabase/schema.sql`（テーブル・型・RLS）
2. `supabase/seed.sql`（初期ギアデータ）

### 2. 環境変数を設定

```bash
cp .env.local.example .env.local
# Supabase の Project URL と anon key を記入
```

### 3. 依存インストール & 起動

```bash
npm install
npm run dev
```

http://localhost:3000 にアクセス。

## ディレクトリ構成

```
app/
  page.tsx                      # ランディング
  racquets/page.tsx             # ラケット一覧
  racquets/[id]/page.tsx        # ラケット詳細 + 口コミ
  racquets/[id]/actions.ts      # ラケット口コミの Server Action
  strings/page.tsx              # ストリング一覧
  strings/[id]/page.tsx         # ストリング詳細 + 口コミ
  strings/[id]/actions.ts       # ストリング口コミの Server Action
  _components/ReviewSection.tsx # 共通の口コミ表示・投稿フォーム
  login/ signup/ profile/       # 認証・プロフィール
  auth/actions.ts               # サインアップ・ログイン・ログアウト
lib/
  supabase/                     # client / server / proxy 用の Supabase クライアント
  types.ts                      # 型・ラベル・表示ヘルパ
proxy.ts                        # Supabase セッション更新 (Next.js 16 の proxy)
supabase/
  schema.sql                    # DDL + RLS ポリシー + 集計ビュー
  seed.sql                      # 初期データ
```
