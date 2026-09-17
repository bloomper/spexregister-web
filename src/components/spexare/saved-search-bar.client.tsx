"use client";

import {useState, useTransition} from "react";
import {useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {Bookmark, BookmarkPlus, Check, Pencil, Save, Trash2, X} from "lucide-react";
import {toast} from "sonner";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {SavedSearch} from "@/gql/schema";
import {
    createSavedSearchAction,
    deleteSavedSearchAction,
    updateSavedSearchAction
} from "@/app/(app)/spexare/search/actions.server";

const currentQuery = () => window.location.search.replace(/^\?/, "");

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function SavedSearchBar({savedSearches = []}: { savedSearches?: SavedSearch[] }) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isSaving, setIsSaving] = useState(false);
    const [name, setName] = useState("");
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [draftName, setDraftName] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlight, setHighlight] = useState(-1);

    const matching = (candidate: string) => savedSearches.find((s) => sameName(s.name, candidate));

    const typed = name.trim().toLowerCase();
    const suggestions = savedSearches.filter((s) => !typed || s.name.toLowerCase().includes(typed));

    const run = (action: () => Promise<unknown>, successMessage: string, onDone?: () => void) => {
        startTransition(async () => {
            try {
                await action();
                onDone?.();
                toast.success(successMessage);
                router.refresh();
            } catch {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const openSaveDialog = () => {
        if (!currentQuery()) {
            toast.message(t("SavedSearch.nothingToSave"));
            return;
        }
        setName("");
        setShowSuggestions(false);
        setHighlight(-1);
        setIsSaving(true);
    };

    const chooseSuggestion = (value: string) => {
        setName(value);
        setShowSuggestions(false);
        setHighlight(-1);
    };

    const save = () => {
        const query = currentQuery();
        const trimmed = name.trim();

        if (!trimmed || !query) {
            return;
        }

        const existing = matching(trimmed);

        run(
            () => existing
                ? updateSavedSearchAction(existing.id, {name: trimmed, query})
                : createSavedSearchAction({name: trimmed, query}),
            t(existing ? "SavedSearch.updateSuccess" : "SavedSearch.saveSuccess"),
            () => setIsSaving(false),
        );
    };

    const apply = (savedSearch: SavedSearch) => {
        router.push(`/spexare/search?${savedSearch.query}`);
    };

    const updateToCurrent = (savedSearch: SavedSearch) => {
        const query = currentQuery();

        if (!query) {
            toast.message(t("SavedSearch.nothingToSave"));
            return;
        }

        run(
            () => updateSavedSearchAction(savedSearch.id, {name: savedSearch.name, query}),
            t("SavedSearch.updateSuccess"),
        );
    };

    const remove = (savedSearch: SavedSearch) => {
        run(() => deleteSavedSearchAction(savedSearch.id), t("SavedSearch.deleteSuccess"));
    };

    const startRename = (savedSearch: SavedSearch) => {
        setRenamingId(savedSearch.id);
        setDraftName(savedSearch.name);
    };

    const cancelRename = () => {
        setRenamingId(null);
        setDraftName("");
    };

    const commitRename = (savedSearch: SavedSearch) => {
        const trimmed = draftName.trim();

        if (!trimmed || sameName(trimmed, savedSearch.name)) {
            cancelRename();
            return;
        }

        if (savedSearches.some((s) => s.id !== savedSearch.id && sameName(s.name, trimmed))) {
            toast.error(t("SavedSearch.nameTaken"));
            return;
        }

        run(
            () => updateSavedSearchAction(savedSearch.id, {name: trimmed, query: savedSearch.query}),
            t("SavedSearch.renameSuccess"),
            cancelRename,
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Popover onOpenChange={(open) => !open && cancelRename()}>
                <PopoverTrigger render={<Button variant="outline" size="sm" className="h-8"/>}>
                    <Bookmark className="mr-2 h-4 w-4"/>
                    {t("SavedSearch.heading")}
                    {savedSearches.length > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground">{savedSearches.length}</span>
                    )}
                </PopoverTrigger>
                <PopoverContent className="w-auto min-w-72 max-w-96 p-1" align="start">
                    {savedSearches.length === 0 ? (
                        <p className="px-2 py-3 text-center text-sm text-muted-foreground">
                            {t("SavedSearch.empty")}
                        </p>
                    ) : (
                        <div className="flex flex-col">
                            {savedSearches.map((savedSearch) => (
                                <div key={savedSearch.id} className="flex items-center gap-1">
                                    {renamingId === savedSearch.id ? (
                                        <>
                                            <Input
                                                autoFocus
                                                className="h-7 flex-1 text-xs"
                                                value={draftName}
                                                aria-label={t("SavedSearch.renameLabel", {name: savedSearch.name})}
                                                onChange={(e) => setDraftName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        commitRename(savedSearch);
                                                    }
                                                    if (e.key === "Escape") {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        cancelRename();
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0"
                                                aria-label={t("Common.save")}
                                                disabled={isPending}
                                                onClick={() => commitRename(savedSearch)}
                                            >
                                                <Check className="h-3 w-3"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0"
                                                aria-label={t("Common.cancel")}
                                                onClick={cancelRename}
                                            >
                                                <X className="h-3 w-3"/>
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 flex-1 justify-start font-normal"
                                                onClick={() => apply(savedSearch)}
                                            >
                                                <span className="truncate">{savedSearch.name}</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0"
                                                aria-label={t("SavedSearch.renameLabel", {name: savedSearch.name})}
                                                onClick={() => startRename(savedSearch)}
                                            >
                                                <Pencil className="h-3 w-3"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0"
                                                aria-label={t("SavedSearch.updateLabel", {name: savedSearch.name})}
                                                onClick={() => updateToCurrent(savedSearch)}
                                            >
                                                <Save className="h-3 w-3"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 shrink-0"
                                                aria-label={t("SavedSearch.deleteLabel", {name: savedSearch.name})}
                                                onClick={() => remove(savedSearch)}
                                            >
                                                <Trash2 className="h-3 w-3"/>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" className="h-8" onClick={openSaveDialog}>
                <BookmarkPlus className="mr-2 h-4 w-4"/>
                {t("SavedSearch.save")}
            </Button>

            <Dialog open={isSaving} onOpenChange={setIsSaving}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t("SavedSearch.saveHeading")}</DialogTitle>
                    </DialogHeader>
                    <div className="relative">
                        <Input
                            autoFocus
                            role="combobox"
                            aria-expanded={showSuggestions && suggestions.length > 0}
                            aria-autocomplete="list"
                            aria-controls="saved-search-suggestions"
                            value={name}
                            placeholder={t("SavedSearch.namePlaceholder")}
                            onChange={(e) => {
                                const value = e.target.value;
                                const candidate = value.trim().toLowerCase();

                                setName(value);
                                setShowSuggestions(
                                    candidate.length > 0
                                    && savedSearches.some((s) => s.name.toLowerCase().includes(candidate)),
                                );
                                setHighlight(-1);
                            }}
                            onClick={() => setShowSuggestions(true)}
                            onBlur={() => setShowSuggestions(false)}
                            onKeyDown={(e) => {
                                if (e.key === "ArrowDown" && suggestions.length > 0) {
                                    e.preventDefault();
                                    setShowSuggestions(true);
                                    setHighlight((i) => Math.min(i + 1, suggestions.length - 1));
                                    return;
                                }
                                if (e.key === "ArrowUp" && suggestions.length > 0) {
                                    e.preventDefault();
                                    setHighlight((i) => Math.max(i - 1, -1));
                                    return;
                                }
                                if (e.key === "Escape" && showSuggestions) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowSuggestions(false);
                                    setHighlight(-1);
                                    return;
                                }
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (showSuggestions && highlight >= 0) {
                                        chooseSuggestion(suggestions[highlight].name);
                                        return;
                                    }
                                    save();
                                }
                            }}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <div
                                id="saved-search-suggestions"
                                aria-label={t("SavedSearch.existing")}
                                className="absolute z-50 mt-1 flex max-h-40 w-full flex-col overflow-y-auto rounded-md border bg-popover p-1 shadow-md"
                            >
                                {suggestions.map((savedSearch, index) => (
                                    <Button
                                        key={savedSearch.id}
                                        variant="ghost"
                                        size="sm"
                                        data-highlighted={index === highlight ? "" : undefined}
                                        className="h-7 justify-start font-normal data-highlighted:bg-accent"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => chooseSuggestion(savedSearch.name)}
                                    >
                                        <span className="truncate">{savedSearch.name}</span>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                    {matching(name) && (
                        <p className="text-xs text-muted-foreground">{t("SavedSearch.overwriteHint")}</p>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSaving(false)}>
                            {t("Common.cancel")}
                        </Button>
                        <Button onClick={save} disabled={!name.trim() || isPending}>
                            {matching(name) ? t("SavedSearch.update") : t("Common.save")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
