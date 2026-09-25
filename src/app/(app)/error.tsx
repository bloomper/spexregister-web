"use client";

import {useEffect} from "react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";

export default function AppError({error, reset}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-dvh flex-1 items-center justify-center p-6">
            <div className="mx-auto max-w-md space-y-4 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("Common.errorOccurred")}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t("Common.couldNotLoadData")}
                </p>
                <div className="flex justify-center gap-2 pt-2">
                    <Button onClick={() => reset()}>{t("Common.tryAgain")}</Button>
                    <Button variant="outline" nativeButton={false}
                            render={<a href="/api/auth/login"/>}>{t("Common.login")}</Button>
                </div>
            </div>
        </div>
    );
}
