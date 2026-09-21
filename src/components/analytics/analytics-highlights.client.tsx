"use client";

import Link from "next/link";
import {useTranslations} from "next-intl";
import {ArrowRight, CircleAlert} from "lucide-react";
import {Analytics} from "@/gql/schema";
import {buttonVariants} from "@/components/ui/button";
import {AnalyticsBarChart} from "./analytics-bar-chart.client";
import {AnalyticsStat} from "./analytics-stat.client";
import {bucketHref} from "@/utils/analytics";

const HEADLINE_YEARS = 25;
const TOP_ISSUES = 3;

export function AnalyticsHighlights({data}: { data: Analytics }) {
    const t = useTranslations("Analytics");

    const recentYears = data.participation?.bySpexYear.slice(-HEADLINE_YEARS) ?? [];
    const topIssues = data.dataQuality?.issues.slice(0, TOP_ISSUES) ?? [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{t("heading")}</h2>
                <Link href="/analytics" className={buttonVariants({variant: "outline", size: "sm"})}>
                    {t("showAll")}
                    <ArrowRight className="size-3.5"/>
                </Link>
            </div>

            <AnalyticsBarChart
                title={t("bySpexYear")}
                description={t("bySpexYearRecentDescription", {years: HEADLINE_YEARS})}
                buckets={recentYears}
                orientation="vertical"
            />

            {topIssues.length > 0 && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    {topIssues.map((issue) => (
                        <AnalyticsStat
                            key={issue.key}
                            label={issue.label}
                            value={Number(issue.count)}
                            icon={CircleAlert}
                            href={bucketHref(issue)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
