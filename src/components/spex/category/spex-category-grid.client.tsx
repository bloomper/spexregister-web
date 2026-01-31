"use client";

import * as React from 'react';
import {useState} from 'react';
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
import {SpexCategory} from "@/gql/graphql";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getEventsAction, getPageAction} from "@/app/(app)/spex/categories/actions.server";
import {getProxiedImageUrl} from "@/utils/utils";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Pencil} from "lucide-react";
import {Sheet} from "@/components/ui/sheet";
import {SpexCategoryForm} from "@/components/spex/category/spex-category-form.client";
import {AuditTrail} from "@/components/data-audit-trail.client";

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
    const [selected, setSelected] = useState<SpexCategory | null>(null);
    const [editItem, setEditItem] = useState<SpexCategory | null>(null);

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

    const items = maxItems ? allItems.slice(0, maxItems) : allItems;
    const isInfiniteMode = !maxItems;

    return (
        <>
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
                            <span
                                className="text-muted-foreground text-xs uppercase tracking-widest">{t("Common.noDataHeading")}</span>
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

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{selected?.name}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {t("Common.details")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="text-sm font-medium">
                            {t("Spex.Category.firstYear")}: <span
                            className="text-muted-foreground font-normal">{selected?.firstYear}</span>
                        </div>
                        {selected?.logoUrl && (
                            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                                <Image
                                    src={getProxiedImageUrl(selected.logoUrl, selected.lastModifiedAt)}
                                    alt={selected.name}
                                    fill
                                    unoptimized
                                    className="object-contain p-6"
                                />
                            </div>
                        )}

                        {selected && (
                            <div className="space-y-4">
                                <AuditTrail id={selected.id} fetchAction={getEventsAction}/>
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