"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useInfiniteList } from "@/hooks/use-infinite-list.client";
import { Tag } from "@/gql/schema";
import { CursorPageInfo } from "@/types/pagination";
import { InfiniteScrollFooter } from "@/components/infinite-scroll-footer.client";
import { Card, CardHeader, CardTitle } from "@bloomper/fgv-web-ui/ui/card";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { getPageAction } from "@/app/(app)/tags/actions.server";
import { useRouter } from "next/navigation";
import { Pencil, Tag as TagIcon } from "lucide-react";
import { GridFilterHeader } from "@/components/grid-filter-header.client";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { Sheet } from "@bloomper/fgv-web-ui/ui/sheet";
import { TagForm } from "@/components/tag/tag-form.client";
import { TagViewDialog } from "@/components/tag/tag-view-dialog.client";
import { textFilter } from "@/utils/filter";

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
  const [searchValue, setSearchValue] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const { items, loading, error, hasNextPage, sentinelRef, loadMore, reset, isInfiniteMode } = useInfiniteList<Tag>({
    fetchPageAction: (args) =>
      getPageAction({
        after: args.after,
        first: args.pageSize,
        filter: textFilter(["name"], filterQuery) || undefined,
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
          title={t("Tag.heading")}
          placeholder={t("Tag.filterPlaceholder")}
          value={searchValue}
          onChange={setSearchValue}
        />
      )}

      {noResults && (
        <div className="col-span-full py-12">
          <DataEmpty
            title={isFiltered ? t("Common.noFilterMatchHeading") : t("Common.noDataHeading")}
            description={isFiltered ? t("Common.noFilterMatchDescription") : t("Common.noDataDescription")}
            icon={TagIcon}
          />
        </div>
      )}

      {items.map((n) => (
        <Card
          key={n.id}
          className="group hover:bg-muted/50 relative h-full cursor-pointer gap-0 overflow-hidden p-0 transition-all"
        >
          {canUpdate && (
            <div className="absolute top-2 right-2 z-20">
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/80 hover:bg-background h-7 w-7 rounded-full opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditItem(n);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          <div
            className="flex h-full flex-col"
            onClick={() => setSelected(n)}
          >
            <CardHeader className="p-4">
              <CardTitle className="line-clamp-2 text-center text-sm leading-tight font-bold">{n.name}</CardTitle>
            </CardHeader>
          </div>
        </Card>
      ))}

      <TagViewDialog
        selected={selected}
        onClose={() => setSelected(null)}
      />

      <Sheet
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
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
