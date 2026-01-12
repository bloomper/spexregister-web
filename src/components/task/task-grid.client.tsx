"use client";

import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {Task, TaskCategory} from "@/gql/graphql";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPageAction} from "@/app/(app)/tasks/actions.server";
import {DataFilter} from "@/components/data-filter";
import {ClipboardList, Pencil, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {DataEmpty} from "@/components/data-empty";
import {useRouter} from "next/navigation";
import {Sheet} from "@/components/ui/sheet";
import {TaskForm} from "@/components/task/task-form.client";

export function TaskGrid({
                             initialItems = [],
                             initialPageInfo,
                             maxItems,
                             categories = [],
                             canUpdate = false,
                         }: {
    initialItems?: Task[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    categories?: TaskCategory[];
    canUpdate?: boolean;
}) {
    const t = useTranslations();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [filterQuery, setFilterQuery] = useState("");
    const [selected, setSelected] = useState<Task | null>(null);
    const [editItem, setEditItem] = useState<Task | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        new Set([...categories.map((c) => c.id), "none"])
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilterQuery(searchValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue]);

    const fetchPageWithFilters = useCallback((args: { after: string | null; pageSize: number }) => {
        const filterParts = [];

        if (filterQuery.trim()) {
            const escapedQuery = filterQuery.trim();
            filterParts.push(`(name:*${escapedQuery}*)`);
        }

        const totalOptionCount = categories.length + 1;

        if (selectedCategories.size < totalOptionCount) {
            if (selectedCategories.size === 0) {
                filterParts.push(`id:NULL`);
            } else {
                const categoryParts: string[] = [];
                selectedCategories.forEach(id => {
                    if (id === "none") {
                        categoryParts.push(`category:NULL`);
                    } else {
                        categoryParts.push(`category.id:${id}`);
                    }
                });
                filterParts.push(`(${categoryParts.join(" OR ")})`);
            }
        }

        return getPageAction({
            after: args.after,
            first: args.pageSize,
            filter: filterParts.join(" AND ")
        });
    }, [categories.length, selectedCategories, filterQuery]);


    const {
        items: allItems,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore,
        reset
    } = useInfiniteCursor<Task>({
        fetchPageAction: fetchPageWithFilters,
        pageSize: 24,
        rootMargin: '600px',
        getKeyAction: (n) => n.id,
        initialItems,
        initialPageInfo,
    });

    useEffect(() => {
        reset();
    }, [filterQuery, selectedCategories, reset]);

    const handleCategorySelect = (newValues: Set<string>) => {
        setSelectedCategories(newValues);
        reset();
    };

    const handleClearCategories = () => {
        const allIds = new Set([...categories.map(c => c.id), "none"]);
        setSelectedCategories(allIds);
        reset();
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const items = maxItems ? allItems.slice(0, maxItems) : allItems;
    const isInfiniteMode = !maxItems;
    const noResults = !loading && items.length === 0;
    const totalOptionCount = categories.length + 1;
    const isFiltered = filterQuery.trim() !== "" || (categories.length > 0 && selectedCategories.size < totalOptionCount);

    return (
        <>
            {isInfiniteMode && (
                <div className="col-span-full mb-6 flex flex-col gap-4 border-b pb-6">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">{t("Task.heading")}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full sm:w-[300px]">
                            <Input
                                placeholder={t("Task.filterPlaceholder")}
                                value={searchValue}
                                onChange={handleQueryChange}
                                className="h-8 text-xs pr-8"
                            />
                            {searchValue && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-8 w-8 hover:bg-transparent"
                                    onClick={() => {
                                        setSearchValue("");
                                    }}
                                >
                                    <X className="h-3 w-3"/>
                                </Button>
                            )}
                        </div>
                        {categories.length > 0 && (
                            <DataFilter
                                title={t("Task.category")}
                                options={[
                                    ...categories.map((c) => ({
                                        label: c.name,
                                        value: c.id,
                                    })),
                                    {label: t("Common.none"), value: "none"}
                                ]}
                                selectedValues={selectedCategories}
                                onSelect={handleCategorySelect}
                                onClear={handleClearCategories}
                            />
                        )}
                        {(searchValue || selectedCategories.size < totalOptionCount) && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSearchValue("");
                                    handleClearCategories();
                                }}
                                className="h-8 px-2 lg:px-3 text-xs"
                            >
                                {t("Common.reset")}
                                <X className="ml-2 h-4 w-4"/>
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {noResults ? (
                <div className="col-span-full py-12">
                    <DataEmpty
                        title={isFiltered ? t("Common.noFilterMatchHeading") : t("Common.noDataHeading")}
                        description={isFiltered ? t("Common.noFilterMatchDescription") : t("Common.noDataDescription")}
                        icon={ClipboardList}
                    />
                </div>
            ) : (
                items.map((n) => (
                    <Card
                        key={n.id}
                        className="group relative h-full transition-colors hover:bg-muted/50 cursor-pointer overflow-hidden flex flex-col p-0"
                    >
                        {canUpdate && (
                            <div className="absolute top-2 right-2 z-20">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-background/80 hover:bg-background"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditItem(n);
                                    }}
                                >
                                    <Pencil className="h-4 w-4"/>
                                </Button>
                            </div>
                        )}
                        <div
                            className="flex flex-col h-full"
                            onClick={() => setSelected(n)}
                        >
                            <CardHeader className="space-y-0.5 p-3">
                                <div className="flex items-center justify-between gap-2">
                                    <CardDescription className="text-[10px]">
                                        {n.category?.name ?? t("Common.none")}
                                    </CardDescription>
                                </div>
                                <CardTitle className="line-clamp-1 text-sm font-bold leading-tight">{n.name}</CardTitle>
                            </CardHeader>
                        </div>
                    </Card>
                ))
            )}

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{selected?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-6 flex flex-col gap-4 text-sm">
                            <div>
                                <div
                                    className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
                                    {t("Task.category")}
                                </div>
                                <div className="text-base">{selected?.category?.name ?? t("Common.none")}</div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-6 pt-0">
                        <Button variant="outline" onClick={() => setSelected(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <TaskForm
                        item={editItem}
                        categories={categories}
                        onSuccess={() => {
                            setEditItem(null);
                            reset();
                            router.refresh();
                        }}
                    />
                )}
            </Sheet>

            {isInfiniteMode && (
                <InfiniteScrollFooter
                    sentinelRef={sentinelRef}
                    loading={loading}
                    error={error}
                    hasNextPage={hasNextPage}
                    itemsCount={items.length}
                    onRetry={() => loadMore(true)}
                />
            )}
        </>
    );
}