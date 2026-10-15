"use client";

import {useTransition} from "react";
import {useTranslations} from "next-intl";
import {toast} from "sonner";
import {Loader2, RefreshCw} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {indexSpexareAction} from "@/app/(app)/admin/maintenance/actions.server";

export function AdminTasks() {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();

    const handleIndexSpexare = () => {
        startTransition(async () => {
            try {
                await indexSpexareAction();
                toast.success(t("Admin.indexSpexareStarted"));
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>{t("Admin.searchIndexHeading")}</CardTitle>
                    <CardDescription>{t("Admin.searchIndexDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" onClick={handleIndexSpexare} disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                            <RefreshCw className="mr-2 h-4 w-4"/>}
                        {t("Admin.indexSpexare")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
