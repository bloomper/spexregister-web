"use client";

import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {Facet, Spexare} from "@/gql/graphql";
import {CursorPageInfo, SpexarePage} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getAction, getPageAction, searchAction} from "@/app/(app)/spexare/actions.server";
import {DataEmpty} from "@/components/data-empty";
import {CheckCircle2, Circle, Pencil, Sparkles, User, UserRound, X} from "lucide-react";
import {DataFilter} from "@/components/data-filter";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {cn, getProxiedImageUrl} from "@/utils/utils";
import {Badge} from "@/components/ui/badge";
import {SpexareView} from "@/components/spexare/spexare-view.client";
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";
import {SpexareForm} from "@/components/spexare/spexare-form.client";
import {Sheet} from "@/components/ui/sheet";
import {Spinner} from "@/components/ui/spinner";

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
    countries: any[];
    initialItems?: Spexare[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    mode?: "filter" | "search";
    initialSearchQuery?: string;
    facets?: Facet[];
    currentSpexareId?: string | null;
    canManage?: boolean;
    types?: any[];
    tags?: any[];
    tasks?: any[];
    taskCategories?: any[];
    spex?: any[];
    spexCategories?: any[];
}) {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const [searchValue, setSearchValue] = useState(initialSearchQuery);
    const [filterQuery, setFilterQuery] = useState(initialSearchQuery);
    const [selectedDeceasedValues, setSelectedDeceasedValues] = useState<Set<string>>(new Set(["true", "false"]));
    const [selectedFacets, setSelectedFacets] = useState<Record<string, Set<string>>>({});
    const [currentFacets, setCurrentFacets] = useState<Facet[]>(facets);
    const [selected, setSelected] = useState<Spexare | null>(null);
    const [selectedFull, setSelectedFull] = useState<Spexare | null>(null);
    const [isSelectedLoading, setIsSelectedLoading] = useState(false);
    const [editItem, setEditItem] = useState<Spexare | null>(null);
    const [editFullItem, setEditFullItem] = useState<Spexare | null>(null);
    const [isEditLoading, setIsEditLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadFull() {
            if (!selected?.id) {
                setSelectedFull(null);
                setIsSelectedLoading(false);
                return;
            }

            setIsSelectedLoading(true);
            setSelectedFull(null);

            try {
                const full = await getAction(selected.id);
                if (!cancelled) {
                    setSelectedFull(full ?? null);
                }
            } finally {
                if (!cancelled) {
                    setIsSelectedLoading(false);
                }
            }
        }

        void loadFull();
        return () => {
            cancelled = true;
        };
    }, [selected?.id]);

    useEffect(() => {
        let cancelled = false;

        async function loadEditFull() {
            if (!editItem?.id) {
                setEditFullItem(null);
                setIsEditLoading(false);
                return;
            }

            setIsEditLoading(true);
            setEditFullItem(null);

            try {
                const full = await getAction(editItem.id);
                if (!cancelled) {
                    setEditFullItem(full ?? null);
                }
            } finally {
                if (!cancelled) {
                    setIsEditLoading(false);
                }
            }
        }

        void loadEditFull();
        return () => {
            cancelled = true;
        };
    }, [editItem?.id]);

    useEffect(() => {
        if (mode !== "search" || !filterQuery) {
            if (mode === "search" && !filterQuery && window.location.search) {
                window.history.replaceState(null, '', pathname);
            }
            return;
        }

        const params = new URLSearchParams();
        params.set("q", filterQuery);

        const url = `${pathname}?${params.toString()}`;
        window.history.replaceState(null, '', url);
    }, [filterQuery, pathname, mode]);

    const fetchPage = useCallback(async (args: { after: string | null; pageSize: number }): Promise<SpexarePage> => {
        const isFirstPage = args.after === null;

        if (mode === "search") {
            const aggregationFilters: { name: string; value: string }[] = [];

            Object.entries(selectedFacets).forEach(([name, values]) => {
                values.forEach(value => {
                    aggregationFilters.push({name, value});
                });
            });

            const currentOffset = isFirstPage ? 0 : parseInt(args.after || "0");

            const res = await searchAction({
                q: filterQuery.trim() || "",
                limit: args.pageSize,
                offset: currentOffset,
                aggregationFilters,
            });

            if (isFirstPage && res.facets) {
                setCurrentFacets(res.facets);
            }

            return {
                ...res,
                pageInfo: {
                    ...res.pageInfo,
                    endCursor: (currentOffset + res.items.length).toString()
                }
            };
        }

        const parts: string[] = [];

        if (filterQuery.trim()) {
            const query = filterQuery.trim();
            parts.push(`(firstName:*${query}* OR lastName:*${query}* OR nickName:*${query}*)`);
        }

        if (selectedDeceasedValues.size < 2) {
            if (selectedDeceasedValues.size === 0) {
                parts.push(`id:NULL`);
            } else {
                const val = selectedDeceasedValues.has("true") ? "TRUE" : "FALSE";
                parts.push(`deceased:${val}`);
            }
        }

        return getPageAction({
            after: args.after,
            first: args.pageSize,
            filter: parts.join(" AND ")
        });
    }, [filterQuery, selectedDeceasedValues, selectedFacets]);

    const {
        items: allItems,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore,
        reset
    } = useInfiniteCursor<Spexare>({
        fetchPageAction: fetchPage,
        pageSize: 24,
        rootMargin: '600px',
        getKeyAction: (n) => n.id,
        initialItems,
        initialPageInfo,
    });

    useEffect(() => {
        if (selected) {
            const updated = allItems.find(i => i.id === selected.id);
            if (updated) {
                setSelected(updated);
            }
        }
        if (editItem) {
            const updated = allItems.find(i => i.id === editItem.id);
            if (updated) {
                setEditItem(updated);
            }
        }
    }, [allItems, selected?.id, editItem?.id]);

    useEffect(() => {
        if (initialSearchQuery !== searchValue) {
            setSearchValue(initialSearchQuery);
            setFilterQuery(initialSearchQuery);
        }
    }, [initialSearchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== filterQuery) {
                setFilterQuery(searchValue);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue, filterQuery]);

    useEffect(() => {
        reset();
    }, [filterQuery, selectedDeceasedValues, selectedFacets, reset]);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleReset = () => {
        React.startTransition(() => {
            setSearchValue("");
            setFilterQuery("");
            setSelectedDeceasedValues(new Set(["true", "false"]));
            setSelectedFacets({});

            if (mode === "search") {
                router.replace(pathname, { scroll: false });
            }
        });
    };

    const items = maxItems ? allItems.slice(0, maxItems) : allItems;
    const isInfiniteMode = !maxItems;
    const noResults = !loading && items.length === 0;
    const hasActiveFacets = Object.values(selectedFacets).some(s => s.size > 0);
    const isFiltered = mode === "search"
        ? filterQuery.trim() !== "" || hasActiveFacets
        : filterQuery.trim() !== "" || selectedDeceasedValues.size < 2;

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
                        <div className="relative w-full sm:w-[300px]">
                            <Input
                                placeholder={mode === "search" ? t("Spexare.searchPlaceholder") : t("Spexare.filterPlaceholder")}
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
                                            const label = group.label
                                                ? `${group.label}: ${v?.label}`
                                                : v?.label;

                                            return {
                                                label: `${label} (${v?.count})`,
                                                value: v?.id ?? "",
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
                    const isMe = currentSpexareId && n.id === currentSpexareId;
                    const canEdit = isMe || canManage;

                    return (
                        <Card
                            key={n.id}
                            className={cn(
                                "group h-full transition-all hover:bg-muted/50 cursor-pointer overflow-hidden flex flex-col p-0 relative",
                                isMe && "ring-2 ring-primary ring-offset-2 border-primary/50 shadow-lg scale-[1.02]"
                            )}
                        >
                            <div className="relative aspect-video w-full bg-muted border-b overflow-hidden">
                                {canEdit && (
                                    <div className="absolute top-2 right-2 z-20">
                                        {isMe ? (
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-background/80 hover:bg-background"
                                                asChild
                                            >
                                                <Link href="/my-profile">
                                                    <Pencil className="h-4 w-4"/>
                                                </Link>
                                            </Button>
                                        ) : (
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
                                        )}
                                    </div>
                                )}

                                <div
                                    className="relative flex flex-col h-full"
                                    onClick={() => setSelected(n)}
                                >
                                    {n.imageUrl ? (
                                        <Image
                                            src={getProxiedImageUrl(n.imageUrl, n.lastModifiedAt)}
                                            alt={`${n.firstName} ${n.lastName}`}
                                            fill
                                            preload={index < 2}
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <User className="h-12 w-12 text-muted-foreground/20 stroke-[1.5]"/>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <CardHeader
                                className="space-y-2 p-3 cursor-pointer"
                                onClick={() => setSelected(n)}
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <CardTitle className="line-clamp-1 text-sm font-bold leading-tight">
                                            {n.firstName} {n.lastName}
                                        </CardTitle>
                                        <div className="flex items-center gap-1 shrink-0">
                                            {isMe && (
                                                <Badge
                                                    className="bg-linear-to-r from-pink-500 to-violet-500 text-white border-none text-[9px] uppercase px-1 py-0 h-3.5 leading-none font-bold">
                                                    <Sparkles className="mr-0.5 h-2 w-2"/>
                                                    {t("Common.me")}
                                                </Badge>
                                            )}
                                            {!n.published && (
                                                <Badge variant="outline"
                                                       className="text-[9px] uppercase px-1 py-0 h-3.5 leading-none font-normal">
                                                    {t("Spexare.publishedBadges.false")}
                                                </Badge>
                                            )}
                                            {n.deceased && (
                                                <Badge variant="outline"
                                                       className="text-[9px] uppercase px-1 py-0 h-3.5 leading-none shrink-0 font-normal">
                                                    {t("Spexare.deceasedBadges.true")}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    {n.nickName && (
                                        <p className="text-[11px] text-muted-foreground italic truncate leading-tight">
                                            {n.nickName}
                                        </p>
                                    )}
                                </div>
                            </CardHeader>
                        </Card>
                    )
                })
            )}

            <Dialog
                open={!!selected}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelected(null);
                        setSelectedFull(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>
                            {selectedFull
                                ? `${selectedFull.firstName} ${selectedFull.lastName}`
                                : selected
                                    ? `${selected.firstName} ${selected.lastName}`
                                    : t("Common.details")}
                        </DialogTitle>
                    </DialogHeader>

                    {isSelectedLoading ? (
                        <div className="p-6">
                            <div className="flex items-center justify-center py-16">
                                <Spinner className="size-8"/>
                            </div>
                        </div>
                    ) : selectedFull ? (
                        <SpexareView
                            spexare={selectedFull}
                            countries={countries}
                            isMe={currentSpexareId === selectedFull.id}
                        />
                    ) : (
                        <div className="p-6 text-sm text-muted-foreground">
                            {t("Common.noData")}
                        </div>
                    )}

                    <DialogFooter className="p-6 pt-0">
                        <Button variant="outline" onClick={() => setSelected(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet
                open={!!editItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditItem(null);
                        setEditFullItem(null);
                    }
                }}
            >
                {isEditLoading ? (
                    <div className="p-6">
                        <div className="flex items-center justify-center py-16">
                            <Spinner className="size-8"/>
                        </div>
                    </div>
                ) : editFullItem ? (
                    <SpexareForm
                        types={types}
                        countries={countries}
                        tags={tags}
                        tasks={tasks}
                        taskCategories={taskCategories}
                        spex={spex}
                        spexCategories={spexCategories}
                        item={editFullItem}
                        onSuccess={() => {
                            setEditItem(null);
                            setEditFullItem(null);
                            reset();
                            router.refresh();
                        }}
                    />
                ) : null}
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