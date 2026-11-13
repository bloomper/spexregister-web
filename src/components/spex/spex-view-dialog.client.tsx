"use client";

import {useTranslations} from "next-intl";
import Image from "next/image";
import {Spex} from "@/gql/schema";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ImageIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {getProxiedImageUrl} from "@/utils/utils";
import {AuditTrail} from "@/components/data-audit-trail.client";
import {getRevisionsAction} from "@/app/(app)/spex/actions.server";

/**
 * A spex as Spexregister's copy has it, with its history (not restorable: Spexipedia keeps spex) and a link to its page
 * in Spexipedia.
 */
export function SpexViewDialog({selected, spexipediaUrl = null, onClose}: {
    selected: Spex | null;
    spexipediaUrl?: string | null;
    onClose: () => void
}) {
    const t = useTranslations();

    return (
        <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl p-0">
                <div className="relative aspect-video max-h-48 w-full bg-muted border-b sm:max-h-none">
                    {selected?.posterUrl ? (
                        <Image
                            src={getProxiedImageUrl(selected.posterUrl, selected.lastModifiedAt)}
                            alt={selected.title}
                            fill
                            unoptimized
                            className="object-contain w-full h-full"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-24 w-24 text-muted-foreground/20 stroke-1"/>
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <DialogHeader>
                        <div className="text-xs text-muted-foreground">
                            {selected?.year}
                        </div>
                        <DialogTitle className="text-2xl">{selected?.title}</DialogTitle>
                        {selected?.retired && <Badge variant="outline" className="w-fit">{t("Spex.retired")}</Badge>}
                        <DialogDescription className="sr-only">
                            {t("Common.details")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex flex-col gap-4 text-sm">
                        {selected?.category && (
                            <div>
                                <div
                                    className="font-semibold text-muted-foreground uppercase text-xs sm:text-[10px] tracking-wider mb-1">
                                    {t("Spex.category")}
                                </div>
                                <div className="text-base">{selected.category.name}</div>
                            </div>
                        )}
                        {selected?.revivals && selected.revivals.length > 0 && (
                            <div>
                                <div
                                    className="font-semibold text-muted-foreground uppercase text-xs sm:text-[10px] tracking-wider mb-1">
                                    {t("Spex.revivals")}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {[...selected.revivals]
                                        .filter((r) => r !== null && r !== undefined)
                                        .sort((a, b) => Number(a.year) - Number(b.year))
                                        .map((revival) => (
                                            <Badge key={revival.id} variant="secondary" className="text-xs">
                                                {revival.year}
                                            </Badge>
                                        ))}
                                </div>
                            </div>
                        )}

                        {selected && (
                            <div className="space-y-4">
                                <AuditTrail id={selected.id} fetchAction={getRevisionsAction}/>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter className="p-6 pt-0">
                    {selected && spexipediaUrl && (
                        <Button variant="outline"
                                render={<a href={`${spexipediaUrl}/spex/${selected.id}`} target="_blank" rel="noopener noreferrer"/>}>
                            {t("Spex.showInSpexipedia")}
                        </Button>
                    )}
                    <Button variant="outline" onClick={onClose}>
                        {t("Common.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
