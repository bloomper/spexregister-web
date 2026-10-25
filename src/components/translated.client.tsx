"use client";

import {useTranslations} from "next-intl";

/**
 * A message in the user's language, for places that cannot call a translation hook, such as column headers.
 */
export function Translated({id}: { id: string }) {
    const t = useTranslations();
    return <>{t(id)}</>;
}
