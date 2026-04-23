"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/domain";

export function ToastHandler() {
  const locale = useLocale();

  useEffect(() => {
    const supabase = createClient();
    let userId: string | undefined;

    async function subscribe() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userId = user.id;

      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            const notification = payload.new as Notification;
            const title =
              locale === "ar"
                ? notification.title_ar
                : notification.title_en;
            const body =
              locale === "ar"
                ? notification.body_ar
                : notification.body_en;

            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } max-w-sm w-full bg-white shadow-lg rounded-xl border border-[#DCE3EA] pointer-events-auto flex p-4`}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  <div className="flex flex-col w-full gap-1">
                    <p className="text-sm font-semibold text-[#1C2D5B]">{title}</p>
                    {body && <p className="text-sm text-[#1C2D5B]/70">{body}</p>}
                    {notification.link_url && (
                      <button
                        onClick={() => {
                          toast.dismiss(t.id);
                          window.location.href = `/${locale}${notification.link_url}`;
                        }}
                        className="mt-2 text-xs font-medium bg-[#3E7D60] text-white py-1.5 px-3 rounded-md w-fit hover:bg-[#2c5c45] transition-colors"
                      >
                        {locale === "ar" ? "عرض التفاصيل" : "View Details"}
                      </button>
                    )}
                  </div>
                </div>
              ),
              { duration: 6000 }
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    const cleanup = subscribe();
    return () => {
      cleanup.then((fn) => fn?.());
    };
  }, [locale]);

  return null;
}
