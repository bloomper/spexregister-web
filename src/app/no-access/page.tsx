import {redirect} from "next/navigation";
import {getTranslations} from "next-intl/server";
import {LogoutButton} from "@/components/logout-button.client";
import {requireUser} from "@/utils/auth.server";

export default async function NoAccessPage() {
    const {session, roles} = await requireUser();

    if (!session || roles.length > 0) {
        redirect("/");
    }

    const t = await getTranslations("NoAccess");

    return (
        <div className="flex min-h-dvh flex-1 items-center justify-center p-6">
            <div className="mx-auto max-w-md space-y-4 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    {t("title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t("text", {email: session.user.email})}
                </p>
                <div className="flex justify-center gap-2 pt-2">
                    <LogoutButton/>
                </div>
            </div>
        </div>
    );
}
