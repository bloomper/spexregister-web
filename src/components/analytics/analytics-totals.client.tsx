"use client"

import * as React from "react"
import {Bar, BarChart, XAxis, YAxis} from "recharts"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart"
import {Bucket, History, Totals} from "@/gql/schema"
import {useTranslations} from "next-intl"
import {TrendingUp} from "lucide-react"
import {useMediaQuery} from "@/hooks/use-media-query.client"

interface AnalyticsTotalsProps {
    data: Totals
}

interface YearPoint {
    label: string
    count: number
    secondaryCount: number
    accumulated: number
    secondaryAccumulated: number
}

const MAX_CATEGORIES = 6

function byYear(history: History[], secondaryHistory: History[] = []): YearPoint[] {
    const counts = new Map(history.map(h => [Number(h.label), Number(h.count)]))
    const secondaryCounts = new Map(secondaryHistory.map(h => [Number(h.label), Number(h.count)]))
    const years = [...counts.keys(), ...secondaryCounts.keys()].filter(Number.isFinite)

    if (years.length === 0) {
        return []
    }

    const first = Math.min(...years)
    const last = Math.max(...years)
    let accumulated = 0
    let secondaryAccumulated = 0

    return Array.from({length: last - first + 1}, (_, index) => {
        const count = counts.get(first + index) ?? 0
        const secondaryCount = secondaryCounts.get(first + index) ?? 0

        accumulated += count
        secondaryAccumulated += secondaryCount

        return {label: String(first + index), count, secondaryCount, accumulated, secondaryAccumulated}
    })
}

function topCategories(buckets: Bucket[], otherLabel: string) {
    const rows = buckets.map(bucket => ({key: bucket.key, label: bucket.label, count: Number(bucket.count)}))

    if (rows.length <= MAX_CATEGORIES) {
        return rows
    }

    const rest = rows.slice(MAX_CATEGORIES - 1)

    return [
        ...rows.slice(0, MAX_CATEGORIES - 1),
        {key: "other", label: otherLabel, count: rest.reduce((sum, row) => sum + row.count, 0)}
    ]
}

export function AnalyticsTotals({data}: AnalyticsTotalsProps) {
    const t = useTranslations("Analytics")
    const showCharts = useMediaQuery("(min-width: 40rem)")

    const range = (points: YearPoint[]) => ({from: points[0]?.label ?? "", to: points[points.length - 1]?.label ?? ""})

    const spexare = byYear(data.spexareCountHistory)
    const spex = byYear(data.spexCountHistory, data.spexRevivalCountHistory)
    const users = byYear(data.userCountHistory)
    const categories = topCategories(data.taskCountByCategory, t("otherCategories"))
    const largestCategory = Math.max(1, ...categories.map(category => category.count))

    const charts = [
        {
            title: t("spexare"),
            count: data.spexareCount,
            history: spexare,
            color: "#2563eb",
            caption: spexare.length > 0 ? t("spexareByDebutYear", range(spexare)) : null
        },
        {
            title: t("spex"),
            secondaryTitle: t("spexRevivals"),
            count: data.spexCount,
            secondaryCount: data.spexRevivalCount,
            history: spex,
            color: "#10b981",
            secondaryColor: "#8b5cf6",
            caption: spex.length > 0 ? t("spexByYear", range(spex)) : null
        },
        {
            title: t("tasks"),
            count: data.taskCount,
            categories,
            color: "#f59e0b",
            caption: categories.length > 0 ? t("tasksByCategory") : null
        },
        {
            title: t("users"),
            count: data.userCount,
            history: users,
            color: "#ef4444",
            caption: users.length > 0 ? t("usersByYear", range(users)) : null
        }
    ]

    return (
        <div className="grid auto-rows-min grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {charts.map((chart, index) => {
                const chartConfig = {
                    count: {label: t("count"), color: chart.color},
                    secondaryCount: {label: t("spexRevivalsCount"), color: chart.secondaryColor}
                }

                return (
                    <Card key={index} className="flex flex-col gap-3 py-4 sm:gap-6 sm:py-6">
                        <CardHeader className="px-4 sm:px-6 sm:pb-2">
                            <div className="flex flex-wrap justify-between items-start gap-x-4 gap-y-2 w-full">
                                <div className="flex flex-col">
                                    <CardDescription className="flex items-center gap-1.5">
                                        {chart.secondaryTitle && (
                                            <span className="size-2 rounded-[2px]" style={{background: chart.color}}/>
                                        )}
                                        {chart.title}
                                    </CardDescription>
                                    <CardTitle className="text-2xl font-bold tabular-nums sm:text-4xl">
                                        {chart.count?.toLocaleString()}
                                    </CardTitle>
                                </div>
                                {chart.secondaryTitle && chart.secondaryCount !== undefined && (
                                    <div className="flex flex-col items-start">
                                        <CardDescription className="flex items-center gap-1.5">
                                            <span className="size-2 rounded-[2px]"
                                                  style={{background: chart.secondaryColor}}/>
                                            {chart.secondaryTitle}
                                        </CardDescription>
                                        <CardTitle className="text-2xl font-bold tabular-nums sm:text-4xl">
                                            {chart.secondaryCount?.toLocaleString()}
                                        </CardTitle>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="hidden p-0 flex-1 sm:block sm:min-h-[100px]">
                            {showCharts && chart.history && (
                                <ChartContainer config={chartConfig} className="h-[100px] w-full">
                                    <BarChart accessibilityLayer data={chart.history} barCategoryGap={1}
                                              margin={{top: 10, right: 10, left: 10, bottom: 0}}>
                                        <XAxis dataKey="label" hide/>
                                        <YAxis hide domain={[0, "auto"]}/>
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    labelFormatter={(label, payload) => {
                                                        const point = payload?.[0]?.payload as YearPoint | undefined

                                                        return (
                                                            <>
                                                                <div>{point?.label ?? label}</div>
                                                                {point && (
                                                                    <div className="font-normal text-muted-foreground">
                                                                        {t("accumulatedCount")}: {point.accumulated.toLocaleString()}
                                                                        {chart.secondaryTitle && ` + ${point.secondaryAccumulated.toLocaleString()}`}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )
                                                    }}
                                                />
                                            }
                                        />
                                        <Bar dataKey="count" stackId="year" fill={chart.color}
                                             radius={chart.secondaryTitle ? 0 : [2, 2, 0, 0]}/>
                                        {chart.secondaryTitle && (
                                            <Bar dataKey="secondaryCount" stackId="year" fill={chart.secondaryColor}/>
                                        )}
                                    </BarChart>
                                </ChartContainer>
                            )}
                            {chart.categories && (
                                <ul className="flex h-[100px] flex-col justify-end gap-1 px-6 text-xs sm:text-[11px] leading-none">
                                    {chart.categories.map(category => (
                                        <li key={category.key} className="flex items-center gap-2"
                                            title={`${category.label}: ${category.count.toLocaleString()}`}>
                                            <span className="w-20 shrink-0 truncate text-muted-foreground">
                                                {category.label}
                                            </span>
                                            <span className="flex-1">
                                                <span className="block h-2 rounded-r-[2px]"
                                                      style={{
                                                          width: `${Math.max(2, category.count / largestCategory * 100)}%`,
                                                          background: chart.color
                                                      }}/>
                                            </span>
                                            <span className="w-6 shrink-0 text-right tabular-nums">
                                                {category.count.toLocaleString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                        <CardFooter className="hidden pt-2 pb-4 mt-auto sm:flex">
                            {chart.caption && (
                                <div
                                    className="flex items-center gap-2 text-xs sm:text-[10px] text-muted-foreground uppercase tracking-tight font-medium leading-tight">
                                    <TrendingUp className="h-3.5 w-3.5 shrink-0 opacity-70"/>
                                    <span className="line-clamp-2" title={chart.caption}>
                                        {chart.caption}
                                    </span>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
