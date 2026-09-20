"use client";

import {useTranslations} from "next-intl";
import {AuditedType, AuditSource} from "@/gql/schema";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {DataFilter} from "@/components/data-filter";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {auditTypeLabel} from "@/utils/audit";

export const ALL_TYPES = "ALL";

export type ChangeLogFilter = {
    type: string;
    authors: Set<string>;
    sources: Set<string>;
    /** Whole dates (`YYYY-MM-DD`), inclusive at both ends; empty means unbounded. */
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
        <div className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">{t("Audit.entityType")}</Label>
                <Select
                    value={filter.type}
                    onValueChange={(next) => next !== null && onChange({...filter, type: next})}
                    items={typeItems}
                >
                    <SelectTrigger className="h-8 w-full sm:w-50">
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        {typeItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">{t("Common.lastModifiedBy")}</Label>
                <DataFilter
                    title={t("Audit.anyAuthor")}
                    options={authors.map((author) => ({value: author, label: author}))}
                    selectedValues={filter.authors}
                    onSelect={(authors) => onChange({...filter, authors})}
                    onClear={() => onChange({...filter, authors: new Set()})}
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">{t("Audit.origin")}</Label>
                <DataFilter
                    title={t("Audit.anyOrigin")}
                    options={Object.values(AuditSource).map((value) => ({
                        value,
                        label: t(`Audit.sources.${value}`),
                    }))}
                    selectedValues={filter.sources}
                    onSelect={(sources) => onChange({...filter, sources})}
                    onClear={() => onChange({...filter, sources: new Set()})}
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="audit-from" className="text-[11px] text-muted-foreground">{t("Audit.from")}</Label>
                <Input id="audit-from" type="date" className="h-8 w-full sm:w-37.5" value={filter.from}
                       max={filter.to || undefined}
                       onChange={(e) => onChange({...filter, from: e.target.value})}/>
            </div>

            <div className="flex flex-col gap-1">
                <Label htmlFor="audit-to" className="text-[11px] text-muted-foreground">{t("Audit.to")}</Label>
                <Input id="audit-to" type="date" className="h-8 w-full sm:w-37.5" value={filter.to}
                       min={filter.from || undefined}
                       onChange={(e) => onChange({...filter, to: e.target.value})}/>
            </div>

            {isFiltered(filter) && (
                <Button variant="ghost" size="sm" className="h-8" onClick={() => onChange(EMPTY_FILTER)}>
                    {t("Common.resetFilters")}
                </Button>
            )}
        </div>
    );
}
