"use client";

import * as React from 'react';
import {useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {Tag} from "@/gql/graphql";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPageAction} from "@/app/(app)/tags/actions.server";

export function TagGrid({
                            initialItems = [],
                            initialPageInfo,
                            maxItems,
                        }: {
    initialItems?: Tag[];
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
    } = useInfiniteCursor<Tag>({
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

    const [selected, setSelected] = useState<Tag | null>(null);
    const items = maxItems ? allItems.slice(0, maxItems) : allItems;
    const isInfiniteMode = !maxItems;

    return (
        <>
            {items.map((n) => (
                <Card
                    key={n.id}
                    className="h-full transition-colors hover:bg-muted/50 cursor-pointer overflow-hidden"
                    onClick={() => setSelected(n)}
                >
                    <CardHeader className="space-y-1">
                        <CardTitle className="line-clamp-1">{n.name}</CardTitle>
                    </CardHeader>
                </Card>
            ))}

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selected?.name}</DialogTitle>
                    </DialogHeader>
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