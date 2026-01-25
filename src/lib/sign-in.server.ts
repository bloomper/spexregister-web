'use server';

import {signIn as rawSignIn} from '@/auth';
import {cookies} from 'next/headers';
import {normalizeLocale} from "@/utils/utils.server";

export const signIn = async () => {
    const cookieLocale = (await cookies()).get('locale')?.value;
    const locale = normalizeLocale(cookieLocale);

    return rawSignIn('keycloak', undefined, {
        ui_locales: locale,
    });
};
