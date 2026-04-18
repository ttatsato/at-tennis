import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewSection } from "@/app/_components/ReviewSection";
import {
  STRING_MATERIAL_LABEL,
  displayName,
  displaySub,
  type ReviewWithAuthor,
  type StringWithBrand,
} from "@/lib/types";
import { deleteStringReview, postStringReview } from "./actions";

export default async function StringDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ posted?: string; error?: string }>;
}) {
  const { id } = await params;
  const { posted, error } = await searchParams;

  const supabase = await createClient();

  const { data: stringGear } = await supabase
    .from("strings")
    .select(
      "id, brand_id, name_ja, name_en, gauge_mm, material, description_ja, description_en, image_url, created_at, brands(id, name_ja, name_en)",
    )
    .eq("id", id)
    .maybeSingle<StringWithBrand>();

  if (!stringGear) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: reviews } = await supabase
    .from("string_reviews")
    .select(
      "id, user_id, rating, title, body, created_at, profiles(display_name, level, style)",
    )
    .eq("string_id", id)
    .order("created_at", { ascending: false })
    .returns<ReviewWithAuthor[]>();

  const list = reviews ?? [];
  const avg =
    list.length > 0
      ? (list.reduce((sum, r) => sum + r.rating, 0) / list.length).toFixed(1)
      : "-";

  const sub = displaySub(stringGear);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/strings" className="text-sm text-emerald-700 hover:underline">
        ← ストリング一覧に戻る
      </Link>

      <section className="bg-white border border-zinc-200 rounded-lg p-6">
        <div className="text-xs text-zinc-500">
          {displayName(stringGear.brands)}
        </div>
        <h1 className="text-2xl font-bold mt-1">{displayName(stringGear)}</h1>
        {sub && <div className="text-sm text-zinc-500">{sub}</div>}

        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {stringGear.gauge_mm != null && (
            <Spec label="ゲージ" value={`${stringGear.gauge_mm.toFixed(2)} mm`} />
          )}
          {stringGear.material && (
            <Spec
              label="素材"
              value={STRING_MATERIAL_LABEL[stringGear.material]}
            />
          )}
        </dl>

        {(stringGear.description_ja || stringGear.description_en) && (
          <p className="mt-4 text-sm text-zinc-700 whitespace-pre-wrap">
            {stringGear.description_ja ?? stringGear.description_en}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3 text-sm">
          <span className="text-amber-500 text-lg">★ {avg}</span>
          <span className="text-zinc-500">({list.length}件の口コミ)</span>
        </div>
      </section>

      <ReviewSection
        gearId={stringGear.id}
        reviews={list}
        currentUserId={user?.id ?? null}
        postAction={postStringReview}
        deleteAction={deleteStringReview}
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
