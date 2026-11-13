"use client";

import {SpexipediaEditButton} from "@/components/spexipedia-edit-button.client";
import * as React from "react";
import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {useInfiniteList} from "@/hooks/use-infinite-list.client";
import {TaskCategory} from "@/gql/schema";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {getPageAction} from "@/app/(app)/tasks/categories/actions.server";
import {Shapes} from "lucide-react";
import {GridFilterHeader} from "@/components/grid-filter-header.client";
import {DataEmpty} from "@/components/data-empty";
import {TaskCategoryViewDialog} from "@/components/task/category/task-category-view-dialog.client";
import {textFilter} from "@/utils/filter";

export function TaskCategoryGrid({
                                     initialItems = [],
                                     initialPageInfo,
                                     maxItems,
                                     spexipedia = null,
                                 }: {
    initialItems?: TaskCategory[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    spexipedia?: { url: string; canEdit: boolean } | null;
}) {
    const t = useTranslations();
    const [searchValue, setSearchValue] = useState("");
    const [filterQuery, setFilterQuery] = useState("");
    const [selected, setSelected] = useState<TaskCategory | null>(null);

    const {
        items,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore,
        reset,
        isInfiniteMode,
    } = useInfiniteList<TaskCategory>({
        fetchPageAction: (args) => getPageAction({
            after: args.after,
            first: args.pageSize,
            filter: textFilter(["name"], filterQuery) || undefined,
        }),
        pageSize: 24,
        rootMargin: "600px",
        getKeyAction: (n) => n.id,
        initialItems,
        initialPageInfo,
        maxItems,
    });

    useEffect(() => {
        if (searchValue === filterQuery) {
            return;
        }

        const timer = setTimeout(() => {
            setFilterQuery(searchValue);
            reset();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue, filterQuery, reset]);

    const isFiltered = filterQuery.trim() !== "";
    const noResults = isInfiniteMode && !loading && items.length === 0;

    return (
        <>
            {isInfiniteMode && (
                <GridFilterHeader
                    title={t("Task.Category.heading")}
                    placeholder={t("Task.Category.filterPlaceholder")}
                    value={searchValue}
                    onChange={setSearchValue}
                />
            )}

            {noResults && (
                <div className="col-span-full py-12">
                    <DataEmpty
                        title={isFiltered ? t("Common.noFilterMatchHeading") : t("Common.noDataHeading")}
                        description={isFiltered ? t("Common.noFilterMatchDescription") : t("Common.noDataDescription")}
                        icon={Shapes}
                    />
                </div>
            )}

            {items.map((n) => (
                <Card
                    key={n.id}
                    className="group relative h-full overflow-hidden transition-all hover:bg-muted/50 cursor-pointer p-0 gap-0"
                >
                    {spexipedia?.canEdit && (
                        <SpexipediaEditButton href={`${spexipedia.url}/manage/task-categories/${n.id}`}/>
                    )}
                    <div className="flex flex-col h-full" onClick={() => setSelected(n)}>
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-bold line-clamp-2 text-center leading-tight">
                                {n.name}
                            </CardTitle>
                        </CardHeader>
                    </div>
                </Card>
            ))}

            <TaskCategoryViewDialog selected={selected} onClose={() => setSelected(null)}/>

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