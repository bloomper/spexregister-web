"use client";

import {useTranslations} from "next-intl";
import {Analytics} from "@/gql/schema";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {AnalyticsBarChart} from "./analytics-bar-chart.client";
import {AnalyticsConsentChart} from "./analytics-consent-chart.client";
import {AnalyticsIssueList} from "./analytics-issue-list.client";
import {AnalyticsStat} from "./analytics-stat.client";
import {bucketHref} from "@/utils/analytics";

const GRID = "grid gap-4 md:grid-cols-2";

export function AnalyticsDashboard({data}: { data: Analytics }) {
    const t = useTranslations("Analytics");

    const {participation, demographics, lifecycle, dataQuality, operations} = data;
    const total = Number(dataQuality?.total ?? 0);

    return (
        <Tabs defaultValue="participation">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <TabsList>
                    <TabsTrigger value="participation">{t("participation")}</TabsTrigger>
                    <TabsTrigger value="demographics">{t("demographics")}</TabsTrigger>
                    <TabsTrigger value="lifecycle">{t("lifecycle")}</TabsTrigger>
                    {dataQuality && <TabsTrigger value="dataQuality">{t("dataQuality")}</TabsTrigger>}
                    {operations && <TabsTrigger value="operations">{t("operations")}</TabsTrigger>}
                </TabsList>
                <p className="text-xs text-muted-foreground">{t("clickToFilter")}</p>
            </div>

            <TabsContent value="participation" className={GRID}>
                <AnalyticsBarChart
                    className="md:col-span-2"
                    title={t("bySpexYear")}
                    description={t("bySpexYearDescription")}
                    buckets={participation.bySpexYear}
                    orientation="vertical"
                />
                <AnalyticsBarChart title={t("topSpex")} buckets={participation.topSpex}/>
                <AnalyticsBarChart title={t("bySpexCategory")} buckets={participation.bySpexCategory}/>
                <AnalyticsBarChart title={t("topTask")} buckets={participation.topTask}/>
                <AnalyticsBarChart title={t("byTaskCategory")} buckets={participation.byTaskCategory}/>
                <AnalyticsBarChart className="md:col-span-2" title={t("byVocal")} buckets={participation.byVocal}/>
            </TabsContent>

            <TabsContent value="demographics" className={GRID}>
                <AnalyticsBarChart title={t("byCountry")} buckets={demographics.byCountry}/>
                <AnalyticsBarChart title={t("byAddressType")} buckets={demographics.byAddressType}/>
                <AnalyticsBarChart title={t("byMembership")} buckets={demographics.byMembership}/>
                <AnalyticsBarChart title={t("byTag")} buckets={demographics.byTag}/>
                <AnalyticsConsentChart completion={demographics.consentCompletion}/>
                <div className="flex flex-col gap-4">
                    <AnalyticsBarChart title={t("byToggle")} buckets={demographics.byToggle}/>
                    <AnalyticsBarChart title={t("byStatus")} buckets={demographics.byStatus}/>
                </div>
            </TabsContent>

            <TabsContent value="lifecycle" className="flex flex-col gap-4">
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <AnalyticsStat
                        label={t("oneTimers")}
                        value={Number(lifecycle.oneTimers)}
                        hint={t("oneTimersHint")}
                        href={bucketHref({facet: "spexCounts", key: "1"})}
                    />
                    <AnalyticsStat label={t("returning")} value={Number(lifecycle.returning)}
                                   hint={t("returningHint")}/>
                    <AnalyticsStat label={t("veterans")} value={Number(lifecycle.veterans)} hint={t("veteransHint")}/>
                    <AnalyticsStat
                        label={t("neverActive")}
                        value={Number(lifecycle.neverActive)}
                        hint={t("neverActiveHint")}
                        href={bucketHref({facet: "quality", key: "noActivity"})}
                    />
                </div>
                <div className={GRID}>
                    <AnalyticsBarChart
                        className="md:col-span-2"
                        title={t("newcomersByYear")}
                        description={t("newcomersByYearDescription")}
                        buckets={lifecycle.newcomersByYear}
                        orientation="vertical"
                    />
                    <AnalyticsBarChart
                        className="md:col-span-2"
                        title={t("lastActiveByYear")}
                        description={t("lastActiveByYearDescription")}
                        buckets={lifecycle.lastActiveByYear}
                        orientation="vertical"
                    />
                    <AnalyticsBarChart
                        title={t("byDormancy")}
                        description={t("byDormancyDescription")}
                        buckets={lifecycle.byDormancy}
                    />
                    <AnalyticsBarChart
                        title={t("byEngagement")}
                        description={t("byEngagementDescription")}
                        buckets={lifecycle.byEngagement}
                        orientation="vertical"
                    />
                </div>
            </TabsContent>

            {dataQuality && (
                <TabsContent value="dataQuality" className={GRID}>
                    <AnalyticsIssueList issues={dataQuality.issues} total={total}/>
                    <div className="grid gap-4 grid-cols-2 content-start">
                        <AnalyticsStat label={t("total")} value={total}/>
                        <AnalyticsStat
                            label={t("complete")}
                            value={Number(dataQuality.complete)}
                            hint={t("completeHint")}
                        />
                    </div>
                </TabsContent>
            )}

            {operations && (
                <TabsContent value="operations" className="flex flex-col gap-4">
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                        <AnalyticsStat label={t("usersWithoutSpexare")}
                                       value={Number(operations.usersWithoutSpexare)}/>
                        <AnalyticsStat label={t("spexareWithoutUser")}
                                       value={Number(operations.spexareWithoutUser)}/>
                    </div>
                    <div className={GRID}>
                        <AnalyticsBarChart
                            className="md:col-span-2"
                            title={t("revisionsByMonth")}
                            description={t("revisionsByMonthDescription")}
                            buckets={operations.revisionsByMonth}
                            orientation="vertical"
                        />
                        <AnalyticsBarChart title={t("revisionsBySource")} buckets={operations.revisionsBySource}/>
                        <AnalyticsBarChart title={t("topEditors")} buckets={operations.topEditors}/>
                        <AnalyticsBarChart className="md:col-span-2" title={t("usersByState")}
                                           buckets={operations.usersByState}/>
                    </div>
                </TabsContent>
            )}
        </Tabs>
    );
}
