import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./auth/actions";

export const metadata: Metadata = {
  title: "AT Tennis - テニスギア口コミ",
  description: "ラケット・ストリング・シューズ・ウェア・セッティングの口コミサイト",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b border-zinc-200 bg-white">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
            <Link href="/" className="font-bold text-lg tracking-tight">
              <span className="text-emerald-600">AT</span> Tennis
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/racquets" className="hover:text-emerald-600">
                ラケット
              </Link>
              <Link href="/strings" className="hover:text-emerald-600">
                ストリング
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="hover:text-emerald-600">
                    プロフィール
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="text-zinc-500 hover:text-zinc-900"
                    >
                      ログアウト
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="hover:text-emerald-600">
                    ログイン
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-emerald-600 text-white rounded-full px-3 py-1 hover:bg-emerald-700"
                  >
                    新規登録
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="border-t border-zinc-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-zinc-500">
            © AT Tennis
          </div>
        </footer>
      </body>
    </html>
  );
}
