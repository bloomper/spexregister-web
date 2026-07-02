"use client";

import {useState} from 'react';
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {Country, Facet, Spex, Spexare, SpexCategory, Tag as TagType, Task, TaskCategory, Type} from "@/gql/schema";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Button} from "@/components/ui/button";
import {getAction} from "@/app/(app)/spexare/actions.server";
import {DataEmpty} from "@/components/data-empty";
import {CheckCircle2, Circle, UserRound, X} from "lucide-react";
import {DataFilter} from "@/components/data-filter";
import {Input} from "@/components/ui/input";
import {useLazyFull} from "@/hooks/use-lazy-full";
import {useSpexareSearch} from "@/components/spexare/use-spexare-search";
import {SpexareCard} from "@/components/spexare/spexare-card.client";
import {SpexareViewDialog} from "@/components/spexare/spexare-view-dialog.client";
import {SpexareEditSheet} from "@/components/spexare/spexare-edit-sheet.client";

export function SpexareGrid({
                                countries = [],
                                initialItems = [],
                                initialPageInfo,
                                maxItems,
                                mode = "filter",
                                initialSearchQuery = "",
                                facets = [],
                                currentSpexareId,
                                canManage = false,
                                types = [],
                                tags = [],
                                tasks = [],
                                taskCategories = [],
                                spex = [],
                                spexCategories = [],
                            }: {
    countries: Country[];
    initialItems?: Spexare[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    mode?: "filter" | "search";
    initialSearchQuery?: string;
    facets?: Facet[];
    currentSpexareId?: string | null;
    canManage?: boolean;
    types?: Type[];
    tags?: TagType[];
    tasks?: Task[];
    taskCategories?: TaskCategory[];
    spex?: Spex[];
    spexCategories?: SpexCategory[];
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
        searchValue,
        setSearchValue,
        selectedDeceasedValues,
        setSelectedDeceasedValues,
        selectedFacets,
        setSelectedFacets,
        currentFacets,
        handleReset,
        isInfiniteMode,
        noResults,
        isFiltered,
    } = useSpexareSearch({mode, initialSearchQuery, facets, initialItems, initialPageInfo, maxItems});

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const {full: selectedFull, isLoading: isSelectedLoading} = useLazyFull(selectedId, getAction);
    const {full: editFullItem, isLoading: isEditLoading} = useLazyFull(editId, getAction);
    const selected = selectedId ? items.find((i) => i.id === selectedId) ?? null : null;

    return (
        <>
            {isInfiniteMode && (
                <div className="col-span-full mb-6 flex flex-col gap-4 border-b pb-6">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">
                            {mode === "search" ? t("Common.searchResults") : t("Spexare.heading")}
                        </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full sm:w-75">
                            <Input
                                placeholder={mode === "search" ? t("Spexare.searchPlaceholder") : t("Spexare.filterPlaceholder")}
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

                        {mode === "filter" && (
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
                        )}

                        {mode === "search" && currentFacets.map((facet) => {
                            const selectedValues = selectedFacets[facet.id] || new Set();
                            return (
                                <DataFilter
                                    key={facet.id}
                                    title={facet.label}
                                    selectedValues={selectedValues}
                                    onSelect={(values) => setSelectedFacets(prev => ({
                                        ...prev,
                                        [facet.id]: values
                                    }))}
                                    onClear={selectedValues.size > 0 ? () => setSelectedFacets(prev => ({
                                        ...prev,
                                        [facet.id]: new Set()
                                    })) : undefined}
                                    options={facet.groups.flatMap(group =>
                                        group?.values.map(v => {
                                            const countSuffix = typeof v?.count === "number" ? ` (${v.count})` : "";
                                            const valueLabel = v?.label ?? "";

                                            return {
                                                label: `${valueLabel}${countSuffix}`,
                                                value: v?.id ?? "",
                                                groupLabel: group?.label ?? undefined,
                                                sortKey: valueLabel,
                                            };
                                        }) ?? []
                                    )}
                                />
                            );
                        })}

                        {isFiltered && (
                            <Button
                                variant="ghost"
                                onClick={handleReset}
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
                        icon={UserRound}
                    />
                </div>
            ) : (
                items.map((n, index) => {
                    const isMe = Boolean(currentSpexareId && n.id === currentSpexareId);
                    const canEdit = isMe || canManage;

                    return (
                        <SpexareCard
                            key={n.id}
                            spexare={n}
                            index={index}
                            isMe={isMe}
                            canEdit={canEdit}
                            onSelect={() => setSelectedId(n.id)}
                            onEdit={() => setEditId(n.id)}
                        />
                    )
                })
            )}

            <SpexareViewDialog
                open={!!selectedId}
                onClose={() => setSelectedId(null)}
                summary={selected}
                full={selectedFull}
                isLoading={isSelectedLoading}
                countries={countries}
                isMe={currentSpexareId === selectedFull?.id}
            />

            <SpexareEditSheet
                open={!!editId}
                onClose={() => setEditId(null)}
                full={editFullItem}
                isLoading={isEditLoading}
                onSuccess={() => {
                    setEditId(null);
                    reset();
                    router.refresh();
                }}
                types={types}
                countries={countries}
                tags={tags}
                tasks={tasks}
                taskCategories={taskCategories}
                spex={spex}
                spexCategories={spexCategories}
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
