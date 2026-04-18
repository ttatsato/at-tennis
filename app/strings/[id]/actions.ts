"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function postStringReview(formData: FormData) {
  const stringId = String(formData.get("gear_id") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!stringId || !title || !body || rating < 1 || rating > 5) {
    redirect(`/strings/${stringId}?error=invalid`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?notice=login-required`);

  const { error } = await supabase.from("string_reviews").upsert(
    {
      string_id: stringId,
      user_id: user.id,
      rating,
      title,
      body,
    },
    { onConflict: "string_id,user_id" },
  );

  if (error) {
    redirect(`/strings/${stringId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/strings/${stringId}`);
  redirect(`/strings/${stringId}?posted=1`);
}

export async function deleteStringReview(formData: FormData) {
  const reviewId = String(formData.get("review_id") ?? "");
  if (!reviewId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("string_reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .select("string_id")
    .maybeSingle();

  if (data?.string_id) revalidatePath(`/strings/${data.string_id}`);
  redirect(`/strings/${data?.string_id ?? ""}`);
}
