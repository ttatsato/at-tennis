import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">
          テニスギア口コミ
        </h1>
        <p className="mt-2 text-zinc-600">
          ラケットとストリングの口コミを投稿・閲覧できます。
          投稿者のテニスレベル・プレースタイル付き。
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CategoryCard
          href="/racquets"
          title="ラケット"
          sub="Racquets"
          body="ヘッドサイズ・重量・バランス・硬さで比較"
        />
        <CategoryCard
          href="/strings"
          title="ストリング"
          sub="Strings"
          body="ゲージ・素材で絞り込み、打感の違いをレビュー"
        />
      </section>
    </div>
  );
}

function CategoryCard({
  href,
  title,
  sub,
  body,
}: {
  href: string;
  title: string;
  sub: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="block bg-white border border-zinc-200 rounded-lg p-6 hover:border-emerald-500 hover:shadow-sm transition"
    >
      <div className="text-xs text-emerald-700 font-medium">{sub}</div>
      <h2 className="mt-1 text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{body}</p>
      <div className="mt-3 text-sm text-emerald-700">一覧を見る →</div>
    </Link>
  );
}
