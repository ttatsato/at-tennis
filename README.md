# AT Tennis

テニスギア（ラケット・ストリング・シューズ・ウェア・セッティング）の口コミ投稿サイト。@cosme のテニス版。

## 技術スタック

- Next.js 16 (App Router, Server Actions)
- TypeScript + Tailwind CSS v4
- Supabase (Auth + Postgres + RLS)

## 機能 (MVP)

- 新規登録・ログイン (Supabase Auth, email + password)
- プロフィール編集（テニスレベル / プレースタイル）
- ギア一覧 / カテゴリ絞り込み
- **ギア詳細ページで口コミ投稿・編集・削除**（1ユーザー1ギア1件）
- 投稿者のレベル・プレースタイルが口コミに表示される

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
  page.tsx                # ギア一覧（カテゴリ絞り込み）
  gears/[id]/
    page.tsx              # ギア詳細 + 口コミ一覧 + 投稿フォーム
    actions.ts            # 口コミ投稿・削除の Server Action
  login/ signup/          # 認証ページ
  profile/                # レベル/プレースタイル編集
  auth/actions.ts         # サインアップ・ログイン・ログアウト
lib/
  supabase/               # client / server / proxy 用の Supabase クライアント
  types.ts                # 型とラベルマップ
proxy.ts                  # Supabase セッション更新 (Next.js 16 の proxy)
supabase/
  schema.sql              # DDL + RLS ポリシー
  seed.sql                # 初期データ
```
