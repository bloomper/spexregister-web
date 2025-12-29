"use client";

import * as React from 'react';
import {useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {SpexCategory} from "@/gql/graphql";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPageAction} from "@/app/(app)/spex/categories/actions.server";

export function SpexCategoryGrid({
                                     initialItems = [],
                                     initialPageInfo,
                                     maxItems,
                                 }: {
    initialItems?: SpexCategory[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
}) {
    const t = useTranslations();

    const {
        items: allItems,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore
    } = useInfiniteCursor<SpexCategory>({
        fetchPageAction: (args) => getPageAction({
            after: args.after,
            first: args.pageSize
        }),
        pageSize: 24,
        rootMargin: '600px',
        getKeyAction: (n) => n.id,
        initialItems,
        initialPageInfo,
    });

    const [selected, setSelected] = useState<SpexCategory | null>(null);
    const items = maxItems ? allItems.slice(0, maxItems) : allItems;
    const isInfiniteMode = !maxItems;

    return (
        <>
            {items.map((n) => (
                <Card
                    key={n.id}
                    className="h-full overflow-hidden transition-all hover:bg-muted/50 cursor-pointer p-0 gap-0"
                    onClick={() => setSelected(n)}
                >
                    {n.logoUrl ? (
                        <div className="relative aspect-video w-full bg-muted border-b">
                            <img
                                src={`/api/image-download-proxy?url=${encodeURIComponent(n.logoUrl)}`}
                                alt={n.name}
                                className="object-contain w-full h-full p-4 transition-transform group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="aspect-video w-full bg-muted flex items-center justify-center border-b">
                            <span
                                className="text-muted-foreground text-xs uppercase tracking-widest">{t("Common.noDataTitle")}</span>
                        </div>
                    )}
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm font-bold line-clamp-2 text-center leading-tight">
                            {n.name}
                        </CardTitle>
                    </CardHeader>
                </Card>
            ))}

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{selected?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="text-sm font-medium">
                            {t("Spex.Category.firstYear")}: <span
                            className="text-muted-foreground font-normal">{selected?.firstYear}</span>
                        </div>
                        {selected?.logoUrl && (
                            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                                <img
                                    src={`/api/image-download-proxy?url=${encodeURIComponent(selected.logoUrl)}`}
                                    alt={selected.name}
                                    className="object-contain w-full h-full p-6"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
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