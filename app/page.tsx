import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  CATEGORY_LABEL,
  type Gear,
  type GearCategory,
} from "@/lib/types";

const CATEGORIES: GearCategory[] = [
  "racquet",
  "string",
  "shoes",
  "apparel",
  "setting",
];

type GearStats = { gear_id: string; review_count: number; avg_rating: number };

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = CATEGORIES.includes(category as GearCategory)
    ? (category as GearCategory)
    : null;

  const supabase = await createClient();
  let query = supabase
    .from("gears")
    .select("*")
    .order("created_at", { ascending: false });
  if (active) query = query.eq("category", active);

  const { data: gears } = await query.returns<Gear[]>();

  const ids = (gears ?? []).map((g) => g.id);
  const { data: stats } = ids.length
    ? await supabase
        .from("gear_stats")
        .select("gear_id, review_count, avg_rating")
        .in("gear_id", ids)
        .returns<GearStats[]>()
    : { data: [] as GearStats[] };
  const statsMap = new Map((stats ?? []).map((s) => [s.gear_id, s]));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">テニスギア口コミ</h1>
      <p className="text-sm text-zinc-500 mb-4">
        ラケット・ストリング・シューズ・ウェア・セッティングの口コミ
      </p>

      <div className="flex gap-2 flex-wrap mb-6">
        <CategoryChip href="/" label="すべて" active={active === null} />
        {CATEGORIES.map((c) => (
          <CategoryChip
            key={c}
            href={`/?category=${c}`}
            label={CATEGORY_LABEL[c]}
            active={active === c}
          />
        ))}
      </div>

      {gears && gears.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {gears.map((g) => {
            const s = statsMap.get(g.id);
            return (
              <li key={g.id}>
                <Link
                  href={`/gears/${g.id}`}
                  className="block bg-white border border-zinc-200 rounded-lg p-4 hover:border-emerald-500 transition"
                >
                  <div className="text-xs text-emerald-700 font-medium mb-1">
                    {CATEGORY_LABEL[g.category]}
                  </div>
                  <div className="font-semibold">{g.brand}</div>
                  <div className="text-sm text-zinc-800">{g.name}</div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-amber-500">
                      ★ {s?.avg_rating?.toFixed(1) ?? "-"}
                    </span>
                    <span className="text-zinc-500">
                      ({s?.review_count ?? 0}件)
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">
          ギアがまだ登録されていません。
        </p>
      )}
    </div>
  );
}

function CategoryChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-full px-3 py-1 text-sm border " +
        (active
          ? "bg-emerald-600 text-white border-emerald-600"
          : "bg-white text-zinc-700 border-zinc-300 hover:border-emerald-500")
      }
    >
      {label}
    </Link>
  );
}
