import Link from "next/link";
import { signUp } from "../auth/actions";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-sm mx-auto mt-8 bg-white border border-zinc-200 rounded-lg p-6">
      <h1 className="text-xl font-bold mb-4">新規登録</h1>
      {error && (
        <p className="mb-3 text-sm text-red-600">エラー: {error}</p>
      )}
      <form action={signUp} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          表示名
          <input
            name="display_name"
            required
            className="border border-zinc-300 rounded px-3 py-2"
          />
        </label>
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
          パスワード（6文字以上）
          <input
            type="password"
            name="password"
            minLength={6}
            required
            className="border border-zinc-300 rounded px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="bg-emerald-600 text-white rounded py-2 font-medium hover:bg-emerald-700"
        >
          登録する
        </button>
      </form>
      <p className="mt-4 text-sm text-zinc-500">
        既にアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-emerald-600 hover:underline">
          ログイン
        </Link>
      </p>
    </div>
  );
}
