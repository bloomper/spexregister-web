"use client";

import * as React from "react";
import {useState} from "react";
import {useInfiniteList} from "@/hooks/use-infinite-list";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {Tag} from "@/gql/schema";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getEventsAction, getPageAction} from "@/app/(app)/tags/actions.server";
import {useRouter} from "next/navigation";
import {Pencil} from "lucide-react";
import {Sheet} from "@/components/ui/sheet";
import {TagForm} from "@/components/tag/tag-form.client";
import {AuditTrail} from "@/components/data-audit-trail.client";

export function TagGrid({
                            initialItems = [],
                            initialPageInfo,
                            maxItems,
                            canUpdate = false,
                        }: {
    initialItems?: Tag[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    canUpdate?: boolean;
}) {
    const t = useTranslations();
    const router = useRouter();
    const [selected, setSelected] = useState<Tag | null>(null);
    const [editItem, setEditItem] = useState<Tag | null>(null);

    const {
        items,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore,
        isInfiniteMode,
    } = useInfiniteList<Tag>({
        fetchPageAction: (args) => getPageAction({
            after: args.after,
            first: args.pageSize
        }),
        pageSize: 24,
        rootMargin: "600px",
        getKeyAction: (n) => n.id,
        initialItems,
        initialPageInfo,
        maxItems,
    });

    return (
        <>
            {items.map((n) => (
                <Card
                    key={n.id}
                    className="group relative h-full overflow-hidden transition-all hover:bg-muted/50 cursor-pointer p-0 gap-0"
                >
                    {canUpdate && (
                        <div className="absolute top-2 right-2 z-20">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-7 w-7 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-background/80 hover:bg-background"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditItem(n);
                                }}
                            >
                                <Pencil className="h-3.5 w-3.5"/>
                            </Button>
                        </div>
                    )}
                    <div
                        className="flex flex-col h-full"
                        onClick={() => setSelected(n)}
                    >
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-bold line-clamp-2 text-center leading-tight">
                                {n.name}
                            </CardTitle>
                        </CardHeader>
                    </div>
                </Card>
            ))}

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selected?.name}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {t("Common.details")}
                        </DialogDescription>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            <AuditTrail id={selected.id} fetchAction={getEventsAction}/>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelected(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <TagForm
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