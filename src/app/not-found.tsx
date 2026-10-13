import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Button} from "@/components/ui/button";

export default async function NotFoundPage() {
    const t = await getTranslations();

    return (
        <div className="flex min-h-dvh flex-1 items-center justify-center p-6">
            <div className="mx-auto max-w-md space-y-4 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("Common.pageNotFound")}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t("Common.pageNotFoundDescription")}
                </p>
                <div className="flex justify-center gap-2 pt-2">
                    <Button nativeButton={false}
                            render={<Link href="/"/>}>{t("Common.backToHome")}</Button>
                </div>
            </div>
        </div>
    );
}
