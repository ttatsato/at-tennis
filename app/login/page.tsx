import Link from "next/link";
import { signIn } from "../auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;

  return (
    <div className="max-w-sm mx-auto mt-8 bg-white border border-zinc-200 rounded-lg p-6">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>
      {notice === "confirm-email" && (
        <p className="mb-3 text-sm text-emerald-700">
          登録メールを確認してください。
        </p>
      )}
      {error && (
        <p className="mb-3 text-sm text-red-600">エラー: {error}</p>
      )}
      <form action={signIn} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          メールアドレス
          <input
            type="email"
            name="email"
            required
            className="border border-zinc-300 rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          パスワード
          <input
            type="password"
            name="password"
            required
            className="border border-zinc-300 rounded px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="bg-emerald-600 text-white rounded py-2 font-medium hover:bg-emerald-700"
        >
          ログイン
        </button>
      </form>
      <p className="mt-4 text-sm text-zinc-500">
        アカウント未作成の方は{" "}
        <Link href="/signup" className="text-emerald-600 hover:underline">
          新規登録
        </Link>
      </p>
    </div>
  );
}
