"use client";

import {useTranslations} from "next-intl";
import {X} from "lucide-react";
import {AuditedType, AuditSource} from "@/gql/schema";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {DataFilter} from "@/components/data-filter";
import {Button} from "@/components/ui/button";
import {auditTypeLabel} from "@/utils/audit";
import {PeriodFilter} from "@/components/audit/period-filter.client";

export const ALL_TYPES = "ALL";

/**
 * What the change log is filtered by: an entity type, authors, sources and a period.
 */
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

            <PeriodFilter from={filter.from} to={filter.to}
                          onChange={(from, to) => onChange({...filter, from: from ?? "", to: to ?? ""})}/>

            {isFiltered(filter) && (
                <Button variant="ghost" onClick={() => onChange(EMPTY_FILTER)} className="h-8 px-2 lg:px-3">
                    <X className="mr-2 h-4 w-4"/>
                    {t("Common.reset")}
                </Button>
            )}
        </div>
    );
}
