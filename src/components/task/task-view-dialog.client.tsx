"use client";

import { useTranslations } from "next-intl";
import { Task } from "@/gql/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@bloomper/fgv-web-ui/ui/dialog";
import { Button } from "@bloomper/fgv-web-ui/ui/button";

export function TaskViewDialog({ selected, onClose }: { selected: Task | null; onClose: () => void }) {
  const t = useTranslations();

  return (
    <Dialog
      open={!!selected}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="p-0 sm:max-w-xl">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selected?.name}</DialogTitle>
            <DialogDescription className="sr-only">{t("Common.details")}</DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase sm:text-[10px]">
                {t("Task.category")}
              </div>
              <div className="text-base">{selected?.category?.name ?? t("Common.none")}</div>
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 pt-0">
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
