import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { displayName, displaySub, type RacquetWithBrand } from "@/lib/types";

type Stats = { racquet_id: string; review_count: number; avg_rating: number };

export default async function RacquetsPage() {
  const supabase = await createClient();

  const { data: racquets } = await supabase
    .from("racquets")
    .select(
      "id, brand_id, name_ja, name_en, head_size_sqin, weight_g, balance_mm, stiffness_ra, description_ja, description_en, image_url, created_at, brands(id, name_ja, name_en)",
    )
    .order("created_at", { ascending: false })
    .returns<RacquetWithBrand[]>();

  const ids = (racquets ?? []).map((r) => r.id);
  const { data: stats } = ids.length
    ? await supabase
        .from("racquet_stats")
        .select("racquet_id, review_count, avg_rating")
        .in("racquet_id", ids)
        .returns<Stats[]>()
    : { data: [] as Stats[] };
  const statsMap = new Map((stats ?? []).map((s) => [s.racquet_id, s]));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">ラケット</h1>
      <p className="text-sm text-zinc-500 mb-4">
        ラケットを選んで口コミを投稿・閲覧できます
      </p>

      {racquets && racquets.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {racquets.map((r) => {
            const s = statsMap.get(r.id);
            const sub = displaySub(r);
            return (
              <li key={r.id}>
                <Link
                  href={`/racquets/${r.id}`}
                  className="block bg-white border border-zinc-200 rounded-lg p-4 hover:border-emerald-500 transition"
                >
                  <div className="text-xs text-zinc-500">
                    {displayName(r.brands)}
                  </div>
                  <div className="font-semibold mt-0.5">{displayName(r)}</div>
                  {sub && <div className="text-xs text-zinc-500">{sub}</div>}
                  <div className="mt-2 text-xs text-zinc-600 flex flex-wrap gap-x-3 gap-y-0.5">
                    {r.head_size_sqin != null && (
                      <span>ヘッド {r.head_size_sqin}sq</span>
                    )}
                    {r.weight_g != null && <span>{r.weight_g}g</span>}
                    {r.balance_mm != null && <span>{r.balance_mm}mm</span>}
                    {r.stiffness_ra != null && <span>RA {r.stiffness_ra}</span>}
                  </div>
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
        <p className="text-sm text-zinc-500">ラケットが登録されていません。</p>
      )}
    </div>
  );
}
