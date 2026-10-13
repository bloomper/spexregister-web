import {getTranslations} from "next-intl/server";
import {Button} from "@/components/ui/button";

export default async function LoginErrorPage() {
    const t = await getTranslations();

    return (
        <div className="flex min-h-dvh flex-1 items-center justify-center p-6">
            <div className="mx-auto max-w-md space-y-4 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("Common.errorOccurred")}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t("Common.loginFailed")}
                </p>
                <div className="flex justify-center gap-2 pt-2">
                    <Button nativeButton={false}
                            render={<a href="/api/auth/login"/>}>{t("Common.login")}</Button>
                </div>
            </div>
        </div>
    );
}
