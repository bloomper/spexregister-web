"use client";

import * as React from 'react';
import {useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useLocale, useTranslations} from "next-intl";
import {News} from "@/gql/graphql";
import {CursorPage, CursorPageInfo, NewsPage} from "@/types/pagination";
import {formatDate} from "@/utils/utils";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

async function fetchNewsPageAction(args: {
    after: string | null;
    pageSize: number
}, t: any): Promise<CursorPage<News>> {
    const params = new URLSearchParams();
    params.set('first', String(args.pageSize));
    if (args.after) {
        params.set('after', args.after);
    }

    const res = await fetch(`/api/news?${params.toString()}`, {
        method: 'GET',
        headers: {Accept: 'application/json'},
    });

    if (res.status === 401 || res.status === 403) {
        throw new Error(t("Common.insufficientPermissions"));
    }
    if (res.ok) {
        throw new Error(t("Common.failedToLoadData"));
    }

    const json = await res.json() as NewsPage;

    return {
        items: json.edges.map((e) => e.node),
        pageInfo: json.pageInfo,
    };
}

export function NewsList({
                             initialItems = [],
                             initialPageInfo,
                             maxItems,
                         }: {
    initialItems?: News[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const {
        items: allItems,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore
    } = useInfiniteCursor<News>({
        fetchPageAction: (args) => fetchNewsPageAction(args, t),
        pageSize: 24,
        rootMargin: '600px',
        getKeyAction: (n) => n.id,
        initialItems,
        initialPageInfo,
    });

    const [selected, setSelected] = useState<News | null>(null);
    const items = maxItems ? allItems.slice(0, maxItems) : allItems;
    const isInfiniteMode = !maxItems;

    return (
        <>
            {items.map((n) => (
                <Dialog
                    key={n.id}
                    onOpenChange={(nextOpen) => {
                        if (!nextOpen) {
                            setSelected(null);
                        }
                    }}
                >
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            disabled={!mounted}
                            className="text-left w-full h-full disabled:cursor-default cursor-pointer group"
                            onClick={() => setSelected(n)}
                        >
                            <Card className="h-full transition-colors group-hover:bg-muted/50 overflow-hidden">
                                <CardHeader className="space-y-1">
                                    <CardDescription>
                                        <time dateTime={n.visibleFrom}>
                                            {formatDate(n.visibleFrom, locale)}
                                        </time>
                                    </CardDescription>
                                    <CardTitle className="line-clamp-1">{n.subject}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-4">
                                        {n.text}
                                    </p>
                                </CardContent>
                            </Card>
                        </button>
                    </DialogTrigger>

                    {mounted && (
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <div className="text-xs text-muted-foreground">
                                    <time dateTime={selected?.visibleFrom}>
                                        {selected?.visibleFrom ? formatDate(selected.visibleFrom, locale) : ''}
                                    </time>
                                </div>
                                <DialogTitle>{selected?.subject ?? ''}</DialogTitle>
                            </DialogHeader>

                            <div className="whitespace-pre-wrap text-sm text-foreground">
                                {selected?.text ?? ''}
                            </div>
                            <DialogClose asChild>
                                <Button variant="outline">{t("Common.close")}</Button>
                            </DialogClose>
                        </DialogContent>
                    )}
                </Dialog>
            ))}

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