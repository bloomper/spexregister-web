"use client";

import * as React from "react";
import {useState} from "react";
import {useInfiniteList} from "@/hooks/use-infinite-list.client";
import {TaskCategory} from "@/gql/schema";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPageAction} from "@/app/(app)/tasks/categories/actions.server";
import {useRouter} from "next/navigation";
import {Pencil} from "lucide-react";
import {Sheet} from "@/components/ui/sheet";
import {TaskCategoryForm} from "@/components/task/category/task-category-form.client";
import {TaskCategoryViewDialog} from "@/components/task/category/task-category-view-dialog.client";

export function TaskCategoryGrid({
                                     initialItems = [],
                                     initialPageInfo,
                                     maxItems,
                                     canUpdate = false,
                                 }: {
    initialItems?: TaskCategory[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
    canUpdate?: boolean;
}) {
    const router = useRouter();
    const [selected, setSelected] = useState<TaskCategory | null>(null);
    const [editItem, setEditItem] = useState<TaskCategory | null>(null);

    const {
        items,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore,
        isInfiniteMode,
    } = useInfiniteList<TaskCategory>({
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
                        <CardHeader className="p-4">
                            <CardTitle className="text-sm font-bold line-clamp-2 text-center leading-tight">
                                {n.name}
                            </CardTitle>
                        </CardHeader>
                    </div>
                </Card>
            ))}

            <TaskCategoryViewDialog selected={selected} onClose={() => setSelected(null)}/>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <TaskCategoryForm
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