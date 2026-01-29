"use client";

import {ImportResult} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {Copy} from "lucide-react";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {ScrollArea} from "@/components/ui/scroll-area";

interface ImportResultViewerProps {
    result: ImportResult;
}

export function ImportResultViewer({result}: ImportResultViewerProps) {
    const t = useTranslations();

    const copyToClipboard = (text: string) => {
        void navigator.clipboard.writeText(text);
        toast.success(t("Common.copySuccess"));
    };

    const hasErrors = result.errors && result.errors.length > 0;
    const hasMessages = result.messages && result.messages.length > 0;

    return (
        <div className="space-y-4">
            {hasMessages && (
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-foreground/70 tracking-widest">
                        {t("Impex.messages")}
                    </Label>
                    <ScrollArea className="h-[150px] w-full rounded-md border border-foreground/10 bg-muted/30 p-2">
                        <ul className="text-xs font-mono space-y-1 text-foreground/80">
                            {result.messages?.map((msg, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="opacity-50">[{i + 1}]</span>
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </div>
            )}

            {hasErrors && (
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-destructive tracking-widest">
                        {t("Impex.errors")}
                    </Label>
                    <ScrollArea
                        className="h-[150px] w-full rounded-md border border-destructive/20 bg-destructive/5 p-2">
                        <ul className="text-xs font-mono space-y-1 text-destructive">
                            {result.errors?.map((err, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="opacity-50">[{i + 1}]</span>
                                    {err}
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                </div>
            )}

            {result.data && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                            {t("Impex.data")}
                        </Label>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}
                        >
                            <Copy className="h-3 w-3"/>
                        </Button>
                    </div>
                    <ScrollArea className="h-[200px] w-full rounded-md border bg-muted/50 p-4">
                        <pre className="text-[10px] leading-relaxed">
                            {JSON.stringify(result.data, null, 2)}
                        </pre>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}