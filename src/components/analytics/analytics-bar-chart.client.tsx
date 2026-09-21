"use client";

import * as React from "react";
import {Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis} from "recharts";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {Bucket} from "@/gql/schema";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {DataEmpty} from "@/components/data-empty";
import {bucketHref} from "@/utils/analytics";
import {cn} from "@/utils/utils";

interface AnalyticsBarChartProps {
    title: string;
    description?: string;
    buckets: Bucket[];
    orientation?: "horizontal" | "vertical";
    className?: string;
}

const ROW_HEIGHT = 26;
const MAX_BAR = 18;
const MIN_HEIGHT = 120;
const VERTICAL_HEIGHT = 220;
const LABEL_WIDTH = 124;
const LABEL_CHARS = 18;

const clip = (label: string) => label.length > LABEL_CHARS ? `${label.slice(0, LABEL_CHARS - 1)}…` : label;

export function AnalyticsBarChart({
                                      title,
                                      description,
                                      buckets,
                                      orientation = "horizontal",
                                      className
                                  }: AnalyticsBarChartProps) {
    const router = useRouter();
    const t = useTranslations("Analytics");

    const data = buckets.map((bucket) => ({
        key: bucket.key,
        label: bucket.label,
        count: Number(bucket.count),
        href: bucketHref(bucket)
    }));

    const open = React.useCallback((href: string | null) => {
        if (href) {
            router.push(href);
        }
    }, [router]);

    const config = {count: {label: t("count"), color: "var(--chart-3)"}};
    const isRanked = orientation === "horizontal";
    const height = isRanked ? Math.max(MIN_HEIGHT, data.length * ROW_HEIGHT + 16) : VERTICAL_HEIGHT;

    return (
        <Card className={cn("flex flex-col gap-2", className)}>
            <CardHeader className="pb-0">
                <CardTitle className="text-base">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                {data.length === 0 && <DataEmpty/>}
                {data.length > 0 && (
                    <ChartContainer config={config} className="w-full" style={{height}}>
                        <BarChart
                            accessibilityLayer
                            data={data}
                            layout={isRanked ? "vertical" : "horizontal"}
                            margin={isRanked
                                ? {top: 0, right: 48, bottom: 0, left: 0}
                                : {top: 8, right: 8, bottom: 0, left: 0}}
                            barCategoryGap={isRanked ? 4 : 2}
                        >
                            <CartesianGrid
                                horizontal={!isRanked}
                                vertical={false}
                                strokeOpacity={0.25}
                            />
                            {isRanked ? (
                                <>
                                    <XAxis type="number" hide/>
                                    <YAxis
                                        type="category"
                                        dataKey="label"
                                        width={LABEL_WIDTH}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={6}
                                        interval={0}
                                        tickFormatter={clip}
                                        className="text-xs"
                                    />
                                </>
                            ) : (
                                <>
                                    <XAxis
                                        dataKey="label"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={6}
                                        minTickGap={16}
                                        className="text-xs"
                                    />
                                    <YAxis
                                        width={36}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={4}
                                        allowDecimals={false}
                                        className="text-xs"
                                    />
                                </>
                            )}
                            <ChartTooltip content={<ChartTooltipContent indicator="dot"/>}/>
                            <Bar
                                dataKey="count"
                                radius={isRanked ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                                fill="var(--color-count)"
                                maxBarSize={MAX_BAR}
                            >
                                {isRanked && (
                                    <LabelList
                                        dataKey="count"
                                        position="right"
                                        offset={6}
                                        className="fill-muted-foreground text-xs tabular-nums"
                                    />
                                )}
                                {data.map((row) => (
                                    <Cell
                                        key={row.key}
                                        cursor={row.href ? "pointer" : undefined}
                                        onClick={() => open(row.href)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
