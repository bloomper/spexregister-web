"use client";

import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {Spex, SpexCategory} from "@/gql/graphql";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getEventsAction, getPageAction} from "@/app/(app)/spex/actions.server";
import {Badge} from "@/components/ui/badge";
import {DataFilter} from "@/components/data-filter";
import {Clapperboard, ImageIcon, Pencil, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {DataEmpty} from "@/components/data-empty";
import Image from "next/image";
import {getProxiedImageUrl} from "@/utils/utils";
import {Sheet} from "@/components/ui/sheet";
import {SpexForm} from "@/components/spex/spex-form.client";
import {useRouter} from "next/navigation";
import {AuditTrail} from "@/components/data-audit-trail.client";

export function SpexGrid({
                             initialItems = [],
                             initialPageInfo,
                             maxItems,
                             categories = [],
                             canUpdate = false,
                         }: {
    initialItems?: Spex[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    categories?: SpexCategory[];
    canUpdate?: boolean;
}) {
    const t = useTranslations();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        new Set(categories.map((c) => c.id))
    );
    const [selected, setSelected] = useState<Spex | null>(null);
    const [editItem, setEditItem] = useState<Spex | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilterQuery(searchValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue]);

    const fetchPageWithFilters = useCallback((args: { after: string | null; pageSize: number }) => {
        const filterParts = ["parent:NULL"];

        if (filterQuery.trim()) {
            const escapedQuery = filterQuery.trim();
            filterParts.push(`(details.title:*${escapedQuery}* OR year:*${escapedQuery}*)`);
        }

        if (categories.length > 0 && selectedCategories.size < categories.length) {
            const categoryFilters = Array.from(selectedCategories)
                .map(id => `details.category.id:${id}`)
                .join(" OR ");
            filterParts.push(`(${categoryFilters})`);
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
    } = useInfiniteCursor<Spex>({
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
        const allIds = new Set(categories.map(c => c.id));
        setSelectedCategories(allIds);
        reset();
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const items = maxItems ? allItems.slice(0, maxItems) : allItems;
    const isInfiniteMode = !maxItems;
    const noResults = !loading && items.length === 0;
    const isFiltered = filterQuery.trim() !== "" || (categories.length > 0 && selectedCategories.size < categories.length);

    return (
        <>
            {isInfiniteMode && (
                <div className="col-span-full mb-6 flex flex-col gap-4 border-b pb-6">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">{t("Spex.heading")}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full sm:w-[300px]">
                            <Input
                                placeholder={t("Spex.filterPlaceholder")}
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
                                title={t("Spex.category")}
                                options={categories.map((c) => ({
                                    label: c.name,
                                    value: c.id,
                                }))}
                                selectedValues={selectedCategories}
                                onSelect={handleCategorySelect}
                                onClear={handleClearCategories}
                            />
                        )}
                        {(searchValue || selectedCategories.size < categories.length) && (
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
                        icon={Clapperboard}
                    />
                </div>
            ) : (
                items.map((n) => (
                    <Card
                        key={n.id}
                        className="group h-full transition-colors hover:bg-muted/50 cursor-pointer overflow-hidden flex flex-col p-0 relative"
                    >
                        <div className="relative aspect-video w-full bg-muted border-b overflow-hidden">
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
                                className="relative flex flex-col h-full"
                                onClick={() => setSelected(n)}
                            >
                                {n.posterUrl ? (
                                    <Image
                                        src={getProxiedImageUrl(n.posterUrl, n.lastModifiedAt)}
                                        alt={n.title}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <ImageIcon className="h-12 w-12 text-muted-foreground/20 stroke-[1.5]"/>
                                    </div>
                                )}
                            </div>
                        </div>
                        <CardHeader
                            className="space-y-0.5 p-3"
                            onClick={() => setSelected(n)}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <CardDescription className="text-[10px]">{n.year}</CardDescription>
                                {n.revivals && n.revivals.length > 0 && (
                                    <div className="flex items-center gap-1 text-primary">
                                                <span className="text-[9px] font-bold uppercase tracking-tighter">
                                                    {t("Spex.revivals")}
                                                </span>
                                        <Badge variant="default"
                                               className="text-[9px] px-1 py-0 h-3.5 font-bold min-w-3.5 justify-center">
                                            {n.revivals.length}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            <CardTitle
                                className="line-clamp-1 text-sm font-bold leading-tight">{n.title}</CardTitle>
                        </CardHeader>
                        {n.category && (
                            <CardContent className="px-4 pb-4 pt-0">
                                <p className="text-xs text-muted-foreground truncate">{n.category.name}</p>
                            </CardContent>
                        )}
                    </Card>
                ))
            )}

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
                    <div className="relative aspect-video w-full bg-muted border-b">
                        {selected?.posterUrl ? (
                            <Image
                                src={getProxiedImageUrl(selected.posterUrl, selected.lastModifiedAt)}
                                alt={selected.title}
                                fill
                                unoptimized
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                    <span
                                        className="text-muted-foreground text-xs uppercase tracking-widest">{t("Common.noDataHeading")}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-6">
                        <DialogHeader>
                            <div className="text-xs text-muted-foreground">
                                {selected?.year}
                            </div>
                            <DialogTitle className="text-2xl">{selected?.title}</DialogTitle>
                            <DialogDescription className="sr-only">
                                HEPP
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6 flex flex-col gap-4 text-sm">
                            {selected?.category && (
                                <div>
                                    <div
                                        className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
                                        {t("Spex.category")}
                                    </div>
                                    <div className="text-base">{selected.category.name}</div>
                                </div>
                            )}
                            {selected?.revivals && selected.revivals.length > 0 && (
                                <div>
                                    <div
                                        className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
                                        {t("Spex.revivals")}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[...selected.revivals]
                                            .filter((r) => r !== null && r !== undefined)
                                            .sort((a, b) => Number(a.year) - Number(b.year))
                                            .map((revival) => (
                                                <Badge key={revival.id} variant="secondary" className="text-xs">
                                                    {revival.year}
                                                </Badge>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {selected && (
                                <div className="space-y-4">
                                    <AuditTrail id={selected.id} fetchAction={getEventsAction}/>
                                </div>
                            )}
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
                    <SpexForm
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