"use client";

import type { ComponentProps } from "react";
import { useLocale } from "next-intl";
import { type ChartConfig, ChartTooltipContent } from "@/components/ui/chart";

/**
 * The shadcn chart tooltip, with its numbers in the app's language: its own formatting, `toLocaleString()`, uses the
 * browser's language. Draws the same row as the dot indicator: the series' colour, its label from `config`, the value.
 */
export function LocalizedChartTooltipContent({
  config,
  ...props
}: ComponentProps<typeof ChartTooltipContent> & {
  config: ChartConfig;
}) {
  const locale = useLocale();

  return (
    <ChartTooltipContent
      {...props}
      indicator="dot"
      formatter={(value, name, item) => {
        const label = config[String(name)]?.label ?? config[String(item.dataKey)]?.label ?? name;

        return (
          <>
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: item.payload?.fill ?? item.color }}
            />
            <div className="flex flex-1 items-center justify-between leading-none">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-foreground font-mono font-medium tabular-nums">
                {typeof value === "number" ? value.toLocaleString(locale) : String(value)}
              </span>
            </div>
          </>
        );
      }}
    />
  );
}
