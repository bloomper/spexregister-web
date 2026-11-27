"use client";

import { ImportResult } from "@/gql/schema";
import { useTranslations } from "next-intl";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Label } from "@bloomper/fgv-web-ui/ui/label";
import { ScrollArea } from "@bloomper/fgv-web-ui/ui/scroll-area";

interface ImportResultViewerProps {
  result: ImportResult;
}

/**
 * What an import created, updated and removed, and the rows that failed.
 */
export function ImportResultViewer({ result }: ImportResultViewerProps) {
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
          <Label className="text-foreground/70 text-xs font-bold tracking-widest uppercase sm:text-[10px]">
            {t("Impex.messages")}
          </Label>
          <ScrollArea className="border-foreground/10 bg-muted/30 h-[150px] w-full rounded-md border p-2">
            <ul className="text-foreground/80 space-y-1 font-mono text-xs">
              {result.messages?.map((msg, i) => (
                <li
                  key={i}
                  className="flex gap-2"
                >
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
          <Label className="text-destructive text-xs font-bold tracking-widest uppercase sm:text-[10px]">
            {t("Impex.errors")}
          </Label>
          <ScrollArea className="border-destructive/20 bg-destructive/5 h-[150px] w-full rounded-md border p-2">
            <ul className="text-destructive space-y-1 font-mono text-xs">
              {result.errors?.map((err, i) => (
                <li
                  key={i}
                  className="flex gap-2"
                >
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
            <Label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase sm:text-[10px]">
              {t("Impex.data")}
            </Label>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="bg-muted/50 h-[200px] w-full rounded-md border p-4">
            <pre className="text-xs leading-relaxed sm:text-[10px]">{JSON.stringify(result.data, null, 2)}</pre>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
