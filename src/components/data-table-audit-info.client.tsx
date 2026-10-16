"use client";

import {useTranslations} from "next-intl";
import {formatDateTime} from "@/utils/utils";

interface AuditInfo {
    createdAt: string;
    createdBy?: string | null;
    lastModifiedAt?: string | null;
    lastModifiedBy?: string | null;
}

export function AuditInfo({item}: { item: AuditInfo }) {
    const t = useTranslations();

    return (
        <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/30 p-3 text-xs sm:grid-cols-2 sm:text-[11px] text-muted-foreground">
            <div className="min-w-0 space-y-1 wrap-anywhere">
                <p className="font-semibold text-foreground/70 uppercase tracking-wider">
                    {t("Common.createdAt")}
                </p>
                <p>
                    {formatDateTime(item.createdAt)} ({item.createdBy || "-"})
                </p>
            </div>
            {item.lastModifiedAt && (
                <div className="min-w-0 space-y-1 wrap-anywhere">
                    <p className="font-semibold text-foreground/70 uppercase tracking-wider">
                        {t("Common.lastModifiedAt")}
                    </p>
                    <p>
                        {formatDateTime(item.lastModifiedAt)} ({item.lastModifiedBy || "-"})
                    </p>
                </div>
            )}
        </div>
    );
}