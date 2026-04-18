"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function postReview(formData: FormData) {
  const gearId = String(formData.get("gear_id") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!gearId || !title || !body || rating < 1 || rating > 5) {
    redirect(`/gears/${gearId}?error=invalid`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?notice=login-required`);

  const { error } = await supabase.from("reviews").upsert(
    {
      gear_id: gearId,
      user_id: user.id,
      rating,
      title,
      body,
    },
    { onConflict: "gear_id,user_id" },
  );

  if (error) {
    redirect(`/gears/${gearId}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/gears/${gearId}`);
  redirect(`/gears/${gearId}?posted=1`);
}

export async function deleteReview(formData: FormData) {
  const reviewId = String(formData.get("review_id") ?? "");
  const gearId = String(formData.get("gear_id") ?? "");
  if (!reviewId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("reviews").delete().eq("id", reviewId).eq("user_id", user.id);
  revalidatePath(`/gears/${gearId}`);
  redirect(`/gears/${gearId}`);
}
