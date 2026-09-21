"use client";

import * as React from "react";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {ConsentCompletion} from "@/gql/schema";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {DataEmpty} from "@/components/data-empty";
import {bucketHref} from "@/utils/analytics";

const CONSENTS_FACET = "consents";
const MAX_BAR = 22;

export function AnalyticsConsentChart({completion}: { completion: ConsentCompletion[] }) {
    const router = useRouter();
    const t = useTranslations("Analytics");

    const data = completion.map((entry) => ({
        key: entry.key,
        label: entry.label,
        granted: Number(entry.granted),
        denied: Number(entry.denied),
        missing: Number(entry.missing)
    }));

    const config = {
        granted: {label: t("consentGranted"), color: "var(--chart-3)"},
        denied: {label: t("consentDenied"), color: "var(--destructive)"},
        missing: {label: t("consentMissing"), color: "var(--muted-foreground)"}
    };

    const open = React.useCallback((key: string, value: "true" | "false") => {
        const href = bucketHref({facet: CONSENTS_FACET, key: `${key}:${value}`});
        if (href) {
            router.push(href);
        }
    }, [router]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{t("consentCompletion")}</CardTitle>
                <CardDescription>{t("consentCompletionDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                {data.length === 0 && <DataEmpty/>}
                {data.length > 0 && (
                    <ChartContainer config={config} className="w-full"
                                    style={{height: Math.max(140, data.length * 34 + 40)}}>
                        <BarChart accessibilityLayer data={data} layout="vertical"
                                  margin={{top: 4, right: 16, bottom: 4, left: 4}}>
                            <CartesianGrid horizontal={false} strokeOpacity={0.3}/>
                            <XAxis type="number" hide/>
                            <YAxis type="category" dataKey="label" width={150} tickLine={false} axisLine={false}
                                   tickMargin={6} className="text-xs"/>
                            <ChartTooltip content={<ChartTooltipContent indicator="dot"/>}/>
                            <ChartLegend content={<ChartLegendContent/>}/>
                            <Bar dataKey="granted" stackId="consent" fill="var(--color-granted)" cursor="pointer"
                                 maxBarSize={MAX_BAR} stroke="var(--card)" strokeWidth={2}
                                 onClick={(_, index) => open(data[index].key, "true")}/>
                            <Bar dataKey="denied" stackId="consent" fill="var(--color-denied)" cursor="pointer"
                                 maxBarSize={MAX_BAR} stroke="var(--card)" strokeWidth={2}
                                 onClick={(_, index) => open(data[index].key, "false")}/>
                            <Bar dataKey="missing" stackId="consent" fill="var(--color-missing)" fillOpacity={0.3}
                                 maxBarSize={MAX_BAR} stroke="var(--card)" strokeWidth={2}
                                 radius={[0, 4, 4, 0]}/>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
