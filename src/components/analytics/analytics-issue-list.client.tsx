"use client";

import Link from "next/link";
import {useTranslations} from "next-intl";
import {ChevronRight} from "lucide-react";
import {Bucket} from "@/gql/schema";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DataEmpty} from "@/components/data-empty";
import {bucketHref} from "@/utils/analytics";

export function AnalyticsIssueList({issues, total}: { issues: Bucket[]; total: number }) {
    const t = useTranslations("Analytics");

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{t("dataQualityIssues")}</CardTitle>
                <CardDescription>{t("dataQualityIssuesDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                {issues.length === 0 && <DataEmpty/>}
                <ul className="flex flex-col">
                    {issues.map((issue) => {
                        const count = Number(issue.count);
                        const share = total > 0 ? Math.round((count / total) * 100) : 0;
                        const href = bucketHref(issue);
                        const row = (
                            <div
                                className="relative flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-accent/50">
                                <div
                                    className="absolute inset-y-1 left-0 rounded-r-md bg-chart-1/15"
                                    style={{width: `${share}%`}}
                                    aria-hidden
                                />
                                <span className="relative truncate text-sm" title={issue.label}>{issue.label}</span>
                                <span className="relative flex items-center gap-2 shrink-0">
                                    <span className="text-sm font-semibold tabular-nums">{count.toLocaleString()}</span>
                                    <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                                        {share}%
                                    </span>
                                    {href && <ChevronRight className="size-3.5 opacity-50"/>}
                                </span>
                            </div>
                        );

                        return (
                            <li key={issue.key}>
                                {href ? <Link href={href}>{row}</Link> : row}
                            </li>
                        );
                    })}
                </ul>
            </CardContent>
        </Card>
    );
}
