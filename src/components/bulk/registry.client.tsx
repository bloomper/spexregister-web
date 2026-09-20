"use client";

import {ReactNode, useState} from "react";
import {useTranslations} from "next-intl";
import {
    CheckCheck,
    Drama,
    ListChecks,
    LucideIcon,
    SlidersHorizontal,
    Tag as TagIcon,
    ToggleRight,
    Wrench,
} from "lucide-react";
import {Spex, SpexareBulkOperation, Tag, Task, Type, TypeType} from "@/gql/schema";
import {DataFilter} from "@/components/data-filter";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export type BulkOptions = {
    tags: Tag[];
    spex: Spex[];
    tasks: Task[];
    types: Type[];
};

export type BulkPayload = {
    tags?: string[];
    spex?: string[];
    tasks?: string[];
    spexId?: string;
    values?: { typeId: string; value: boolean }[];
    fields?: { published?: boolean; deceased?: boolean };
};

type FieldsProps = {
    payload: BulkPayload;
    setPayload: (next: BulkPayload) => void;
    options: BulkOptions;
    disabled: boolean;
};

type BulkOperationDef = {
    operation: SpexareBulkOperation;
    group: string;
    icon: LucideIcon;
    isComplete: (payload: BulkPayload) => boolean;
    Fields: (props: FieldsProps) => ReactNode;
};

const spexLabel = (s: Spex) => [s.year, s.title].filter(Boolean).join(" ");

function TypeValueFields({payload, setPayload, options, disabled, typeType}: FieldsProps & { typeType: TypeType }) {
    const t = useTranslations();
    const [value, setValue] = useState(true);
    const picked = new Set(payload.values?.map((v) => v.typeId) ?? []);
    const available = options.types.filter((type) => type.type === typeType);

    const write = (typeIds: Set<string>, nextValue: boolean) => {
        setValue(nextValue);
        setPayload({...payload, values: [...typeIds].map((typeId) => ({typeId, value: nextValue}))});
    };

    return (
        <div className="space-y-3">
            <DataFilter
                title={t("Spexare.bulk.fields.types")}
                options={available.map((type) => ({label: type.label, value: type.id}))}
                selectedValues={picked}
                onSelect={(next) => write(next, value)}
                onClear={() => write(new Set(), value)}
            />
            <div className="flex items-center gap-3">
                <Switch
                    id="bulk-type-value"
                    checked={value}
                    disabled={disabled}
                    onCheckedChange={(next) => write(picked, next)}
                />
                <Label htmlFor="bulk-type-value">
                    {value ? t("Spexare.bulk.fields.valueYes") : t("Spexare.bulk.fields.valueNo")}
                </Label>
            </div>
        </div>
    );
}

function Picker({
                    payload,
                    setPayload,
                    title,
                    field,
                    options,
                }: {
    payload: BulkPayload;
    setPayload: (next: BulkPayload) => void;
    title: string;
    field: "tags" | "spex" | "tasks";
    options: { label: string; value: string; groupLabel?: string; sortKey?: string }[];
}) {
    const picked = new Set(payload[field] ?? []);

    return (
        <DataFilter
            title={title}
            options={options}
            selectedValues={picked}
            onSelect={(next) => setPayload({...payload, [field]: [...next]})}
            onClear={() => setPayload({...payload, [field]: []})}
        />
    );
}

function TagFields({payload, setPayload, options}: FieldsProps) {
    const t = useTranslations();

    return (
        <Picker
            payload={payload}
            setPayload={setPayload}
            title={t("Spexare.bulk.fields.tags")}
            field="tags"
            options={options.tags.map((tag) => ({label: tag.name, value: tag.id}))}
        />
    );
}

function SpexFields({payload, setPayload, options}: FieldsProps) {
    const t = useTranslations();

    return (
        <Picker
            payload={payload}
            setPayload={setPayload}
            title={t("Spexare.bulk.fields.spex")}
            field="spex"
            options={options.spex.map((s) => ({
                label: spexLabel(s),
                value: s.id,
                groupLabel: s.category?.name ?? undefined,
                sortKey: `${s.year ?? ""}`,
            }))}
        />
    );
}

function TaskFields({payload, setPayload, options, disabled}: FieldsProps) {
    const t = useTranslations();
    const spexItems = options.spex.map((s) => ({value: s.id, label: spexLabel(s)}));

    return (
        <div className="space-y-3">
            <div className="space-y-1.5">
                <Label htmlFor="bulk-spex">{t("Spexare.bulk.fields.spex")}</Label>
                <Select
                    value={payload.spexId ?? ""}
                    onValueChange={(next) => setPayload({...payload, spexId: next as string})}
                    disabled={disabled}
                    items={spexItems}
                >
                    <SelectTrigger id="bulk-spex" className="w-full">
                        <SelectValue placeholder={t("Spexare.bulk.fields.selectSpex")}/>
                    </SelectTrigger>
                    <SelectContent>
                        {spexItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{t("Spexare.bulk.fields.spexHint")}</p>
            </div>

            <Picker
                payload={payload}
                setPayload={setPayload}
                title={t("Spexare.bulk.fields.tasks")}
                field="tasks"
                options={options.tasks.map((task) => ({
                    label: task.name,
                    value: task.id,
                    groupLabel: task.category?.name ?? undefined,
                }))}
            />
        </div>
    );
}

function TriState({
                      id,
                      label,
                      value,
                      onChange,
                      disabled,
                  }: {
    id: string;
    label: string;
    value: boolean | undefined;
    onChange: (next: boolean | undefined) => void;
    disabled: boolean;
}) {
    const t = useTranslations();
    const items = [
        {value: "unchanged", label: t("Spexare.bulk.fields.unchanged")},
        {value: "true", label: t("Common.yes")},
        {value: "false", label: t("Common.no")},
    ];

    return (
        <div className="space-y-1.5">
            <Label htmlFor={id}>{label}</Label>
            <Select
                value={value === undefined ? "unchanged" : String(value)}
                onValueChange={(next) => onChange(next === "unchanged" ? undefined : next === "true")}
                disabled={disabled}
                items={items}
            >
                <SelectTrigger id={id} className="w-full">
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function FieldsSetFields({payload, setPayload, disabled}: FieldsProps) {
    const t = useTranslations();
    const fields = payload.fields ?? {};

    return (
        <div className="space-y-3">
            <TriState
                id="bulk-published"
                label={t("Spexare.published")}
                value={fields.published}
                onChange={(next) => setPayload({...payload, fields: {...fields, published: next}})}
                disabled={disabled}
            />
            <TriState
                id="bulk-deceased"
                label={t("Spexare.deceased")}
                value={fields.deceased}
                onChange={(next) => setPayload({...payload, fields: {...fields, deceased: next}})}
                disabled={disabled}
            />
        </div>
    );
}

const tagOperation = (operation: SpexareBulkOperation): BulkOperationDef => ({
    operation,
    group: "tag",
    icon: TagIcon,
    isComplete: (p) => Boolean(p.tags?.length),
    Fields: TagFields,
});

const spexOperation = (operation: SpexareBulkOperation): BulkOperationDef => ({
    operation,
    group: "spex",
    icon: Drama,
    isComplete: (p) => Boolean(p.spex?.length),
    Fields: SpexFields,
});

const taskOperation = (operation: SpexareBulkOperation): BulkOperationDef => ({
    operation,
    group: "task",
    icon: Wrench,
    isComplete: (p) => Boolean(p.tasks?.length) && Boolean(p.spexId),
    Fields: TaskFields,
});

export const bulkRegistry: BulkOperationDef[] = [
    tagOperation(SpexareBulkOperation.TagAdd),
    tagOperation(SpexareBulkOperation.TagRemove),
    spexOperation(SpexareBulkOperation.SpexAdd),
    spexOperation(SpexareBulkOperation.SpexRemove),
    taskOperation(SpexareBulkOperation.TaskAdd),
    taskOperation(SpexareBulkOperation.TaskRemove),
    {
        operation: SpexareBulkOperation.ConsentSet,
        group: "settings",
        icon: CheckCheck,
        isComplete: (p) => Boolean(p.values?.length),
        Fields: (props) => <TypeValueFields {...props} typeType={TypeType.Consent}/>,
    },
    {
        operation: SpexareBulkOperation.ToggleSet,
        group: "settings",
        icon: ToggleRight,
        isComplete: (p) => Boolean(p.values?.length),
        Fields: (props) => <TypeValueFields {...props} typeType={TypeType.Toggle}/>,
    },
    {
        operation: SpexareBulkOperation.FieldsSet,
        group: "fields",
        icon: SlidersHorizontal,
        isComplete: (p) => p.fields?.published !== undefined || p.fields?.deceased !== undefined,
        Fields: FieldsSetFields,
    },
];

export const bulkMenuIcon = ListChecks;

export function findBulkOperation(operation: SpexareBulkOperation): BulkOperationDef {
    const found = bulkRegistry.find((def) => def.operation === operation);

    if (!found) {
        throw new Error(`Unknown bulk operation '${operation}'`);
    }

    return found;
}
