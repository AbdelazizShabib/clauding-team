import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/staff/queries";
import {
  getDistrictReports,
  getOtherDistrictReports,
  getActiveCrossDistrictPermission,
} from "@/lib/manager/queries";
import { getTranslations } from "next-intl/server";
import { ClipboardList } from "lucide-react";
import { SituationRoomTabs } from "./SituationRoomTabs";

interface ReportsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SituationRoomPage({ params }: ReportsPageProps) {
  const { locale } = await params;
  const supabase = await createServerSupabase();
  const profile = await getCurrentProfile(supabase);

  if (!profile?.district_id) return null;

  const [myReports, otherReports, activePermissions] = await Promise.all([
    getDistrictReports(supabase, profile.district_id),
    getOtherDistrictReports(supabase, profile.district_id),
    getActiveCrossDistrictPermission(supabase, profile.id),
  ]);

  // Build a set of district IDs the DM has active cross-district access to
  const approvedDistrictIds = new Set(
    activePermissions.map((p) => p.target_district_id)
  );

  const t = await getTranslations({ locale, namespace: "manager" });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-navy" />
        <div>
          <h1 className="text-2xl font-bold text-navy">{t("situationRoom.title")}</h1>
          <p className="text-sm text-navy/50 mt-0.5">{t("situationRoom.subtitle")}</p>
        </div>
      </div>

      <SituationRoomTabs
        locale={locale}
        myReports={myReports}
        otherReports={otherReports}
        approvedDistrictIds={Array.from(approvedDistrictIds)}
        profileId={profile.id}
      />
    </div>
  );
}
