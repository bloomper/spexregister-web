"use client";

import {useState} from "react";
import {useLocale, useTranslations} from "next-intl";
import {CalendarRange} from "lucide-react";
import {enGB, sv} from "date-fns/locale";
import type {DateRange} from "react-day-picker";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function toIso(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function fromIso(value: string | undefined): Date | undefined {
    if (!value || !ISO_DATE.test(value)) {
        return undefined;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.getMonth() === month - 1 ? date : undefined;
}

/**
  * The change log's period, in a calendar in the application's language (not the browser's, as a native date field
  * would be). The first click picks the first day, and the log shows everything from it until now; the second picks
  * the last day and closes the calendar. Days travel as yyyy-mm-dd.
  */
export function PeriodFilter({
    from,
    to,
    onChange,
}: {
    from?: string;
    to?: string;
    onChange: (from: string | undefined, to: string | undefined) => void;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [open, setOpen] = useState(false);
    // Whether the next click picks the last day: after the first day, until the calendar closes
    const [pickingEnd, setPickingEnd] = useState(false);
    const start = fromIso(from);
    const end = fromIso(to);
    const selected: DateRange | undefined = start || end ? { from: start ?? end, to: end } : undefined;
    const hasPeriod = Boolean(from || to);

    const pick = (day: Date) => {
        if (pickingEnd && start) {
            const [first, last] = day < start ? [day, start] : [start, day];

            onChange(toIso(first), toIso(last));
            setPickingEnd(false);
            setOpen(false);
            return;
        }
        onChange(toIso(day), undefined);
        setPickingEnd(true);
    };

    return (
        <Popover
            open={open}
            onOpenChange={next => {
                setOpen(next);
                setPickingEnd(false);
            }}
        >
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-dashed"
                    />
                }
            >
                <CalendarRange className="mr-2 h-4 w-4" />
                {t("Audit.period")}
                {hasPeriod && (
                    <>
                        <Separator
                            orientation="vertical"
                            className="mx-2 h-4"
                        />
                        <span className="text-xs tabular-nums">
                            {from || "…"} – {to || t("Audit.untilNow")}
                        </span>
                    </>
                )}
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0"
                align="start"
            >
                <p
                    className="px-3 pt-3 text-xs text-muted-foreground"
                    aria-live="polite"
                >
                    {pickingEnd ? t("Audit.pickEnd") : t("Audit.pickStart")}
                </p>
                <Calendar
                    mode="range"
                    locale={locale === "sv" ? sv : enGB}
                    weekStartsOn={1}
                    selected={selected}
                    defaultMonth={end ?? start}
                    // The clicks are handled here, so the first one leaves the period open-ended
                    onSelect={() => undefined}
                    onDayClick={pick}
                />
                {hasPeriod && (
                    <div className="border-t p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-full"
                            onClick={() => {
                                onChange(undefined, undefined);
                                setPickingEnd(false);
                            }}
                        >
                            {t("Common.reset")}
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
