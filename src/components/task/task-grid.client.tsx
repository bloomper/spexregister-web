"use client";

import {useState} from 'react';
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {Task, TaskCategory} from "@/gql/schema";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Button} from "@/components/ui/button";
import {DataFilter} from "@/components/data-filter";
import {ClipboardList, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {DataEmpty} from "@/components/data-empty";
import {useTaskSearch} from "@/components/task/use-task-search";
import {TaskCard} from "@/components/task/task-card.client";
import {TaskViewDialog} from "@/components/task/task-view-dialog.client";
import {TaskEditSheet} from "@/components/task/task-edit-sheet.client";

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

    const {
        items,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore,
        reset,
        isInfiniteMode,
        searchValue,
        setSearchValue,
        selectedCategories,
        handleCategorySelect,
        handleClearCategories,
        totalOptionCount,
        noResults,
        isFiltered,
    } = useTaskSearch({categories, initialItems, initialPageInfo, maxItems});

    const [selected, setSelected] = useState<Task | null>(null);
    const [editItem, setEditItem] = useState<Task | null>(null);

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
                                onChange={(e) => setSearchValue(e.target.value)}
                                className="h-8 text-xs pr-8"
                            />
                            {searchValue && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-8 w-8 hover:bg-transparent"
                                    onClick={() => setSearchValue("")}
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
                    <TaskCard
                        key={n.id}
                        task={n}
                        canUpdate={canUpdate}
                        onSelect={() => setSelected(n)}
                        onEdit={() => setEditItem(n)}
                    />
                ))
            )}

            <TaskViewDialog selected={selected} onClose={() => setSelected(null)}/>

            <TaskEditSheet
                item={editItem}
                categories={categories}
                onClose={() => setEditItem(null)}
                onSuccess={() => {
                    setEditItem(null);
                    reset();
                    router.refresh();
                }}
            />

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
