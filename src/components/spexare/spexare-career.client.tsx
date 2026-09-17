"use client";

import {useMemo, useState} from "react";
import {useTranslations} from "next-intl";
import {History} from "lucide-react";

import {Activity, Actor, TaskActivity} from "@/gql/schema";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {DataEmpty} from "@/components/data-empty";

const SERIES = [
    "var(--viz-series-1)",
    "var(--viz-series-2)",
    "var(--viz-series-3)",
    "var(--viz-series-4)",
];

const OVERFLOW = "var(--color-muted-foreground)";

const CELL = "min-w-3.5 max-w-11 flex-1 basis-0 shrink-0";

type YearEntry = {
    year: number;
    spex: { title: string; category: string; revival: boolean }[];
    tasks: { name: string; roles: string[] }[];
};

type CareerProps = {
    activities?: Activity[];
};

const asYear = (value?: string | null) => {
    const parsed = Number.parseInt(String(value ?? ""), 10);
    return Number.isFinite(parsed) ? parsed : null;
};

function paletteFor(names: string[]) {
    const ordered = [...new Set(names.filter(Boolean))].sort((a, b) => a.localeCompare(b));
    return new Map(ordered.map((name, index) => [name, SERIES[index] ?? OVERFLOW]));
}

const fill = (colors: string[]) => colors.length === 1
    ? colors[0]
    : `linear-gradient(90deg, ${colors
        .map((color, i) => `${color} ${(i / colors.length) * 100}% ${((i + 1) / colors.length) * 100}%`)
        .join(", ")})`;

function buildYears(activities: Activity[]): YearEntry[] {
    const byYear = new Map<number, YearEntry>();

    for (const activity of activities) {
        const spex = activity.spexActivity?.spex;
        const year = asYear(spex?.year);

        if (year === null || !spex) {
            continue;
        }

        let entry = byYear.get(year);

        if (!entry) {
            entry = {year, spex: [], tasks: []};
            byYear.set(year, entry);
        }

        entry.spex.push({
            title: spex.title,
            category: spex.category?.name ?? "",
            revival: Boolean(spex.revival),
        });

        const taskActivities = (activity.taskActivities ?? []).filter((t): t is TaskActivity => !!t);

        for (const taskActivity of taskActivities) {
            const roles = (taskActivity.actors ?? [])
                .filter((a): a is Actor => !!a)
                .map((actor) => actor.role ?? actor.vocal?.label ?? "")
                .filter(Boolean);

            entry.tasks.push({name: taskActivity.task.name, roles});
        }
    }

    if (byYear.size === 0) {
        return [];
    }

    const years = [...byYear.keys()];
    const from = Math.min(...years);
    const to = Math.max(...years);

    return Array.from({length: to - from + 1}, (_, i) => byYear.get(from + i) ?? {
        year: from + i,
        spex: [],
        tasks: [],
    });
}

export function SpexareCareer({activities = []}: CareerProps) {
    const t = useTranslations();
    const [showTable, setShowTable] = useState(false);

    const years = useMemo(() => buildYears(activities), [activities]);

    const palette = useMemo(
        () => paletteFor(years.flatMap((y) => y.spex.map((s) => s.category))),
        [years],
    );

    const stats = useMemo(() => {
        const tasks = years.flatMap((y) => y.tasks);
        const from = years[0]?.year;
        const to = years[years.length - 1]?.year;

        return {
            spex: years.reduce((total, y) => total + y.spex.length, 0),
            activeYears: years.filter((y) => y.spex.length > 0).length,
            // A single-year career is a year, not a period: no "2013-2013".
            span: from === to ? `${from}` : `${from}–${to}`,
            // Distinct functions held, not how many times each was held.
            functions: new Set(tasks.map((task) => task.name)).size,
            roles: tasks.flatMap((task) => task.roles).length,
        };
    }, [years]);

    if (years.length === 0) {
        return <DataEmpty icon={History}/>;
    }

    const legend = [...palette.entries()].map(([label, color]) => ({label, color}));

    return (
        <section className="flex min-w-0 flex-col gap-6">
            <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                {[
                    {label: t("Spexare.Career.statSpex"), value: stats.spex},
                    {label: t("Spexare.Career.statActiveYears"), value: stats.activeYears},
                    {label: t("Spexare.Career.statSpan"), value: stats.span, wide: true},
                    {label: t("Spexare.Career.statFunctions"), value: stats.functions},
                    {label: t("Spexare.Career.statRoles"), value: stats.roles},
                ].map((stat) => (
                    <div key={stat.label}
                         className={`overflow-hidden rounded-lg border p-2.5 ${stat.wide ? "md:col-span-2" : ""}`}>
                        <dt className="truncate text-xs text-muted-foreground">{stat.label}</dt>
                        <dd className="truncate text-lg font-semibold tabular-nums">{stat.value}</dd>
                    </div>
                ))}
            </dl>

            <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{t("Spexare.Career.heading")}</h3>
                <Button variant="outline" size="sm" className="h-8"
                        onClick={() => setShowTable((previous) => !previous)}>
                    {t(showTable ? "Spexare.Career.showChart" : "Spexare.Career.showTable")}
                </Button>
            </div>

            {showTable ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("Spexare.Career.year")}</TableHead>
                                <TableHead>{t("Spex.heading")}</TableHead>
                                <TableHead>{t("Task.heading")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {years.filter((y) => y.spex.length > 0).map((entry) => (
                                <TableRow key={entry.year}>
                                    <TableCell className="tabular-nums">{entry.year}</TableCell>
                                    <TableCell>{entry.spex.map((s) => s.title).join(", ")}</TableCell>
                                    <TableCell>
                                        {entry.tasks
                                            .map((task) => task.roles.length > 0
                                                ? `${task.name} (${task.roles.join(", ")})`
                                                : task.name)
                                            .join(", ") || "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <TooltipProvider>
                    <div className="min-w-0 overflow-x-auto pb-1">
                        <div className="flex flex-col gap-1">
                            <div className="flex gap-0.5">
                                {years.map((entry) => {
                                    const colors = [...new Set(entry.spex.map((s) => s.category))]
                                        .map((name) => palette.get(name) ?? OVERFLOW);

                                    if (colors.length === 0) {
                                        return (
                                            <span key={entry.year}
                                                  className={`${CELL} h-6 rounded border border-dashed border-border`}/>
                                        );
                                    }

                                    return (
                                        <Tooltip key={entry.year}>
                                            <TooltipTrigger
                                                render={
                                                    <button
                                                        type="button"
                                                        aria-label={`${t("Spex.heading")} ${entry.year}`}
                                                        className={`${CELL} h-6 rounded`}
                                                        style={{background: fill(colors)}}
                                                    />
                                                }
                                            />
                                            <TooltipContent className="text-xs">
                                                <div className="flex flex-col gap-1">
                                                    <p className="font-medium tabular-nums">{entry.year}</p>
                                                    {entry.spex.map((s) => (
                                                        <p key={s.title}>
                                                            {s.title}{s.category ? ` · ${s.category}` : ""}
                                                        </p>
                                                    ))}
                                                    {entry.tasks.map((task) => (
                                                        <p key={task.name} className="text-background/70">
                                                            {task.roles.length > 0
                                                                ? `${task.name} (${task.roles.join(", ")})`
                                                                : task.name}
                                                        </p>
                                                    ))}
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                            <div className="flex gap-0.5">
                                {years.map((entry, index) => {
                                    const tick = index === 0
                                        || index === years.length - 1
                                        || entry.year % 5 === 0;

                                    return (
                                        <span key={entry.year}
                                              className={`${CELL} text-center text-[10px] leading-4 text-muted-foreground tabular-nums`}>
                                            {tick ? `'${String(entry.year).slice(2)}` : ""}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </TooltipProvider>
            )}

            {!showTable && legend.length > 0 && (
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {legend.map((item) => (
                        <li key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span aria-hidden className="size-2.5 rounded-sm"
                                  style={{backgroundColor: item.color}}/>
                            {item.label}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
