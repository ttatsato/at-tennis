"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim();

  if (!email || !password || !displayName) {
    redirect("/signup?error=missing");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    redirect(`/signup?error=${encodeURIComponent(error?.message ?? "failed")}`);
  }

  // 自動確認オフ時はセッションなしの可能性あり
  if (data.session) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      display_name: displayName,
    });
    if (profileError) {
      redirect(`/signup?error=${encodeURIComponent(profileError.message)}`);
    }
    redirect("/profile");
  }

  redirect("/login?notice=confirm-email");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
