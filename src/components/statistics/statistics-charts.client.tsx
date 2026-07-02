"use client"

import * as React from "react"
import {useCallback} from "react"
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {History, Statistics} from "@/gql/schema"
import {useTranslations} from "next-intl"
import {TrendingUp} from "lucide-react"

interface StatisticsChartsProps {
    data: Statistics
}

export function StatisticsCharts({data}: StatisticsChartsProps) {
    const t = useTranslations("Statistics")

    const processHistory = useCallback((
        history: Array<History | null> | null | undefined,
        secondaryHistory?: Array<History | null> | null | undefined
    ) => {
        if (!history && !secondaryHistory) {
            return [];
        }

        const mergedMap = new Map<string, { count: number, secondaryCount: number }>()

        history?.forEach(h => {
            if (h) mergedMap.set(h.label, {count: Number(h.count), secondaryCount: 0})
        })

        secondaryHistory?.forEach(h => {
            if (h) {
                const existing = mergedMap.get(h.label) || {count: 0, secondaryCount: 0}
                mergedMap.set(h.label, {...existing, secondaryCount: Number(h.count)})
            }
        })

        const sortedLabels = Array.from(mergedMap.keys()).sort()
        let accumulated = 0
        let secondaryAccumulated = 0

        return sortedLabels.map(label => {
            const val = mergedMap.get(label)!
            accumulated += val.count
            secondaryAccumulated += val.secondaryCount
            return {
                label,
                count: val.count,
                secondaryCount: val.secondaryCount,
                accumulated,
                secondaryAccumulated,
                totalAccumulated: accumulated + secondaryAccumulated
            }
        })
    }, []);

    const charts = [
        {
            title: t("spexare"),
            count: data.spexareCount,
            history: processHistory(data.spexareCountHistory),
            color: "#2563eb",
            keys: {main: "count", acc: "accumulated"}
        },
        {
            title: t("spex"),
            secondaryTitle: t("spexRevivals"),
            count: data.spexCount,
            secondaryCount: data.spexRevivalCount,
            history: processHistory(data.spexCountHistory, data.spexRevivalCountHistory),
            color: "#10b981",
            secondaryColor: "#8b5cf6",
            keys: {main: "count", acc: "accumulated", secondary: "secondaryCount", secondaryAcc: "secondaryAccumulated"}
        },
        {
            title: t("tasks"),
            count: data.taskCount,
            history: processHistory(data.taskCountHistory),
            color: "#f59e0b",
            keys: {main: "count", acc: "accumulated"}
        },
        {
            title: t("users"),
            count: data.userCount,
            history: processHistory(data.userCountHistory),
            color: "#ef4444",
            keys: {main: "count", acc: "accumulated"}
        }
    ];

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
            {charts.map((chart, index) => {
                const chartConfig = {
                    count: {label: t("count"), color: chart.color},
                    accumulated: {label: t("accumulatedCount"), color: "#94a3b8"},
                    secondaryCount: {label: t("spexRevivalsCount"), color: chart.secondaryColor},
                    secondaryAccumulated: {label: t("spexRevivalsAccumulatedCount"), color: "#94a3b8"}
                };

                return (
                    <Card key={index} className="flex flex-col">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start w-full">
                                <div className="flex flex-col">
                                    <CardDescription>{chart.title}</CardDescription>
                                    <CardTitle className="text-4xl font-bold tabular-nums">
                                        {chart.count?.toLocaleString()}
                                    </CardTitle>
                                </div>
                                {chart.secondaryTitle && chart.secondaryCount !== undefined && (
                                    <div className="flex flex-col items-end text-right">
                                        <CardDescription>{chart.secondaryTitle}</CardDescription>
                                        <CardTitle className="text-4xl font-bold tabular-nums">
                                            {chart.secondaryCount?.toLocaleString()}
                                        </CardTitle>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1">
                            <ChartContainer config={chartConfig} className="h-[100px] w-full">
                                <LineChart data={chart.history} margin={{top: 10, right: 10, left: 10, bottom: 0}}>
                                    <CartesianGrid vertical={false} horizontal={false}/>
                                    <XAxis dataKey="label" hide/>
                                    <YAxis yAxisId="total" hide domain={['auto', 'auto']}/>
                                    <YAxis yAxisId="growth" hide domain={['auto', 'auto']}/>
                                    <ChartTooltip
                                        content={<ChartTooltipContent indicator="line"/>}/>
                                    <Line yAxisId="total" type="monotone" dataKey="accumulated" stroke="#94a3b8"
                                          strokeWidth={2} strokeOpacity={0.4} dot={false} connectNulls/>
                                    <Line yAxisId="growth" type="monotone" dataKey="count" stroke={chart.color}
                                          strokeWidth={2} dot={false} connectNulls/>
                                    {chart.keys.secondary && (
                                        <>
                                            <Line yAxisId="total" type="monotone" dataKey="secondaryAccumulated"
                                                  stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4"
                                                  strokeOpacity={0.4} dot={false} connectNulls/>
                                            <Line yAxisId="growth" type="monotone" dataKey="secondaryCount"
                                                  stroke={chart.secondaryColor} strokeWidth={2} dot={false}
                                                  connectNulls/>
                                        </>
                                    )}
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="pt-2 pb-4 mt-auto">
                            <div
                                className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-tight font-medium leading-tight">
                                <TrendingUp className="h-3.5 w-3.5 shrink-0 opacity-70"/>
                                <span className="line-clamp-2" title={t("lastThreeYears")}>
                                    {t("lastThreeYears")}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
