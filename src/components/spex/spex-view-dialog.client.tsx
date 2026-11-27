"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Spex } from "@/gql/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bloomper/fgv-web-ui/ui/dialog";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { ImageIcon } from "lucide-react";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { getProxiedImageUrl } from "@/utils/utils";

/**
 * A spex as Spexregister's copy has it, with a link to its page in Spexipedia, which keeps spex and their history.
 */
export function SpexViewDialog({
  selected,
  spexipediaUrl = null,
  onClose,
}: {
  selected: Spex | null;
  spexipediaUrl?: string | null;
  onClose: () => void;
}) {
  const t = useTranslations();

  return (
    <Dialog
      open={!!selected}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="p-0 sm:max-w-xl">
        <div className="bg-muted relative aspect-video max-h-48 w-full border-b sm:max-h-none">
          {selected?.posterUrl ? (
            <Image
              src={getProxiedImageUrl(selected.posterUrl, selected.lastModifiedAt)}
              alt={selected.title}
              fill
              unoptimized
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="text-muted-foreground/20 h-24 w-24 stroke-1" />
            </div>
          )}
        </div>
        <div className="p-6">
          <DialogHeader>
            <div className="text-muted-foreground text-xs">{selected?.year}</div>
            <DialogTitle className="text-2xl">{selected?.title}</DialogTitle>
            {selected?.retired && (
              <Badge
                variant="outline"
                className="w-fit"
              >
                {t("Spex.retired")}
              </Badge>
            )}
            <DialogDescription className="sr-only">{t("Common.details")}</DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-4 text-sm">
            {selected?.category && (
              <div>
                <div className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase sm:text-[10px]">
                  {t("Spex.category")}
                </div>
                <div className="text-base">{selected.category.name}</div>
              </div>
            )}
            {selected?.revivals && selected.revivals.length > 0 && (
              <div>
                <div className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase sm:text-[10px]">
                  {t("Spex.revivals")}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[...selected.revivals]
                    .filter((r) => r !== null && r !== undefined)
                    .sort((a, b) => Number(a.year) - Number(b.year))
                    .map((revival) => (
                      <Badge
                        key={revival.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {revival.year}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="p-6 pt-0">
          {selected && spexipediaUrl && (
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href={`${spexipediaUrl}/spex/${selected.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              {t("Spex.showInSpexipedia")}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
          >
            {t("Common.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
