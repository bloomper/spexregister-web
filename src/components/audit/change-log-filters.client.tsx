"use client";

import {useTranslations} from "next-intl";
import {CalendarRange, X} from "lucide-react";
import {AuditedType, AuditSource} from "@/gql/schema";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {DataFilter} from "@/components/data-filter";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {auditTypeLabel} from "@/utils/audit";

export const ALL_TYPES = "ALL";

export type ChangeLogFilter = {
    type: string;
    authors: Set<string>;
    sources: Set<string>;
    from: string;
    to: string;
};

export const EMPTY_FILTER: ChangeLogFilter = {
    type: ALL_TYPES,
    authors: new Set(),
    sources: new Set(),
    from: "",
    to: "",
};

export function isFiltered(filter: ChangeLogFilter): boolean {
    return filter.type !== ALL_TYPES
        || filter.authors.size > 0
        || filter.sources.size > 0
        || filter.from !== ""
        || filter.to !== "";
}

export function ChangeLogFilters({filter, authors, onChange}: {
    filter: ChangeLogFilter;
    authors: string[];
    onChange: (next: ChangeLogFilter) => void;
}) {
    const t = useTranslations();

    const typeItems = [
        {value: ALL_TYPES, label: t("Audit.allTypes")},
        ...Object.values(AuditedType).map((value) => ({value, label: auditTypeLabel(t, value)})),
    ];

    const hasPeriod = filter.from !== "" || filter.to !== "";

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Select
                value={filter.type}
                onValueChange={(next) => next !== null && onChange({...filter, type: next})}
                items={typeItems}
            >
                <SelectTrigger size="sm" className="w-full sm:w-50" aria-label={t("Audit.entityType")}>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {typeItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <DataFilter
                title={t("Common.lastModifiedBy")}
                options={authors.map((author) => ({value: author, label: author}))}
                selectedValues={filter.authors}
                onSelect={(authors) => onChange({...filter, authors})}
                onClear={() => onChange({...filter, authors: new Set()})}
            />

            <DataFilter
                title={t("Audit.origin")}
                options={Object.values(AuditSource).map((value) => ({
                    value,
                    label: t(`Audit.sources.${value}`),
                }))}
                selectedValues={filter.sources}
                onSelect={(sources) => onChange({...filter, sources})}
                onClear={() => onChange({...filter, sources: new Set()})}
            />

            <Popover>
                <PopoverTrigger render={<Button variant="outline" size="sm" className="h-8 border-dashed"/>}>
                    <CalendarRange className="mr-2 h-4 w-4"/>
                    {t("Audit.period")}
                    {hasPeriod && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4"/>
                            <span className="text-xs">{filter.from || "…"} – {filter.to || "…"}</span>
                        </>
                    )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="audit-from" className="text-xs text-muted-foreground">
                                {t("Audit.from")}
                            </Label>
                            <Input id="audit-from" type="date" className="h-8 w-44" value={filter.from}
                                   max={filter.to || undefined}
                                   onChange={(e) => onChange({...filter, from: e.target.value})}/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="audit-to" className="text-xs text-muted-foreground">
                                {t("Audit.to")}
                            </Label>
                            <Input id="audit-to" type="date" className="h-8 w-44" value={filter.to}
                                   min={filter.from || undefined}
                                   onChange={(e) => onChange({...filter, to: e.target.value})}/>
                        </div>
                        {hasPeriod && (
                            <Button variant="ghost" size="sm" className="h-8"
                                    onClick={() => onChange({...filter, from: "", to: ""})}>
                                {t("Common.reset")}
                            </Button>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {isFiltered(filter) && (
                <Button variant="ghost" onClick={() => onChange(EMPTY_FILTER)} className="h-8 px-2 lg:px-3">
                    <X className="mr-2 h-4 w-4"/>
                    {t("Common.reset")}
                </Button>
            )}
        </div>
    );
}
