export type TennisLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "tournament"
  | "pro";

export type PlayStyle =
  | "all_round"
  | "aggressive_baseliner"
  | "counter_puncher"
  | "serve_and_volley"
  | "net_rusher";

export type StringMaterial = "poly" | "multi" | "nylon" | "gut" | "hybrid";

export const LEVEL_LABEL: Record<TennisLevel, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
  tournament: "大会出場",
  pro: "プロ",
};

export const STYLE_LABEL: Record<PlayStyle, string> = {
  all_round: "オールラウンダー",
  aggressive_baseliner: "アグレッシブ・ベースライナー",
  counter_puncher: "カウンターパンチャー",
  serve_and_volley: "サーブ&ボレー",
  net_rusher: "ネットラッシャー",
};

export const STRING_MATERIAL_LABEL: Record<StringMaterial, string> = {
  poly: "ポリエステル",
  multi: "マルチフィラメント",
  nylon: "ナイロン",
  gut: "ナチュラルガット",
  hybrid: "ハイブリッド",
};

export type Brand = {
  id: string;
  name_ja: string | null;
  name_en: string | null;
};

type NamedGear = {
  id: string;
  brand_id: string;
  name_ja: string | null;
  name_en: string | null;
  description_ja: string | null;
  description_en: string | null;
  image_url: string | null;
  created_at: string;
};

export type Racquet = NamedGear & {
  head_size_sqin: number | null;
  weight_g: number | null;
  balance_mm: number | null;
  stiffness_ra: number | null;
};

export type StringGear = NamedGear & {
  gauge_mm: number | null;
  material: StringMaterial | null;
};

export type RacquetWithBrand = Racquet & {
  brands: Brand | null;
};

export type StringWithBrand = StringGear & {
  brands: Brand | null;
};

export type Profile = {
  id: string;
  display_name: string;
  level: TennisLevel | null;
  style: PlayStyle | null;
  bio: string | null;
};

export type Review = {
  id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
};

export type ReviewWithAuthor = Review & {
  profiles: Pick<Profile, "display_name" | "level" | "style"> | null;
};

// 表示ヘルパ: 日本語優先、なければ英語
export function displayName(
  obj: { name_ja: string | null; name_en: string | null } | null | undefined,
): string {
  if (!obj) return "-";
  return obj.name_ja ?? obj.name_en ?? "-";
}

export function displaySub(
  obj: { name_ja: string | null; name_en: string | null } | null | undefined,
): string | null {
  if (!obj) return null;
  if (obj.name_ja && obj.name_en && obj.name_ja !== obj.name_en) {
    return obj.name_en;
  }
  return null;
}
