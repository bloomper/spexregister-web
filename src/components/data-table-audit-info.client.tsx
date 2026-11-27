"use client";

import { useTranslations } from "next-intl";
import { formatDateTime } from "@/utils/utils";

interface AuditInfo {
  createdAt: string;
  createdBy?: string | null;
  lastModifiedAt?: string | null;
  lastModifiedBy?: string | null;
}

/**
 * Who created and last changed a record and when.
 */
export function AuditInfo({ item }: { item: AuditInfo }) {
  const t = useTranslations();

  return (
    <div className="bg-muted/30 text-muted-foreground grid grid-cols-1 gap-4 rounded-lg border p-3 text-xs sm:grid-cols-2 sm:text-[11px]">
      <div className="min-w-0 space-y-1 wrap-anywhere">
        <p className="text-foreground/70 font-semibold tracking-wider uppercase">{t("Common.createdAt")}</p>
        <p>
          {formatDateTime(item.createdAt)} ({item.createdBy || "-"})
        </p>
      </div>
      {item.lastModifiedAt && (
        <div className="min-w-0 space-y-1 wrap-anywhere">
          <p className="text-foreground/70 font-semibold tracking-wider uppercase">{t("Common.lastModifiedAt")}</p>
          <p>
            {formatDateTime(item.lastModifiedAt)} ({item.lastModifiedBy || "-"})
          </p>
        </div>
      )}
    </div>
  );
}
