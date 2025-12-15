"use client";

import * as React from 'react';
import {useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useLocale, useTranslations} from "next-intl";
import {News} from "@/gql/graphql";
import {NewsPage} from "@/lib/news";
import {CursorPage, CursorPageInfo} from "@/types/pagination";
import {formatDate} from "@/utils/utils";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer";

async function fetchNewsPageAction(args: { after: string | null; pageSize: number }, t: any): Promise<CursorPage<News>> {
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
                            className="bg-muted/50 aspect-video rounded-xl p-4 text-left w-full h-full overflow-hidden flex flex-col disabled:cursor-default cursor-pointer"
                            onClick={() => setSelected(n)}
                        >
                            <time
                                dateTime={n.visibleFrom}
                                className="text-xs text-muted-foreground leading-4 h-4"
                            >
                                {formatDate(n.visibleFrom, locale)}
                            </time>
                            <h2 className="text-lg font-semibold leading-7 h-7 truncate">
                                {n.subject}
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground leading-5 h-30 overflow-hidden line-clamp-6">
                                {n.text}
                            </p>
                            <div className="mt-auto"/>
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