-- テニスギア口コミサイト Supabase スキーマ
-- カテゴリごとにテーブル分割、商品名は日本語/英語の両方を保持

-- =========================================
-- プロフィール用 enum
-- =========================================
create type tennis_level as enum (
  'beginner',
  'intermediate',
  'advanced',
  'tournament',
  'pro'
);

create type play_style as enum (
  'all_round',
  'aggressive_baseliner',
  'counter_puncher',
  'serve_and_volley',
  'net_rusher'
);

create type string_material as enum (
  'poly',        -- ポリエステル
  'multi',       -- マルチフィラメント
  'nylon',       -- ナイロン
  'gut',         -- ナチュラルガット
  'hybrid'       -- ハイブリッド
);

-- =========================================
-- プロフィール
-- =========================================
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
-- ブランド
-- =========================================
create table brands (
  id uuid primary key default gen_random_uuid(),
  name_ja text,
  name_en text,
  created_at timestamptz not null default now(),
  constraint brands_name_required
    check (coalesce(name_ja, name_en) is not null)
);

alter table brands enable row level security;

create policy "brands are viewable by everyone"
  on brands for select using (true);

-- =========================================
-- ラケット
-- =========================================
create table racquets (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete restrict,
  name_ja text,
  name_en text,
  head_size_sqin numeric(4,1),      -- 例: 97.0
  weight_g       numeric(5,1),      -- 例: 315.0
  balance_mm     numeric(4,1),      -- 例: 320.0
  stiffness_ra   numeric(3,1),      -- 例: 65.0
  description_ja text,
  description_en text,
  image_url text,
  created_at timestamptz not null default now(),
  constraint racquets_name_required
    check (coalesce(name_ja, name_en) is not null)
);

create index racquets_brand_idx on racquets(brand_id);
alter table racquets enable row level security;

create policy "racquets are viewable by everyone"
  on racquets for select using (true);

-- =========================================
-- ストリング
-- =========================================
create table strings (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete restrict,
  name_ja text,
  name_en text,
  gauge_mm numeric(3,2),            -- 例: 1.25
  material string_material,
  description_ja text,
  description_en text,
  image_url text,
  created_at timestamptz not null default now(),
  constraint strings_name_required
    check (coalesce(name_ja, name_en) is not null)
);

create index strings_brand_idx on strings(brand_id);
alter table strings enable row level security;

create policy "strings are viewable by everyone"
  on strings for select using (true);

-- =========================================
-- ラケット口コミ
-- =========================================
create table racquet_reviews (
  id uuid primary key default gen_random_uuid(),
  racquet_id uuid not null references racquets(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  unique(racquet_id, user_id)
);

create index racquet_reviews_gear_idx on racquet_reviews(racquet_id, created_at desc);
create index racquet_reviews_user_idx on racquet_reviews(user_id, created_at desc);
alter table racquet_reviews enable row level security;

create policy "racquet_reviews are viewable by everyone"
  on racquet_reviews for select using (true);
create policy "users can insert own racquet_review"
  on racquet_reviews for insert with check (auth.uid() = user_id);
create policy "users can update own racquet_review"
  on racquet_reviews for update using (auth.uid() = user_id);
create policy "users can delete own racquet_review"
  on racquet_reviews for delete using (auth.uid() = user_id);

-- =========================================
-- ストリング口コミ
-- =========================================
create table string_reviews (
  id uuid primary key default gen_random_uuid(),
  string_id uuid not null references strings(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  created_at timestamptz not null default now(),
  unique(string_id, user_id)
);

create index string_reviews_gear_idx on string_reviews(string_id, created_at desc);
create index string_reviews_user_idx on string_reviews(user_id, created_at desc);
alter table string_reviews enable row level security;

create policy "string_reviews are viewable by everyone"
  on string_reviews for select using (true);
create policy "users can insert own string_review"
  on string_reviews for insert with check (auth.uid() = user_id);
create policy "users can update own string_review"
  on string_reviews for update using (auth.uid() = user_id);
create policy "users can delete own string_review"
  on string_reviews for delete using (auth.uid() = user_id);

-- =========================================
-- 集計ビュー
-- =========================================
create view racquet_stats as
  select
    g.id as racquet_id,
    count(r.id) as review_count,
    coalesce(round(avg(r.rating)::numeric, 2), 0) as avg_rating
  from racquets g
  left join racquet_reviews r on r.racquet_id = g.id
  group by g.id;

create view string_stats as
  select
    g.id as string_id,
    count(r.id) as review_count,
    coalesce(round(avg(r.rating)::numeric, 2), 0) as avg_rating
  from strings g
  left join string_reviews r on r.string_id = g.id
  group by g.id;
