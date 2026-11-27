"use client";

import { useTransition } from "react";
import { Tag } from "@/gql/schema";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { Plus, Tag as TagIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { createTaggingAction, deleteTaggingAction } from "@/app/(app)/spexare/actions.server";
import { toast } from "sonner";
import { useRefresh } from "@/hooks/use-refresh.client";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@bloomper/fgv-web-ui/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@bloomper/fgv-web-ui/ui/popover";
import { Button } from "@bloomper/fgv-web-ui/ui/button";

export function TaggingManager({
  spexareId,
  initialTaggings = [],
  allTags = [],
}: {
  spexareId: string;
  initialTaggings: Tag[];
  allTags: Tag[];
}) {
  const t = useTranslations();
  const refresh = useRefresh();
  const [isPending, startTransition] = useTransition();

  const usedTagIds = new Set(initialTaggings.map((tag) => tag.id));
  const availableTags = allTags.filter((tag) => !usedTagIds.has(tag.id));

  const handleAdd = (tagId: string) => {
    startTransition(async () => {
      try {
        await createTaggingAction(spexareId, tagId);
        toast.success(t("Common.updateSuccess"));
        refresh();
      } catch (error) {
        void error;
        toast.error(t("Common.errorOccurred"));
      }
    });
  };

  const handleRemove = (tagId: string) => {
    startTransition(async () => {
      try {
        await deleteTaggingAction(spexareId, tagId);
        toast.success(t("Common.deleteSuccess"));
        refresh();
      } catch (error) {
        void error;
        toast.error(t("Common.errorOccurred"));
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                size="sm"
                variant="outline"
                disabled={isPending || availableTags.length === 0}
              />
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Common.add")}
          </PopoverTrigger>
          <PopoverContent
            className="p-0"
            align="start"
          >
            <Command>
              <CommandInput placeholder={t("Spexare.Tagging.searchPlaceholder")} />
              <CommandList>
                <CommandEmpty>{t("Common.noDataFound")}</CommandEmpty>
                <CommandGroup>
                  {availableTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onSelect={() => handleAdd(tag.id)}
                    >
                      {tag.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-2">
        {initialTaggings.length > 0 ? (
          initialTaggings.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1 py-1 pr-1 pl-3"
            >
              <TagIcon className="text-muted-foreground mr-1 h-3 w-3" />
              {tag.name}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-4 w-4 hover:bg-transparent"
                disabled={isPending}
                onClick={() => handleRemove(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))
        ) : (
          <div className="w-full py-6">
            <DataEmpty icon={TagIcon} />
          </div>
        )}
      </div>
    </div>
  );
}
