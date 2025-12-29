"use client";

import {useTranslations} from "next-intl";

export function Translated({id}: { id: string }) {
    const t = useTranslations();
    return <>{t(id as any)}</>;
}
