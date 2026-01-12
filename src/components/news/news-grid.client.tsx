"use client";

import * as React from 'react';
import {useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {News} from "@/gql/graphql";
import {CursorPageInfo} from "@/types/pagination";
import {formatDate} from "@/utils/utils";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPageAction} from "@/app/(app)/news/actions.server";
import {useRouter} from "next/navigation";
import {Sheet} from "@/components/ui/sheet";
import {NewsForm} from "@/components/news/news-form.client";
import {Pencil} from "lucide-react";

export function NewsGrid({
                             initialItems = [],
                             initialPageInfo,
                             maxItems,
                             canUpdate = false,
                         }: {
    initialItems?: News[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    canUpdate?: boolean;
}) {
    const t = useTranslations();
    const router = useRouter();

    const {
        items: allItems,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore
    } = useInfiniteCursor<News>({
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

    const [selected, setSelected] = useState<News | null>(null);
    const [editItem, setEditItem] = useState<News | null>(null);
    const items = maxItems ? allItems.slice(0, maxItems) : allItems;
    const isInfiniteMode = !maxItems;

    return (
        <>
            {items.map((n) => (
                <Card
                    key={n.id}
                    className="h-full transition-colors hover:bg-muted/50 cursor-pointer overflow-hidden relative group"
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
                        <CardHeader className="space-y-1">
                            <CardDescription>
                                <time dateTime={n.visibleFrom}>{formatDate(n.visibleFrom)}</time>
                            </CardDescription>
                            <CardTitle className="line-clamp-1">{n.subject}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-4">{n.text}</p>
                        </CardContent>
                    </div>
                </Card>
            ))}

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <div className="text-xs text-muted-foreground">
                            {selected?.visibleFrom ? formatDate(selected.visibleFrom) : ''}
                        </div>
                        <DialogTitle>{selected?.subject}</DialogTitle>
                    </DialogHeader>
                    <div className="whitespace-pre-wrap text-sm text-foreground">
                        {selected?.text}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelected(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <NewsForm
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