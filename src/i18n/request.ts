import {getRequestConfig} from 'next-intl/server';
import {cookies} from "next/headers";
import {normalizeLocale} from "@/utils/utils.server";

export default getRequestConfig(async () => {
    const store = await cookies();
    const cookieLocale = store.get('locale')?.value;
    const locale = normalizeLocale(cookieLocale);

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});