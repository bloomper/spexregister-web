import {getRequestConfig} from "next-intl/server";
import {cookies} from "next/headers";
import {normalizeLocale} from "@/utils/utils.server";
import {withFgvMessages} from "@bloomper/fgv-web-ui/messages";

export default getRequestConfig(async () => {
    const store = await cookies();
    const cookieLocale = store.get("locale")?.value;
    const locale = normalizeLocale(cookieLocale);

    return {
        locale,
        timeZone: "Europe/Stockholm",
        messages: withFgvMessages(locale, (await import(`../../messages/${locale}.json`)).default)
    };
});