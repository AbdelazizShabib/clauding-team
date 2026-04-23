"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { categoryUpsertSchema } from "@/lib/validators/schemas";
import { revalidatePath } from "next/cache";

// ---------------------------------------------------------------------------
// Category CRUD
// ---------------------------------------------------------------------------

export async function upsertCategory(
  formData: {
    id?: string;
    name_en: string;
    name_ar: string;
    icon_name: string;
    default_specialty: string;
    default_priority: string;
  }
) {
  const parsed = categoryUpsertSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createServerSupabase();

  if (formData.id) {
    // Update existing
    const { error } = await supabase
      .from("categories")
      .update({
        name_en: parsed.data.name_en,
        name_ar: parsed.data.name_ar,
        icon_name: parsed.data.icon_name,
        default_specialty: parsed.data.default_specialty,
        default_priority: parsed.data.default_priority,
      })
      .eq("id", formData.id);
    if (error) return { error: error.message };
  } else {
    // Insert new
    const { error } = await supabase.from("categories").insert({
      name_en: parsed.data.name_en,
      name_ar: parsed.data.name_ar,
      icon_name: parsed.data.icon_name,
      default_specialty: parsed.data.default_specialty,
      default_priority: parsed.data.default_priority,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/governor/categories");
  return { success: true };
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("categories")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/governor/categories");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Cross-district approvals
// ---------------------------------------------------------------------------

export async function approveCrossDistrict(requestId: string) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.error("[approveCrossDistrict] No user from getUser()");
    return { error: "Unauthorized" };
  }

  // Fetch the request (simple query, no joins)
  const { data: request, error: fetchErr } = await supabase
    .from("cross_district_requests")
    .select("*")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchErr) {
    console.error("[approveCrossDistrict] fetch error:", fetchErr.message);
    return { error: "Request not found" };
  }
  if (!request) {
    console.error("[approveCrossDistrict] request is null for id:", requestId);
    return { error: "Request not found" };
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  const { error } = await supabase
    .from("cross_district_requests")
    .update({
      status: "approved" as const,
      decided_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    console.error("[approveCrossDistrict] update error:", error.message, error.details, error.hint);
    return { error: error.message };
  }

  // Notify the DM
  const { error: notifErr } = await supabase.from("notifications").insert({
    user_id: request.requesting_dm_id,
    type: "cross_district_decision" as const,
    title_en: "Cross-district access approved",
    title_ar: "تم الموافقة على الوصول عبر الأقسام",
    body_en: "Your cross-district access request has been approved. Access expires in 24 hours.",
    body_ar: "تم الموافقة على طلبك للوصول عبر الأقسام. تنتهي الصلاحية خلال ٢٤ ساعة.",
    link_url: "/manager",
  });
  if (notifErr) {
    console.error("[approveCrossDistrict] notification error:", notifErr.message);
  }

  // Revalidate the DM's queue so they see the newly granted access
  revalidatePath("/manager", "layout");
  revalidatePath("/[locale]/manager", "layout");

  revalidatePath("/governor/cross-district-approvals");
  return { success: true };
}

export async function rejectCrossDistrict(requestId: string, note?: string) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: request, error: fetchErr } = await supabase
    .from("cross_district_requests")
    .select("requesting_dm_id")
    .eq("id", requestId)
    .single();

  if (fetchErr || !request) return { error: "Request not found" };

  const { error } = await supabase
    .from("cross_district_requests")
    .update({
      status: "rejected" as const,
      decided_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) return { error: error.message };

  await supabase.from("notifications").insert({
    user_id: request.requesting_dm_id,
    type: "cross_district_decision" as const,
    title_en: "Cross-district access rejected",
    title_ar: "تم رفض طلب الوصول عبر الأقسام",
    body_en: note
      ? `Your request was rejected. Note: ${note}`
      : "Your cross-district access request was rejected.",
    body_ar: note
      ? `تم رفض طلبك. ملاحظة: ${note}`
      : "تم رفض طلبك للوصول عبر الأقسام.",
    link_url: "/manager",
  });

  revalidatePath("/governor/cross-district-approvals");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Report overrides
// ---------------------------------------------------------------------------

export async function overridePublicFlag(reportId: string, isPublic: boolean) {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("reports")
    .update({ is_public: isPublic })
    .eq("id", reportId);
  if (error) return { error: error.message };
  revalidatePath(`/governor/situation-room/${reportId}`);
  return { success: true };
}

export async function addGovernorNote(reportId: string, noteText: string) {
  const supabase = await createServerSupabase();

  // Find the DM for the report's district
  const { data: report } = await supabase
    .from("reports")
    .select("district_id")
    .eq("id", reportId)
    .single();

  if (!report) return { error: "Report not found" };

  const { data: dm } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "district_manager" as const)
    .eq("district_id", report.district_id)
    .limit(1)
    .single();

  if (!dm) return { error: "District manager not found" };

  const { error } = await supabase.from("notifications").insert({
    user_id: dm.id,
    type: "generic" as const,
    title_en: "Governor comment on report",
    title_ar: "ملاحظة من المحافظ على بلاغ",
    body_en: `Governor comment: ${noteText}`,
    body_ar: `ملاحظة المحافظ: ${noteText}`,
    link_url: `/manager/reports/${reportId}`,
  });

  if (error) return { error: error.message };
  return { success: true };
}

// ---------------------------------------------------------------------------
// Mark all notifications read
// ---------------------------------------------------------------------------

export async function markAllNotificationsRead() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) return { error: error.message };
  revalidatePath("/governor/notifications");
  return { success: true };
}
