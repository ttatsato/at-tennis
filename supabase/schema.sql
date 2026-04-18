-- テニスギア口コミサイト Supabase スキーマ
-- Supabase SQL Editor で実行してください

-- =========================================
-- プロフィール（auth.users を拡張）
-- =========================================
create type tennis_level as enum (
  'beginner',      -- 初級
  'intermediate',  -- 中級
  'advanced',      -- 上級
  'tournament',    -- 大会出場
  'pro'            -- プロ
);

create type play_style as enum (
  'all_round',     -- オールラウンダー
  'aggressive_baseliner', -- ベースライナー（攻撃型）
  'counter_puncher',      -- カウンターパンチャー
  'serve_and_volley',     -- サーブ&ボレー
  'net_rusher'            -- ネットラッシャー
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  level tennis_level,
  style play_style,
  bio text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are viewable by everyone"
  on profiles for select using (true);

create policy "users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "users can update own profile"
  on profiles for update using (auth.uid() = id);

-- =========================================
-- ギア
-- =========================================
create type gear_category as enum (
  'racquet',   -- ラケット
  'string',    -- ストリング
  'shoes',     -- シューズ
  'apparel',   -- ウェア
  'setting'    -- ラケット+ストリングのセッティング
);

create table gears (
  id uuid primary key default gen_random_uuid(),
  category gear_category not null,
  brand text not null,
  name text not null,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create index gears_category_idx on gears(category);

alter table gears enable row level security;

create policy "gears are viewable by everyone"
  on gears for select using (true);

-- =========================================
-- 口コミ
-- =========================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  gear_id uuid not null references gears(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  unique(gear_id, user_id)
);

create index reviews_gear_id_idx on reviews(gear_id, created_at desc);
create index reviews_user_id_idx on reviews(user_id, created_at desc);

alter table reviews enable row level security;

create policy "reviews are viewable by everyone"
  on reviews for select using (true);

create policy "users can insert own review"
  on reviews for insert with check (auth.uid() = user_id);

create policy "users can update own review"
  on reviews for update using (auth.uid() = user_id);

create policy "users can delete own review"
  on reviews for delete using (auth.uid() = user_id);

-- =========================================
-- 集計用ビュー
-- =========================================
create view gear_stats as
  select
    g.id as gear_id,
    count(r.id) as review_count,
    coalesce(round(avg(r.rating)::numeric, 2), 0) as avg_rating
  from gears g
  left join reviews r on r.gear_id = g.id
  group by g.id;
