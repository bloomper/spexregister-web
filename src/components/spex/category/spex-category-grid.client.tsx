"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {useInfiniteList} from "@/hooks/use-infinite-list.client";
import {useTranslations} from "next-intl";
import {SpexCategory} from "@/gql/schema";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPageAction} from "@/app/(app)/spex/categories/actions.server";
import {getProxiedImageUrl} from "@/utils/utils";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Clapperboard, ImageIcon, Pencil} from "lucide-react";
import {GridFilterHeader} from "@/components/grid-filter-header.client";
import {DataEmpty} from "@/components/data-empty";
import {Sheet} from "@/components/ui/sheet";
import {SpexCategoryForm} from "@/components/spex/category/spex-category-form.client";
import {SpexCategoryViewDialog} from "@/components/spex/category/spex-category-view-dialog.client";

export function SpexCategoryGrid({
                                     initialItems = [],
                                     initialPageInfo,
                                     maxItems,
                                     canUpdate = false,
                                 }: {
    initialItems?: SpexCategory[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    canUpdate?: boolean;
}) {
    const t = useTranslations();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [filterQuery, setFilterQuery] = useState("");
    const [selected, setSelected] = useState<SpexCategory | null>(null);
    const [editItem, setEditItem] = useState<SpexCategory | null>(null);

    const {
        items,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore,
        reset,
        isInfiniteMode,
    } = useInfiniteList<SpexCategory>({
        fetchPageAction: (args) => getPageAction({
            after: args.after,
            first: args.pageSize,
            filter: filterQuery.trim() ? `(name:*${filterQuery.trim()}* OR firstYear:*${filterQuery.trim()}*)` : undefined,
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
                    title={t("Spex.Category.heading")}
                    placeholder={t("Spex.Category.filterPlaceholder")}
                    value={searchValue}
                    onChange={setSearchValue}
                />
            )}

            {noResults && (
                <div className="col-span-full py-12">
                    <DataEmpty
                        title={isFiltered ? t("Common.noFilterMatchHeading") : t("Common.noDataHeading")}
                        description={isFiltered ? t("Common.noFilterMatchDescription") : t("Common.noDataDescription")}
                        icon={Clapperboard}
                    />
                </div>
            )}

            {items.map((n, index) => (
                <Card key={n.id}
                      className="group relative overflow-hidden flex flex-col p-0 transition-colors hover:bg-muted/50 cursor-pointer">
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
                    <div className="flex flex-col h-full" onClick={() => setSelected(n)}>
                        {n.logoUrl ? (
                            <div className="relative aspect-video w-full bg-muted border-b">
                                <Image
                                    src={getProxiedImageUrl(n.logoUrl, n.lastModifiedAt)}
                                    alt={n.name}
                                    fill
                                    preload={index < 2}
                                    unoptimized
                                    className="object-contain p-4 transition-transform group-hover:scale-105"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video w-full bg-muted flex items-center justify-center border-b">
                                <ImageIcon className="h-12 w-12 text-muted-foreground/20 stroke-[1.5]"/>
                            </div>
                        )}
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-bold line-clamp-2 text-center leading-tight">
                                {n.name}
                            </CardTitle>
                        </CardHeader>
                    </div>
                </Card>
            ))}

            <SpexCategoryViewDialog selected={selected} onClose={() => setSelected(null)}/>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <SpexCategoryForm
                        item={editItem}
                        onSuccess={() => {
                            setEditItem(null);
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