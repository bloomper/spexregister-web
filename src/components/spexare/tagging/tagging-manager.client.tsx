"use client";

import {useTransition} from "react";
import {Tag} from "@/gql/graphql";
import {Badge} from "@/components/ui/badge";
import {Plus, Tag as TagIcon, X} from "lucide-react";
import {useTranslations} from "next-intl";
import {createTaggingAction, deleteTaggingAction} from "@/app/(app)/spexare/actions.server";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {DataEmpty} from "@/components/data-empty";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";

export function TaggingManager({
                                   spexareId,
                                   initialTaggings = [],
                                   allTags = []
                               }: {
    spexareId: string;
    initialTaggings: Tag[];
    allTags: Tag[]
}) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const usedTagIds = new Set(initialTaggings.map(tag => tag.id));
    const availableTags = allTags.filter(tag => !usedTagIds.has(tag.id));

    const handleAdd = (tagId: string) => {
        startTransition(async () => {
            try {
                await createTaggingAction(spexareId, tagId);
                toast.success(t("Common.createSuccess"));
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleRemove = (tagId: string) => {
        startTransition(async () => {
            try {
                await deleteTaggingAction(spexareId, tagId);
                toast.success(t("Common.deleteSuccess"));
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="sm" variant="outline" disabled={isPending || availableTags.length === 0}>
                            <Plus className="h-4 w-4 mr-2"/>
                            {t("Common.add")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                        <Command>
                            <CommandInput placeholder={t("Spexare.Tagging.searchPlaceholder")}/>
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
                        <Badge key={tag.id} variant="secondary" className="pl-3 pr-1 py-1 gap-1">
                            <TagIcon className="h-3 w-3 mr-1 text-muted-foreground"/>
                            {tag.name}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 hover:bg-transparent"
                                disabled={isPending}
                                onClick={() => handleRemove(tag.id)}
                            >
                                <X className="h-3 w-3"/>
                            </Button>
                        </Badge>
                    ))
                ) : (
                    <div className="py-6 w-full">
                        <DataEmpty icon={TagIcon}/>
                    </div>
                )}
            </div>
        </div>
    );
}
