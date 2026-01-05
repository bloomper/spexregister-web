"use client";

import {ColumnDef} from "@tanstack/react-table";
import {CheckCircle2, Circle, Plus, User, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Spexare} from "@/gql/graphql";
import {getProxiedImageUrl} from "@/utils/utils";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {SpexareForm} from "@/components/spexare";
import {useEffect, useRef, useState} from "react";
import {bulkDeleteAction, deleteAction, getPageAction} from "@/app/(app)/spexare/actions.server";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useDataTableActions} from "@/hooks/use-data-table-actions";
import {DataFilter} from "@/components/data-filter";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {format, parse} from "date-fns";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";
import {AuditInfo} from "@/components/data-table-audit-info.client";
import {columnHelper} from "@/components/data-table-columns.client";


export const columns: ColumnDef<Spexare>[] = [
    columnHelper.select(),
    columnHelper.text("firstName", "Spexare.firstName"),
    columnHelper.text("lastName", "Spexare.lastName"),
    columnHelper.text("nickName", "Spexare.nickName", "nickName", "hidden md:table-cell"),
    columnHelper.image("image", "Spexare.imageUrl", "imageUrl", User),
    columnHelper.boolean("published", "Spexare.published", "hidden md:table-cell"),
    columnHelper.boolean("deceased", "Spexare.deceased", "hidden md:table-cell"),
    ...columnHelper.audit<Spexare>(),
    columnHelper.actions<Spexare>(),
];

export function SpexareTable({
                                 initialData,
                             }: {
    initialData: CursorPage<Spexare>,
}) {
    const t = useTranslations();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedPublishedValues, setSelectedPublishedValues] = useState<Set<string>>(new Set(["true", "false"]));
    const [selectedDeceasedValues, setSelectedDeceasedValues] = useState<Set<string>>(new Set(["true", "false"]));
    const setFilterQueryRef = useRef<((filter: string) => void) | null>(null);

    const {
        viewItem, setViewItem,
        editItem, setEditItem,
        deleteItem, setDeleteItem,
        selectedRows, setSelectedRows,
        isBulkDeleting, setIsBulkDeleting,
        isPending,
        handleDelete,
        handleBulkDelete
    } = useDataTableActions<Spexare>(
        deleteAction,
        bulkDeleteAction,
        () => {
            setFilterQuery("");
            setSelectedPublishedValues(new Set(["true", "false"]));
            setSelectedDeceasedValues(new Set(["true", "false"]));
        }
    );

    useEffect(() => {
        setMounted(true);
    }, []);


    const buildFilterString = (query: string, published: Set<string>, deceased: Set<string>) => {
        const parts: string[] = [];
        if (query) {
            parts.push(`(firstName:*${query}* OR lastName:*${query}* OR nickName:*${query}*)`);
        }
        if (published.size < 2) {
            if (published.size === 0) {
                parts.push(`published:NULL`);
            } else {
                const val = published.has("true") ? "TRUE" : "FALSE";
                parts.push(`published:${val}`);
            }
        }
        if (deceased.size < 2) {
            if (deceased.size === 0) {
                parts.push(`deceased:NULL`);
            } else {
                const val = deceased.has("true") ? "TRUE" : "FALSE";
                parts.push(`deceased:${val}`);
            }
        }
        return parts.join(" AND ");
    };

    const lastFilterQueryRef = useRef<string>(buildFilterString("", new Set(["true", "false"]), new Set(["true", "false"])));
    const isFilterActive = filterQuery !== "" || selectedPublishedValues.size < 2 || selectedDeceasedValues.size < 2;

    useEffect(() => {
        const query = buildFilterString(filterQuery, selectedPublishedValues, selectedDeceasedValues);

        const timer = setTimeout(() => {
            if (setFilterQueryRef.current && query !== lastFilterQueryRef.current) {
                lastFilterQueryRef.current = query;
                setFilterQueryRef.current(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [filterQuery, selectedPublishedValues, selectedDeceasedValues]);

    if (!mounted) {
        return <DataTableSkeleton columnCount={9} rowCount={15}/>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                initialSorting={[{id: "firstName", desc: true}]}
                onRowClick={setViewItem}
                onSelectionChange={setSelectedRows}
                onFetch={(args) => getPageAction({...args, full: true})}
                meta={{
                    setEditItem,
                    setDeleteItem,
                    setFilter: (fn: any) => {
                        setFilterQueryRef.current = typeof fn === 'function' && fn.length === 0 ? fn() : fn;
                    },
                }}
            >
                <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            placeholder={t("Spexare.filterPlaceholder")}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                        />

                        <div className="flex items-center gap-2">
                            <DataFilter
                                title={t("Spexare.published")}
                                selectedValues={selectedPublishedValues}
                                onSelect={setSelectedPublishedValues}
                                onClear={() => setSelectedPublishedValues(new Set(["true", "false"]))}
                                options={[
                                    {label: t("Spexare.publishedStates.true"), value: "true", icon: CheckCircle2},
                                    {label: t("Spexare.publishedStates.false"), value: "false", icon: Circle},
                                ]}
                            />

                            <DataFilter
                                title={t("Spexare.deceased")}
                                selectedValues={selectedDeceasedValues}
                                onSelect={setSelectedDeceasedValues}
                                onClear={() => setSelectedDeceasedValues(new Set(["true", "false"]))}
                                options={[
                                    {label: t("Spexare.deceasedStates.true"), value: "true", icon: CheckCircle2},
                                    {label: t("Spexare.deceasedStates.false"), value: "false", icon: Circle},
                                ]}
                            />

                            {isFilterActive && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setFilterQuery("");
                                        setSelectedPublishedValues(new Set(["true", "false"]));
                                        setSelectedDeceasedValues(new Set(["true", "false"]));
                                    }}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    {t("Common.reset")}
                                    <X className="ml-2 h-4 w-4"/>
                                </Button>
                            )}

                            {selectedRows.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => setIsBulkDeleting(true)}
                                >
                                    {t("Common.delete")} ({selectedRows.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    <Button asChild size="sm" className="h-8 w-full lg:w-auto">
                        <Link href="/spexare/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Spexare.createHeading")}
                        </Link>
                    </Button>
                </div>
            </DataTable>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                    <div className="relative aspect-video w-full bg-muted border-b">
                        {viewItem?.imageUrl ? (
                            <Image
                                src={getProxiedImageUrl(viewItem.imageUrl, viewItem.lastModifiedAt)}
                                alt={`${viewItem.firstName} ${viewItem.lastName}`}
                                fill
                                unoptimized
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <User className="h-24 w-24 text-muted-foreground/20 stroke-1"/>
                            </div>
                        )}
                    </div>
                    <div className="p-6">
                        <DialogHeader className="text-left">
                            <div className="flex items-start justify-between gap-2 text-left">
                                <div className="flex flex-col gap-1">
                                    <DialogTitle className="text-2xl leading-none text-left">
                                        {viewItem?.firstName} {viewItem?.lastName}
                                    </DialogTitle>
                                    {viewItem?.nickName && (
                                        <div className="text-muted-foreground italic text-lg leading-none text-left">
                                            {viewItem.nickName}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap justify-end gap-2 mt-1 shrink-0">
                                    {viewItem?.deceased &&
                                        <Badge variant="outline"
                                               className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                            {t("Spexare.deceasedBadges.true")}
                                        </Badge>
                                    }
                                    {!viewItem?.published &&
                                        <Badge variant="outline"
                                               className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                            {t("Spexare.publishedBadges.false")}
                                        </Badge>
                                    }
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="mt-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                {viewItem?.socialSecurityNumber && (
                                    <div className="space-y-1">
                                        <div
                                            className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                            {viewItem.socialSecurityNumber.includes("-") ? t("Spexare.socialSecurityNumber") : t("Spexare.birthDate")}
                                        </div>
                                        <div className="text-sm font-medium text-foreground">
                                            {viewItem.socialSecurityNumber.includes("-")
                                                ? viewItem.socialSecurityNumber
                                                : format(parse(viewItem.socialSecurityNumber, "yyyyMMdd", new Date()), "yyyy-MM-dd")
                                            }
                                        </div>
                                    </div>
                                )}
                                {viewItem?.graduation && (
                                    <div className="space-y-1">
                                        <div
                                            className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                            {t("Spexare.graduation")}
                                        </div>
                                        <div className="text-sm font-medium text-foreground">{viewItem.graduation}</div>
                                    </div>
                                )}
                                {viewItem?.comment && (
                                    <div className="sm:col-span-2 space-y-1">
                                        <div
                                            className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                            {t("Spexare.comment")}
                                        </div>
                                        <div
                                            className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-3 rounded-md border border-muted">
                                            {viewItem.comment}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {viewItem && (
                                <AuditInfo item={viewItem}/>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="p-6 pt-0">
                        <Button variant="outline" onClick={() => setViewItem(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <SpexareForm
                        item={editItem}
                        onSuccess={() => {
                            setEditItem(null);
                            setFilterQuery("");
                            setSelectedPublishedValues(new Set(["true", "false"]));
                            setSelectedDeceasedValues(new Set(["true", "false"]));
                            router.refresh();
                        }}
                    />
                )}
            </Sheet>

            <DataTableDeleteDialogs
                deleteItem={deleteItem}
                setDeleteItem={setDeleteItem}
                isBulkDeleting={isBulkDeleting}
                setIsBulkDeleting={setIsBulkDeleting}
                isPending={isPending}
                handleDelete={handleDelete}
                handleBulkDelete={handleBulkDelete}
            />
        </>
    );
}