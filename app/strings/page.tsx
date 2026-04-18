import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  STRING_MATERIAL_LABEL,
  displayName,
  displaySub,
  type StringWithBrand,
} from "@/lib/types";

type Stats = { string_id: string; review_count: number; avg_rating: number };

export default async function StringsPage() {
  const supabase = await createClient();

  const { data: strings } = await supabase
    .from("strings")
    .select(
      "id, brand_id, name_ja, name_en, gauge_mm, material, description_ja, description_en, image_url, created_at, brands(id, name_ja, name_en)",
    )
    .order("created_at", { ascending: false })
    .returns<StringWithBrand[]>();

  const ids = (strings ?? []).map((s) => s.id);
  const { data: stats } = ids.length
    ? await supabase
        .from("string_stats")
        .select("string_id, review_count, avg_rating")
        .in("string_id", ids)
        .returns<Stats[]>()
    : { data: [] as Stats[] };
  const statsMap = new Map((stats ?? []).map((s) => [s.string_id, s]));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">ストリング</h1>
      <p className="text-sm text-zinc-500 mb-4">
        ストリングを選んで口コミを投稿・閲覧できます
      </p>

      {strings && strings.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {strings.map((s) => {
            const stat = statsMap.get(s.id);
            const sub = displaySub(s);
            return (
              <li key={s.id}>
                <Link
                  href={`/strings/${s.id}`}
                  className="block bg-white border border-zinc-200 rounded-lg p-4 hover:border-emerald-500 transition"
                >
                  <div className="text-xs text-zinc-500">
                    {displayName(s.brands)}
                  </div>
                  <div className="font-semibold mt-0.5">{displayName(s)}</div>
                  {sub && <div className="text-xs text-zinc-500">{sub}</div>}
                  <div className="mt-2 text-xs text-zinc-600 flex flex-wrap gap-x-3 gap-y-0.5">
                    {s.gauge_mm != null && (
                      <span>ゲージ {s.gauge_mm.toFixed(2)}mm</span>
                    )}
                    {s.material && (
                      <span>{STRING_MATERIAL_LABEL[s.material]}</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-amber-500">
                      ★ {stat?.avg_rating?.toFixed(1) ?? "-"}
                    </span>
                    <span className="text-zinc-500">
                      ({stat?.review_count ?? 0}件)
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">
          ストリングが登録されていません。
        </p>
      )}
    </div>
  );
}
