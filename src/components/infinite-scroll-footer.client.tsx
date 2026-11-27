"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { useTranslations } from "next-intl";

interface InfiniteScrollFooterProps {
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  itemsCount: number;
  onRetry: () => void;
  className?: string;
}

/**
 * The end of an infinitely scrolling list: the sentinel that loads more, a spinner while loading, and an error with a
 * way to try again.
 */
export function InfiniteScrollFooter({
  sentinelRef,
  loading,
  error,
  hasNextPage,
  itemsCount,
  onRetry,
  className = "md:col-span-3",
}: InfiniteScrollFooterProps) {
  const t = useTranslations();

  return (
    <>
      <div
        ref={sentinelRef}
        className="col-span-full h-4"
        aria-hidden="true"
      />
      <div
        className={`text-muted-foreground mt-4 flex min-h-24 flex-col items-center justify-center border-t border-dashed p-4 text-center text-sm ${className}`}
      >
        {error ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>{t("Common.couldNotLoadData")}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
              {t("Common.tryAgain")}
            </Button>
          </div>
        ) : (
          <>
            {loading && (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>{t("Common.loading")}</span>
              </div>
            )}
            {!loading && !hasNextPage && itemsCount > 0 && (
              <span className="italic opacity-50">{t("Common.noMoreDataFound")}</span>
            )}
          </>
        )}
      </div>
    </>
  );
}
