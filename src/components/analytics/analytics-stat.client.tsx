"use client";

import Link from "next/link";
import {LucideIcon} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/utils/utils";

interface AnalyticsStatProps {
    label: string;
    value: number | string;
    hint?: string;
    icon?: LucideIcon;
    href?: string | null;
    className?: string;
}

export function AnalyticsStat({label, value, hint, icon: Icon, href, className}: AnalyticsStatProps) {
    const body = (
        <Card className={cn("h-full transition-colors", href && "hover:bg-accent/50", className)}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs text-muted-foreground truncate" title={label}>{label}</span>
                    <span className="text-3xl font-bold tabular-nums leading-tight">
                        {typeof value === "number" ? value.toLocaleString() : value}
                    </span>
                    {hint && <span className="text-[11px] text-muted-foreground truncate" title={hint}>{hint}</span>}
                </div>
                {Icon && <Icon className="size-4 shrink-0 opacity-60"/>}
            </CardContent>
        </Card>
    );

    return href ? <Link href={href} className="block h-full">{body}</Link> : body;
}
