import Link from "next/link";
import {
  LEVEL_LABEL,
  STYLE_LABEL,
  type ReviewWithAuthor,
} from "@/lib/types";

type Props = {
  gearId: string;
  reviews: ReviewWithAuthor[];
  currentUserId: string | null;
  postAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
  posted?: boolean;
  error?: string;
};

export function ReviewSection({
  gearId,
  reviews,
  currentUserId,
  postAction,
  deleteAction,
  posted,
  error,
}: Props) {
  const myReview =
    currentUserId != null
      ? reviews.find((r) => r.user_id === currentUserId) ?? null
      : null;

  return (
    <>
      <section>
        <h2 className="font-bold text-lg mb-3">口コミを投稿</h2>
        {currentUserId ? (
          <>
            {posted && (
              <p className="mb-3 text-sm text-emerald-700">投稿しました。</p>
            )}
            {error && (
              <p className="mb-3 text-sm text-red-600">エラー: {error}</p>
            )}
            <ReviewForm
              gearId={gearId}
              existing={myReview}
              postAction={postAction}
            />
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
        {reviews.length > 0 ? (
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
                {currentUserId === r.user_id && (
                  <form action={deleteAction} className="mt-3">
                    <input type="hidden" name="review_id" value={r.id} />
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
    </>
  );
}

function ReviewForm({
  gearId,
  existing,
  postAction,
}: {
  gearId: string;
  existing: ReviewWithAuthor | null;
  postAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <form
      action={postAction}
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
