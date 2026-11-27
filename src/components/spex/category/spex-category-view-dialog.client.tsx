"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { SpexCategory } from "@/gql/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bloomper/fgv-web-ui/ui/dialog";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { getProxiedImageUrl } from "@/utils/utils";

export function SpexCategoryViewDialog({ selected, onClose }: { selected: SpexCategory | null; onClose: () => void }) {
  const t = useTranslations();

  return (
    <Dialog
      open={!!selected}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{selected?.name}</DialogTitle>
          <DialogDescription className="sr-only">{t("Common.details")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium">
            {t("Spex.Category.firstYear")}:{" "}
            <span className="text-muted-foreground font-normal">{selected?.firstYear}</span>
          </div>
          {selected?.logoUrl && (
            <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-md">
              <Image
                src={getProxiedImageUrl(selected.logoUrl, selected.lastModifiedAt)}
                alt={selected.name}
                fill
                unoptimized
                className="object-contain p-6"
              />
            </div>
          )}
        </div>
        <DialogFooter>
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
