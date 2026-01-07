"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import {cn} from "@/utils/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = {light: "", dark: ".dark"} as const

export type ChartConfig = {
    [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
} & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
    )
}

type ChartContextProps = {
    config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
    const context = React.useContext(ChartContext)

    if (!context) {
        throw new Error("useChart must be used within a <ChartContainer />")
    }

    return context
}

function ChartContainer({
                            id,
                            className,
                            children,
                            config,
                            ...props
                        }: React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
        typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
}) {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

    return (
        <ChartContext.Provider value={{config}}>
            <div
                data-slot="chart"
                data-chart={chartId}
                className={cn(
                    "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
                    className
                )}
                {...props}
            >
                <ChartStyle id={chartId} config={config}/>
                <RechartsPrimitive.ResponsiveContainer>
                    {children}
                </RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    )
}

const ChartStyle = ({id, config}: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(
        ([, config]) => config.theme || config.color
    )

    if (!colorConfig.length) {
        return null
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: Object.entries(THEMES)
                    .map(
                        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
                            .map(([key, itemConfig]) => {
                                const color =
                                    itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
                                    itemConfig.color
                                return color ? `  --color-${key}: ${color};` : null
                            })
                            .join("\n")}
}
`
                    )
                    .join("\n"),
            }}
        />
    )
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
                                 active,
                                 payload,
                                 label,
                                 hideLabel = false,
                                 className,
                                 config,
                                 labelFormatter,
                             }: any) {
    if (!active || !payload?.length) {
        return null
    }

    const tooltipLabel = React.useMemo(() => {
        if (hideLabel || !label) {
            return null
        }

        if (labelFormatter) {
            return labelFormatter(label, payload)
        }

        return label
    }, [label, hideLabel, labelFormatter, payload])

    return (
        <div className={cn("bg-background border-border rounded-lg border p-3 shadow-md min-w-[180px]", className)}>
            {tooltipLabel && (
                <div className="mb-2 font-semibold text-sm border-b pb-1">
                    {tooltipLabel}
                </div>
            )}
            <div className="grid gap-1.5">
                {payload.map((item: any) => {
                    const dataKey = item.dataKey || item.name;
                    const name = config?.[dataKey]?.label || item.name;

                    return (
                        <div key={item.name} className="flex items-center justify-between gap-4 w-full">
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{backgroundColor: item.color || item.payload.fill || item.stroke}}
                                />
                                <span className="text-muted-foreground text-xs">{name}</span>
                            </div>
                            <span className="font-mono font-medium text-xs tabular-nums">
                {item.value?.toLocaleString()}
              </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
                                className,
                                hideIcon = false,
                                payload,
                                verticalAlign = "bottom",
                                nameKey,
                            }: React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean
    nameKey?: string
}) {
    const {config} = useChart()

    if (!payload?.length) {
        return null
    }

    return (
        <div
            className={cn(
                "flex items-center justify-center gap-4",
                verticalAlign === "top" ? "pb-3" : "pt-3",
                className
            )}
        >
            {payload
                .filter((item) => item.type !== "none")
                .map((item) => {
                    const key = `${nameKey || item.dataKey || "value"}`
                    const itemConfig = getPayloadConfigFromPayload(config, item, key)

                    return (
                        <div
                            key={item.value}
                            className={cn(
                                "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
                            )}
                        >
                            {itemConfig?.icon && !hideIcon ? (
                                <itemConfig.icon/>
                            ) : (
                                <div
                                    className="h-2 w-2 shrink-0 rounded-[2px]"
                                    style={{
                                        backgroundColor: item.color,
                                    }}
                                />
                            )}
                            {itemConfig?.label}
                        </div>
                    )
                })}
        </div>
    )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
    config: ChartConfig,
    payload: unknown,
    key: string
) {
    if (typeof payload !== "object" || payload === null) {
        return undefined
    }

    const payloadPayload =
        "payload" in payload &&
        typeof payload.payload === "object" &&
        payload.payload !== null
            ? payload.payload
            : undefined

    let configLabelKey: string = key

    if (
        key in payload &&
        typeof payload[key as keyof typeof payload] === "string"
    ) {
        configLabelKey = payload[key as keyof typeof payload] as string
    } else if (
        payloadPayload &&
        key in payloadPayload &&
        typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
    ) {
        configLabelKey = payloadPayload[
            key as keyof typeof payloadPayload
            ] as string
    }

    return configLabelKey in config
        ? config[configLabelKey]
        : config[key as keyof typeof config]
}

export {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartStyle,
}
