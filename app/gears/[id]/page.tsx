import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  LEVEL_LABEL,
  STYLE_LABEL,
  type GearWithRelations,
  type ReviewWithAuthor,
} from "@/lib/types";
import { deleteReview, postReview } from "./actions";

export default async function GearDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ posted?: string; error?: string }>;
}) {
  const { id } = await params;
  const { posted, error } = await searchParams;

  const supabase = await createClient();

  const { data: gear } = await supabase
    .from("gears")
    .select(
      "id, category_code, brand_id, name, description, image_url, gauge_mm, created_at, categories(code, label), brands(id, name)",
    )
    .eq("id", id)
    .maybeSingle<GearWithRelations>();

  if (!gear) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      "id, gear_id, user_id, rating, title, body, created_at, profiles(display_name, level, style)",
    )
    .eq("gear_id", id)
    .order("created_at", { ascending: false })
    .returns<ReviewWithAuthor[]>();

  const myReview = reviews?.find((r) => r.user_id === user?.id) ?? null;

  const reviewCount = reviews?.length ?? 0;
  const avg =
    reviewCount > 0
      ? (reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
      : "-";

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="text-sm text-emerald-700 hover:underline">
        ← 一覧に戻る
      </Link>

      <section className="bg-white border border-zinc-200 rounded-lg p-6">
        <div className="text-xs text-emerald-700 font-medium">
          {gear.categories?.label ?? gear.category_code}
        </div>
        <h1 className="text-2xl font-bold mt-1">
          {gear.brands?.name ?? "-"}
        </h1>
        <div className="text-lg text-zinc-800">
          {gear.name}
          {gear.gauge_mm != null && (
            <span className="ml-2 text-sm text-zinc-500">
              ゲージ {gear.gauge_mm.toFixed(2)}mm
            </span>
          )}
        </div>
        {gear.description && (
          <p className="mt-3 text-sm text-zinc-700 whitespace-pre-wrap">
            {gear.description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-3 text-sm">
          <span className="text-amber-500 text-lg">★ {avg}</span>
          <span className="text-zinc-500">({reviewCount}件の口コミ)</span>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3">口コミを投稿</h2>
        {user ? (
          <>
            {posted === "1" && (
              <p className="mb-3 text-sm text-emerald-700">投稿しました。</p>
            )}
            {error && (
              <p className="mb-3 text-sm text-red-600">エラー: {error}</p>
            )}
            <ReviewForm gearId={gear.id} existing={myReview} />
          </>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-lg p-4 text-sm">
            口コミを投稿するには{" "}
            <Link href="/login" className="text-emerald-600 hover:underline">
              ログイン
            </Link>{" "}
            してください。
          </div>
        )}
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3">口コミ一覧</h2>
        {reviews && reviews.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="bg-white border border-zinc-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-amber-500 font-medium">
                    {"★".repeat(r.rating)}
                    <span className="text-zinc-300">
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </div>
                  <time className="text-xs text-zinc-500">
                    {new Date(r.created_at).toLocaleDateString("ja-JP")}
                  </time>
                </div>
                <div className="mt-1 font-semibold">{r.title}</div>
                <p className="mt-1 text-sm text-zinc-800 whitespace-pre-wrap">
                  {r.body}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-600">
                  <span className="font-medium text-zinc-700">
                    {r.profiles?.display_name ?? "匿名"}
                  </span>
                  {r.profiles?.level && (
                    <span className="bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5">
                      {LEVEL_LABEL[r.profiles.level]}
                    </span>
                  )}
                  {r.profiles?.style && (
                    <span className="bg-sky-50 text-sky-700 rounded-full px-2 py-0.5">
                      {STYLE_LABEL[r.profiles.style]}
                    </span>
                  )}
                </div>
                {user?.id === r.user_id && (
                  <form action={deleteReview} className="mt-3">
                    <input type="hidden" name="review_id" value={r.id} />
                    <input type="hidden" name="gear_id" value={gear.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-600 hover:underline"
                    >
                      削除
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">
            まだ口コミがありません。最初の投稿者になりましょう。
          </p>
        )}
      </section>
    </div>
  );
}

function ReviewForm({
  gearId,
  existing,
}: {
  gearId: string;
  existing: ReviewWithAuthor | null;
}) {
  return (
    <form
      action={postReview}
      className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-col gap-3"
    >
      <input type="hidden" name="gear_id" value={gearId} />

      <label className="flex flex-col gap-1 text-sm">
        評価
        <select
          name="rating"
          defaultValue={existing?.rating ?? 5}
          className="border border-zinc-300 rounded px-3 py-2 bg-white w-32"
          required
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)} ({n})
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        タイトル
        <input
          name="title"
          required
          maxLength={80}
          defaultValue={existing?.title ?? ""}
          className="border border-zinc-300 rounded px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        本文
        <textarea
          name="body"
          required
          rows={5}
          defaultValue={existing?.body ?? ""}
          className="border border-zinc-300 rounded px-3 py-2"
        />
      </label>

      <button
        type="submit"
        className="bg-emerald-600 text-white rounded py-2 font-medium hover:bg-emerald-700 self-start px-6"
      >
        {existing ? "更新する" : "投稿する"}
      </button>
      {existing && (
        <p className="text-xs text-zinc-500">
          既に投稿済みです。再送信すると内容が上書きされます。
        </p>
      )}
    </form>
  );
}
