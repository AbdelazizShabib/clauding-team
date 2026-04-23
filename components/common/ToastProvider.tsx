"use client";

import { Toaster } from "react-hot-toast";
import { useLocale } from "next-intl";

export function ToastProvider() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          direction: isRtl ? "rtl" : "ltr",
          background: "#fff",
          color: "#1C2D5B",
          border: "1px solid #DCE3EA",
          borderRadius: "0.75rem",
          padding: "12px 16px",
          fontFamily: isRtl ? "'Rubik', sans-serif" : "inherit",
        },
        success: {
          style: {
            background: "#ECF5F0",
            border: "1px solid #3E7D60",
            color: "#1C2D5B",
          },
          iconTheme: {
            primary: "#3E7D60",
            secondary: "#fff",
          },
        },
        error: {
          style: {
            background: "#FDF2F2",
            border: "1px solid #C94C4C",
            color: "#1C2D5B",
          },
          iconTheme: {
            primary: "#C94C4C",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
