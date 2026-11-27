import {getTranslations} from "next-intl/server";
import {Button} from "@bloomper/fgv-web-ui/ui/button";
import {StatusPage} from "@bloomper/fgv-web-ui/shell/status-pages";

/**
 * Shown when signing in failed, with a way to try again.
 */
export default async function LoginErrorPage() {
    const t = await getTranslations();

    return (
        <StatusPage
            title={t("Common.errorOccurred")}
            text={t("Common.loginFailed")}
            actions={<Button nativeButton={false} render={<a href="/api/auth/login"/>}>{t("Common.login")}</Button>}
        />
    );
}
