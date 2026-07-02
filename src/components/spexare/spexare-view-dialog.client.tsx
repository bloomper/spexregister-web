import {useTranslations} from "next-intl";
import {Country, Spexare} from "@/gql/schema";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {SpexareView} from "@/components/spexare/spexare-view.client";

type SpexareViewDialogProps = {
    open: boolean;
    onClose: () => void;
    summary?: Pick<Spexare, "firstName" | "lastName"> | null;
    full: Spexare | null;
    isLoading: boolean;
    countries: Country[];
    isMe: boolean;
    showAudit?: boolean;
};

export function SpexareViewDialog({
                                      open,
                                      onClose,
                                      summary,
                                      full,
                                      isLoading,
                                      countries,
                                      isMe,
                                      showAudit = false,
                                  }: SpexareViewDialogProps) {
    const t = useTranslations();

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    onClose();
                }
            }}
        >
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>
                        {full
                            ? `${full.firstName} ${full.lastName}`
                            : summary
                                ? `${summary.firstName} ${summary.lastName}`
                                : t("Common.details")}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="p-6">
                        <div className="flex items-center justify-center py-16">
                            <Spinner className="size-8"/>
                        </div>
                    </div>
                ) : full ? (
                    <SpexareView
                        spexare={full}
                        countries={countries}
                        isMe={isMe}
                        showAudit={showAudit}
                    />
                ) : (
                    <div className="p-6 text-sm text-muted-foreground">
                        {t("Common.noData")}
                    </div>
                )}

                <DialogFooter className="p-6 pt-0">
                    <Button variant="outline" onClick={onClose}>
                        {t("Common.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
