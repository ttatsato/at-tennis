"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function postRacquetReview(formData: FormData) {
  const racquetId = String(formData.get("gear_id") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!racquetId || !title || !body || rating < 1 || rating > 5) {
    redirect(`/racquets/${racquetId}?error=invalid`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?notice=login-required`);

  const { error } = await supabase.from("racquet_reviews").upsert(
    {
      racquet_id: racquetId,
      user_id: user.id,
      rating,
      title,
      body,
    },
    { onConflict: "racquet_id,user_id" },
  );

  if (error) {
    redirect(`/racquets/${racquetId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/racquets/${racquetId}`);
  redirect(`/racquets/${racquetId}?posted=1`);
}

export async function deleteRacquetReview(formData: FormData) {
  const reviewId = String(formData.get("review_id") ?? "");
  if (!reviewId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("racquet_reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .select("racquet_id")
    .maybeSingle();

  if (data?.racquet_id) revalidatePath(`/racquets/${data.racquet_id}`);
  redirect(`/racquets/${data?.racquet_id ?? ""}`);
}
