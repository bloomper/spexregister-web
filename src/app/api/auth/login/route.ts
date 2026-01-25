import {signIn} from '@/auth';
import {NextRequest} from "next/server";
import {normalizeLocale} from "@/utils/utils.server";

export const GET = async (req: NextRequest) => {
    const cookieLocale = req.cookies.get('locale')?.value;
    const locale = normalizeLocale(cookieLocale);

    return signIn('keycloak', undefined, {
        ui_locales: locale,
    });
};
