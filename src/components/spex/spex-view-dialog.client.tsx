import {useTranslations} from "next-intl";
import Image from "next/image";
import {Spex} from "@/gql/schema";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {getProxiedImageUrl} from "@/utils/utils";
import {AuditTrail} from "@/components/data-audit-trail.client";
import {getEventsAction} from "@/app/(app)/spex/actions.server";

export function SpexViewDialog({selected, onClose}: { selected: Spex | null; onClose: () => void }) {
    const t = useTranslations();

    return (
        <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
                <div className="relative aspect-video w-full bg-muted border-b">
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
                            <span className="text-muted-foreground text-xs uppercase tracking-widest">
                                {t("Common.noDataHeading")}
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <DialogHeader>
                        <div className="text-xs text-muted-foreground">
                            {selected?.year}
                        </div>
                        <DialogTitle className="text-2xl">{selected?.title}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {t("Common.details")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 flex flex-col gap-4 text-sm">
                        {selected?.category && (
                            <div>
                                <div
                                    className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
                                    {t("Spex.category")}
                                </div>
                                <div className="text-base">{selected.category.name}</div>
                            </div>
                        )}
                        {selected?.revivals && selected.revivals.length > 0 && (
                            <div>
                                <div
                                    className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
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
                                <AuditTrail id={selected.id} fetchAction={getEventsAction}/>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter className="p-6 pt-0">
                    <Button variant="outline" onClick={onClose}>
                        {t("Common.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
