import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LEVEL_LABEL, STYLE_LABEL, type Profile } from "@/lib/types";
import { updateProfile } from "./actions";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  return (
    <div className="max-w-xl mx-auto bg-white border border-zinc-200 rounded-lg p-6">
      <h1 className="text-xl font-bold mb-1">プロフィール</h1>
      <p className="text-sm text-zinc-500 mb-4">{user.email}</p>

      {saved === "1" && (
        <p className="mb-3 text-sm text-emerald-700">保存しました。</p>
      )}
      {error && <p className="mb-3 text-sm text-red-600">エラー: {error}</p>}

      <form action={updateProfile} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          表示名
          <input
            name="display_name"
            required
            defaultValue={profile?.display_name ?? ""}
            className="border border-zinc-300 rounded px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          テニスレベル
          <select
            name="level"
            defaultValue={profile?.level ?? ""}
            className="border border-zinc-300 rounded px-3 py-2 bg-white"
          >
            <option value="">未選択</option>
            {Object.entries(LEVEL_LABEL).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          プレースタイル
          <select
            name="style"
            defaultValue={profile?.style ?? ""}
            className="border border-zinc-300 rounded px-3 py-2 bg-white"
          >
            <option value="">未選択</option>
            {Object.entries(STYLE_LABEL).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          自己紹介
          <textarea
            name="bio"
            rows={3}
            defaultValue={profile?.bio ?? ""}
            className="border border-zinc-300 rounded px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="bg-emerald-600 text-white rounded py-2 font-medium hover:bg-emerald-700"
        >
          保存
        </button>
      </form>
    </div>
  );
}
