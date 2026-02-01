"use client";

import {ColumnDef} from "@tanstack/react-table";
import {CheckCircle2, Circle, Plus, User, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Country, Spex, Spexare, SpexCategory, Tag as TagType, Task, TaskCategory, Type} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {SpexareForm, SpexareView} from "@/components/spexare";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {
    bulkDeleteAction,
    deleteAction,
    exportAction,
    getAction,
    getPageAction,
    importAction
} from "@/app/(app)/spexare/actions.server";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useDataTableActions} from "@/hooks/use-data-table-actions";
import {DataFilter} from "@/components/data-filter";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";
import {columnHelper} from "@/components/data-table-columns.client";
import {ExportButton} from "@/components/impex/export-button.client";
import {ImportButton} from "@/components/impex/import-button.client";
import {Spinner} from "@/components/ui/spinner";


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

interface SpexareTableProps {
    types: Type[],
    countries: Country[];
    tags?: TagType[],
    tasks?: Task[],
    taskCategories?: TaskCategory[],
    spex?: Spex[],
    spexCategories?: SpexCategory[],
    initialData: CursorPage<Spexare>,
    currentSpexareId?: string | null,
}

export function SpexareTable({
                                 types,
                                 tags = [],
                                 countries = [],
                                 tasks = [],
                                 taskCategories = [],
                                 spex = [],
                                 spexCategories = [],
                                 initialData,
                                 currentSpexareId,
                             }: SpexareTableProps) {
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

    const [viewFullItem, setViewFullItem] = useState<Spexare | null>(null);
    const [isViewLoading, setIsViewLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadFull() {
            if (!viewItem?.id) {
                setViewFullItem(null);
                setIsViewLoading(false);
                return;
            }

            setIsViewLoading(true);
            setViewFullItem(null);

            try {
                const full = await getAction(viewItem.id);
                if (!cancelled) {
                    setViewFullItem(full ?? null);
                }
            } finally {
                if (!cancelled) {
                    setIsViewLoading(false);
                }
            }
        }

        void loadFull();
        return () => {
            cancelled = true;
        };
    }, [viewItem?.id]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (viewItem) {
            const updated = initialData.items.find(i => i.id === viewItem.id);
            if (updated) {
                setViewItem(updated);
            }
        }
        if (editItem) {
            const updated = initialData.items.find(i => i.id === editItem.id);
            if (updated) {
                setEditItem(updated);
            }
        }
    }, [initialData, setViewItem, setEditItem]);

    const buildFilterString = (query: string, published: Set<string>, deceased: Set<string>) => {
        const parts: string[] = ["(published:TRUE OR published:FALSE)"];
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
                onFetch={(args) => getPageAction({...args, full: false})}
                rowClassName={(row) =>
                    currentSpexareId && row.id === currentSpexareId
                        ? "relative after:absolute after:inset-y-0 after:left-0 after:w-1 after:bg-linear-to-b after:from-pink-500 after:via-purple-500 after:to-indigo-500 bg-primary/5 hover:bg-primary/10 transition-colors"
                        : ""
                }
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

                        <div className="flex items-center gap-2">
                            <ExportButton
                                exportAction={exportAction}
                                selectedIds={selectedRows.map(r => r.id)}
                                filterQuery={lastFilterQueryRef.current}
                                requiresReportType={true}
                            />

                            <ImportButton importAction={importAction}/>
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

            <Dialog
                open={!!viewItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setViewItem(null);
                        setViewFullItem(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>
                            {viewFullItem
                                ? `${viewFullItem.firstName} ${viewFullItem.lastName}`
                                : viewItem
                                    ? `${viewItem.firstName} ${viewItem.lastName}`
                                    : t("Common.details")}
                        </DialogTitle>
                    </DialogHeader>

                    {isViewLoading ? (
                        <div className="p-6">
                            <div className="flex items-center justify-center py-16">
                                <Spinner className="size-8"/>
                            </div>
                        </div>
                    ) : viewFullItem ? (
                        <SpexareView
                            spexare={viewFullItem}
                            countries={countries}
                            showAudit
                            isMe={viewFullItem.id === currentSpexareId}
                        />
                    ) : (
                        <div className="p-6 text-sm text-muted-foreground">
                            {t("Common.noData")}
                        </div>
                    )}

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
                        types={types}
                        countries={countries}
                        tags={tags}
                        tasks={tasks}
                        taskCategories={taskCategories}
                        spex={spex}
                        spexCategories={spexCategories}
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