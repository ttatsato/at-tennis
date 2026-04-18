"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PlayStyle, TennisLevel } from "@/lib/types";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const display_name = String(formData.get("display_name") ?? "").trim();
  const levelRaw = String(formData.get("level") ?? "");
  const styleRaw = String(formData.get("style") ?? "");
  const bio = String(formData.get("bio") ?? "").trim();

  const level: TennisLevel | null =
    levelRaw === "" ? null : (levelRaw as TennisLevel);
  const style: PlayStyle | null =
    styleRaw === "" ? null : (styleRaw as PlayStyle);

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      display_name: display_name || user.email || "anonymous",
      level,
      style,
      bio: bio || null,
    });

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/profile?saved=1");
}
