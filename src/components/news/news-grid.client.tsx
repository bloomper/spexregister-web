"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useInfiniteList } from "@/hooks/use-infinite-list.client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bloomper/fgv-web-ui/ui/dialog";
import { useTranslations } from "next-intl";
import { News } from "@/gql/schema";
import { CursorPageInfo } from "@/types/pagination";
import { formatDate } from "@/utils/utils";
import { InfiniteScrollFooter } from "@/components/infinite-scroll-footer.client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bloomper/fgv-web-ui/ui/card";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import {
  getPageAction,
  getRestorePreviewAction,
  getRevisionsAction,
  restoreRevisionAction,
} from "@/app/(app)/news/actions.server";
import { useRouter } from "next/navigation";
import { Sheet } from "@bloomper/fgv-web-ui/ui/sheet";
import { NewsForm } from "@/components/news/news-form.client";
import { Newspaper, Pencil } from "lucide-react";
import { GridFilterHeader } from "@/components/grid-filter-header.client";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { AuditTrail } from "../data-audit-trail.client";
import { textFilter } from "@/utils/filter";

const restoreActions = {
  preview: getRestorePreviewAction,
  restore: restoreRevisionAction,
};

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
  const [searchValue, setSearchValue] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const { items, loading, error, hasNextPage, sentinelRef, loadMore, reset, isInfiniteMode } = useInfiniteList<News>({
    fetchPageAction: (args) =>
      getPageAction({
        after: args.after,
        first: args.pageSize,
        filter: textFilter(["subject"], filterQuery) || undefined,
      }),
    pageSize: 24,
    rootMargin: "600px",
    getKeyAction: (n) => n.id,
    initialItems,
    initialPageInfo,
    maxItems,
  });

  const [selected, setSelected] = useState<News | null>(null);
  const [editItem, setEditItem] = useState<News | null>(null);

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
          title={t("News.heading")}
          placeholder={t("News.filterPlaceholder")}
          value={searchValue}
          onChange={setSearchValue}
        />
      )}

      {noResults && (
        <div className="col-span-full py-12">
          <DataEmpty
            title={isFiltered ? t("Common.noFilterMatchHeading") : t("Common.noDataHeading")}
            description={isFiltered ? t("Common.noFilterMatchDescription") : t("Common.noDataDescription")}
            icon={Newspaper}
          />
        </div>
      )}

      {items.map((n) => (
        <Card
          key={n.id}
          className="hover:bg-muted/50 group relative h-full cursor-pointer overflow-hidden transition-colors"
        >
          {(canUpdate || Boolean(n.permissions?.write)) && (
            <div className="absolute top-2 right-2 z-20">
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/80 hover:bg-background h-8 w-8 rounded-full opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditItem(n);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div
            className="flex h-full flex-col"
            onClick={() => setSelected(n)}
          >
            <CardHeader className="space-y-1">
              <CardDescription>
                <time dateTime={n.visibleFrom}>{formatDate(n.visibleFrom)}</time>
              </CardDescription>
              <CardTitle className="line-clamp-1">{n.subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-4 text-sm">{n.text}</p>
            </CardContent>
          </div>
        </Card>
      ))}

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="text-muted-foreground text-xs">
              {selected?.visibleFrom ? formatDate(selected.visibleFrom) : ""}
            </div>
            <DialogTitle>{selected?.subject}</DialogTitle>
            <DialogDescription className="sr-only">{t("Common.details")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-foreground text-sm whitespace-pre-wrap">{selected?.text}</div>

            {selected && (
              <div className="space-y-4">
                <AuditTrail
                  id={selected.id}
                  fetchAction={getRevisionsAction}
                  restoreActions={restoreActions}
                  onRestored={() => setSelected(null)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelected(null)}
            >
              {t("Common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
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
