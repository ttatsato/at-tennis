import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewSection } from "@/app/_components/ReviewSection";
import {
  displayName,
  displaySub,
  type RacquetWithBrand,
  type ReviewWithAuthor,
} from "@/lib/types";
import { deleteRacquetReview, postRacquetReview } from "./actions";

export default async function RacquetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ posted?: string; error?: string }>;
}) {
  const { id } = await params;
  const { posted, error } = await searchParams;

  const supabase = await createClient();

  const { data: racquet } = await supabase
    .from("racquets")
    .select(
      "id, brand_id, name_ja, name_en, head_size_sqin, weight_g, balance_mm, stiffness_ra, description_ja, description_en, image_url, created_at, brands(id, name_ja, name_en)",
    )
    .eq("id", id)
    .maybeSingle<RacquetWithBrand>();

  if (!racquet) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: reviews } = await supabase
    .from("racquet_reviews")
    .select(
      "id, user_id, rating, title, body, created_at, profiles(display_name, level, style)",
    )
    .eq("racquet_id", id)
    .order("created_at", { ascending: false })
    .returns<ReviewWithAuthor[]>();

  const list = reviews ?? [];
  const avg =
    list.length > 0
      ? (list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(1)
      : "-";

  const sub = displaySub(racquet);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/racquets" className="text-sm text-emerald-700 hover:underline">
        ← ラケット一覧に戻る
      </Link>

      <section className="bg-white border border-zinc-200 rounded-lg p-6">
        <div className="text-xs text-zinc-500">
          {displayName(racquet.brands)}
        </div>
        <h1 className="text-2xl font-bold mt-1">{displayName(racquet)}</h1>
        {sub && <div className="text-sm text-zinc-500">{sub}</div>}

        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {racquet.head_size_sqin != null && (
            <Spec label="ヘッドサイズ" value={`${racquet.head_size_sqin} sq.in`} />
          )}
          {racquet.weight_g != null && (
            <Spec label="重量" value={`${racquet.weight_g} g`} />
          )}
          {racquet.balance_mm != null && (
            <Spec label="バランス" value={`${racquet.balance_mm} mm`} />
          )}
          {racquet.stiffness_ra != null && (
            <Spec label="硬さ(RA)" value={`${racquet.stiffness_ra}`} />
          )}
        </dl>

        {(racquet.description_ja || racquet.description_en) && (
          <p className="mt-4 text-sm text-zinc-700 whitespace-pre-wrap">
            {racquet.description_ja ?? racquet.description_en}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3 text-sm">
          <span className="text-amber-500 text-lg">★ {avg}</span>
          <span className="text-zinc-500">({list.length}件の口コミ)</span>
        </div>
      </section>

      <ReviewSection
        gearId={racquet.id}
        reviews={list}
        currentUserId={user?.id ?? null}
        postAction={postRacquetReview}
        deleteAction={deleteRacquetReview}
        posted={posted === "1"}
        error={error}
      />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
