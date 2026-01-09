"use client";

import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {Dialog, DialogContent, DialogFooter} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {Country, Facet, Spexare} from "@/gql/graphql";
import {CursorPageInfo, SpexarePage} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPageAction, searchAction} from "@/app/(app)/spexare/actions.server";
import {DataEmpty} from "@/components/data-empty";
import {CheckCircle2, Circle, User, UserRound, X} from "lucide-react";
import {DataFilter} from "@/components/data-filter";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {getProxiedImageUrl} from "@/utils/utils";
import {Badge} from "@/components/ui/badge";
import {SpexareView} from "@/components/spexare/spexare-view.client";
import {usePathname, useRouter} from "next/navigation";

export function SpexareGrid({
                                countries = [],
                                initialItems = [],
                                initialPageInfo,
                                maxItems,
                                mode = "filter",
                                initialSearchQuery = "",
                                facets = [],
                            }: {
    countries: Country[];
    initialItems?: Spexare[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    mode?: "filter" | "search";
    initialSearchQuery?: string;
    facets?: Facet[];
}) {
    const t = useTranslations();
    const router = useRouter();
    const pathname = usePathname();
    const [searchValue, setSearchValue] = useState(initialSearchQuery);
    const [filterQuery, setFilterQuery] = useState(initialSearchQuery);
    const [selectedDeceasedValues, setSelectedDeceasedValues] = useState<Set<string>>(new Set(["true", "false"]));
    const [selectedFacets, setSelectedFacets] = useState<Record<string, Set<string>>>({});
    const [currentFacets, setCurrentFacets] = useState<Facet[]>(facets);

    useEffect(() => {
        if (mode !== "search") {
            return;
        }

        const params = new URLSearchParams();
        if (filterQuery) {
            params.set("q", filterQuery);
        }

        const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        window.history.replaceState(null, '', url);
    }, [filterQuery, pathname, mode]);

    const fetchPage = useCallback(async (args: { after: string | null; pageSize: number }): Promise<SpexarePage> => {
        const isFirstPage = args.after === null;

        if (mode === "search") {
            const aggregationFilters: { name: string; value: string }[] = [];

            Object.entries(selectedFacets).forEach(([name, values]) => {
                values.forEach(value => {
                    aggregationFilters.push({ name, value });
                });
            });

            const currentOffset = isFirstPage ? 0 : parseInt(args.after || "0");

            const res = await searchAction({
                q: filterQuery.trim() || "*",
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
        setSearchValue(initialSearchQuery);
        setFilterQuery(initialSearchQuery);
        reset();
    }, [initialSearchQuery, reset]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilterQuery(searchValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue]);

    useEffect(() => {
        reset();
    }, [filterQuery, selectedDeceasedValues, selectedFacets]);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const [selected, setSelected] = useState<Spexare | null>(null);
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
                                onClick={() => {
                                    setSearchValue("");
                                    setFilterQuery("");
                                    setSelectedDeceasedValues(new Set(["true", "false"]));
                                    setSelectedFacets({});
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
                        icon={UserRound}
                    />
                </div>
            ) : (
                items.map((n) => (
                    <Card
                        key={n.id}
                        className="group h-full transition-colors hover:bg-muted/50 cursor-pointer overflow-hidden flex flex-col p-0"
                        onClick={() => setSelected(n)}
                    >
                        {n.imageUrl ? (
                            <div className="relative aspect-video w-full bg-muted border-b overflow-hidden">
                                <Image
                                    src={getProxiedImageUrl(n.imageUrl, n.lastModifiedAt)}
                                    alt={`${n.firstName} ${n.lastName}`}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video w-full bg-muted flex items-center justify-center border-b">
                                <User className="h-12 w-12 text-muted-foreground/20 stroke-[1.5]"/>
                            </div>
                        )}
                        <CardHeader className="space-y-2 p-3">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                    <CardTitle className="line-clamp-1 text-sm font-bold leading-tight">
                                        {n.firstName} {n.lastName}
                                    </CardTitle>
                                    <div className="flex items-center gap-1 shrink-0">
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
                ))
            )}

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                    {selected && <SpexareView spexare={selected} countries={countries}/>}

                    <DialogFooter className="p-6 pt-0">
                        <Button variant="outline" onClick={() => setSelected(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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