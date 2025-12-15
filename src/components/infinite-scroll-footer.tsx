"use client";

import * as React from 'react';
import {AlertCircle, RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useTranslations} from "next-intl";

interface InfiniteScrollFooterProps {
    sentinelRef: React.RefObject<HTMLDivElement | null>;
    loading: boolean;
    error: string | null;
    hasNextPage: boolean;
    itemsCount: number;
    onRetry: () => void;
    className?: string;
}

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
            <div ref={sentinelRef} className="h-4 col-span-full" aria-hidden="true"/>
            <div
                className={`text-sm text-muted-foreground text-center min-h-24 flex flex-col items-center justify-center p-4 border-t border-dashed mt-4 ${className}`}>
                {error ? (
                    <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <div
                            className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                            <AlertCircle className="w-4 h-4"/>
                            <span>{t("Common.couldNotLoadData")}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                            className="gap-2"
                        >
                            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`}/>
                            {t("Common.tryAgain")}
                        </Button>
                    </div>
                ) : (
                    <>
                        {loading && (
                            <div className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin"/>
                                <span>{t("Common.loading")}</span>
                            </div>
                        )}
                        {!loading && !hasNextPage && itemsCount > 0 && (
                            <span className="opacity-50 italic">{t("Common.noMoreDataFound")}</span>
                        )}
                    </>
                )}
            </div>
        </>
    );
}