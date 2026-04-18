export type GearCategory =
  | "racquet"
  | "string"
  | "shoes"
  | "apparel"
  | "setting";

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

export const CATEGORY_LABEL: Record<GearCategory, string> = {
  racquet: "ラケット",
  string: "ストリング",
  shoes: "シューズ",
  apparel: "ウェア",
  setting: "セッティング",
};

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

export type Gear = {
  id: string;
  category: GearCategory;
  brand: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
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
  gear_id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
};

export type ReviewWithAuthor = Review & {
  profiles: Pick<Profile, "display_name" | "level" | "style"> | null;
};
