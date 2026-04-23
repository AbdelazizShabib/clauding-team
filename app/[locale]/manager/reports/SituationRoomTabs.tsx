"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Eye, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SLARing } from "@/components/staff/SLARing";
import { getStatusStyle, getPriorityStyle } from "@/lib/staff/report-views";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Report = {
  id: string;
  status: string;
  priority: string;
  description: string | null;
  address_description: string | null;
  submitted_at: string;
  sla_resolve_deadline: string | null;
  district_id: string;
  category: any;
  district: any;
  reporter: any;
  technician: any;
  [key: string]: unknown;
};

interface SituationRoomTabsProps {
  locale: string;
  myReports: Report[];
  otherReports: Report[];
  approvedDistrictIds: string[];
  profileId: string;
}

export function SituationRoomTabs({
  locale,
  myReports,
  otherReports,
  approvedDistrictIds,
  profileId,
}: SituationRoomTabsProps) {
  const t = useTranslations("manager");
  const tStatuses = useTranslations("statuses");
  const tPriorities = useTranslations("priorities");
  const [tab, setTab] = useState<"mine" | "city">("mine");

  const reports = tab === "mine" ? myReports : otherReports;

  function getCategoryName(report: Report) {
    if (!report.category) return "";
    return locale === "ar"
      ? (report.category.name_ar || report.category.name_en || "")
      : (report.category.name_en || "");
  }

  function getDistrictName(report: Report) {
    if (!report.district) return "";
    return locale === "ar"
      ? (report.district.name_ar || report.district.name_en || "")
      : (report.district.name_en || "");
  }

  function getReporterName(report: Report) {
    if (!report.reporter) return "";
    return locale === "ar"
      ? (report.reporter.full_name_ar || report.reporter.full_name || "")
      : (report.reporter.full_name || "");
  }

  function getTechName(report: Report) {
    if (!report.technician) return "—";
    return locale === "ar"
      ? (report.technician.full_name_ar || report.technician.full_name || "")
      : (report.technician.full_name || "");
  }

  function hasAccess(districtId: string) {
    return approvedDistrictIds.includes(districtId);
  }

  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl bg-sky-white p-1 border border-border-neutral">
        <button
          onClick={() => setTab("mine")}
          className={cn(
            "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
            tab === "mine"
              ? "bg-white text-navy shadow-sm"
              : "text-navy/50 hover:text-navy"
          )}
        >
          <Shield className="inline h-4 w-4 me-1.5 -mt-0.5" />
          {t("situationRoom.tabMyDistrict")}
          <span className="ms-1.5 text-xs font-normal text-navy/40">({myReports.length})</span>
        </button>
        <button
          onClick={() => setTab("city")}
          className={cn(
            "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
            tab === "city"
              ? "bg-white text-navy shadow-sm"
              : "text-navy/50 hover:text-navy"
          )}
        >
          <Globe className="inline h-4 w-4 me-1.5 -mt-0.5" />
          {t("situationRoom.tabCityWide")}
          <span className="ms-1.5 text-xs font-normal text-navy/40">({otherReports.length})</span>
        </button>
      </div>

      {tab === "city" && (
        <p className="text-xs text-navy/50 -mt-3">
          {t("situationRoom.cityWideSubtitle")}
        </p>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border-neutral bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-neutral bg-sky-white/50">
              <th className="px-4 py-3 text-start font-medium text-navy/70">
                {tStatuses("submitted").split(" ")[0]}
              </th>
              <th className="px-4 py-3 text-start font-medium text-navy/70">
                {t("filters.priority")}
              </th>
              <th className="px-4 py-3 text-start font-medium text-navy/70">
                {t("filters.category")}
              </th>
              {tab === "city" && (
                <th className="px-4 py-3 text-start font-medium text-navy/70">
                  {locale === "ar" ? "القسم" : "District"}
                </th>
              )}
              <th className="px-4 py-3 text-start font-medium text-navy/70">
                {t("reportDetail.reporter")}
              </th>
              <th className="px-4 py-3 text-start font-medium text-navy/70">
                {t("reportDetail.technician")}
              </th>
              <th className="px-4 py-3 text-start font-medium text-navy/70">SLA</th>
              <th className="px-4 py-3 text-start font-medium text-navy/70"></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const statusStyle = getStatusStyle(report.status as any);
              const priorityStyle = getPriorityStyle(report.priority as any);
              const deadline = report.sla_resolve_deadline;
              const granted = hasAccess(report.district_id);

              return (
                <tr
                  key={report.id}
                  className="border-b border-border-neutral last:border-0 hover:bg-sky-white/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        statusStyle.bg,
                        statusStyle.text
                      )}
                    >
                      {tStatuses(report.status as Parameters<typeof tStatuses>[0])}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        priorityStyle.bg,
                        priorityStyle.fg
                      )}
                    >
                      {tPriorities(report.priority as Parameters<typeof tPriorities>[0])}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy">{getCategoryName(report)}</td>
                  {tab === "city" && (
                    <td className="px-4 py-3">
                      <span className="text-xs text-navy/70">{getDistrictName(report)}</span>
                      {granted && (
                        <span className="ms-1 inline-flex rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                          ✓
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-navy/70">{getReporterName(report)}</td>
                  <td className="px-4 py-3 text-navy/70">{getTechName(report)}</td>
                  <td className="px-4 py-3">
                    <SLARing deadline={deadline} size={32} strokeWidth={3} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {tab === "mine" ? (
                        <Link
                          href={`/${locale}/manager/reports/${report.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-nile-green hover:bg-nile-green/10"
                        >
                          <Eye className="h-3 w-3" />
                        </Link>
                      ) : granted ? (
                        <Link
                          href={`/${locale}/manager/reports/${report.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-nile-green hover:bg-nile-green/10"
                        >
                          <Eye className="h-3 w-3" />
                        </Link>
                      ) : (
                        <Link
                          href={`/${locale}/manager/cross-district`}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100"
                        >
                          <Globe className="h-3 w-3" />
                          {t("situationRoom.requestAccess")}
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {reports.map((report) => {
          const statusStyle = getStatusStyle(report.status as any);
          const priorityStyle = getPriorityStyle(report.priority as any);
          const deadline = report.sla_resolve_deadline;
          const granted = hasAccess(report.district_id);
          const detailHref =
            tab === "mine" || granted
              ? `/${locale}/manager/reports/${report.id}`
              : `/${locale}/manager/cross-district`;

          return (
            <Link
              key={report.id}
              href={detailHref}
              className="block rounded-xl border border-border-neutral bg-white p-4 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-navy truncate">
                    {getCategoryName(report)}
                  </p>
                  {tab === "city" && (
                    <p className="text-xs text-navy/50 mt-0.5 flex items-center gap-1">
                      {getDistrictName(report)}
                      {granted && (
                        <span className="inline-flex rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                          {t("situationRoom.accessGranted")}
                        </span>
                      )}
                      {!granted && (
                        <span className="inline-flex rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                          {t("situationRoom.requestAccess")}
                        </span>
                      )}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        statusStyle.bg,
                        statusStyle.text
                      )}
                    >
                      {tStatuses(report.status as Parameters<typeof tStatuses>[0])}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        priorityStyle.bg,
                        priorityStyle.fg
                      )}
                    >
                      {tPriorities(report.priority as Parameters<typeof tPriorities>[0])}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-navy/50">
                    {getReporterName(report)} → {getTechName(report)}
                  </p>
                </div>
                <SLARing deadline={deadline} size={40} />
              </div>
            </Link>
          );
        })}
      </div>

      {reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-navy/50">
            {tab === "mine"
              ? (locale === "ar" ? "لا توجد بلاغات" : "No reports found")
              : (locale === "ar" ? "لا توجد بلاغات نشطة في أقسام أخرى" : "No active reports in other districts")}
          </p>
        </div>
      )}
    </>
  );
}
