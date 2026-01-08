import {getAuthorities, getPaged, getStates} from "@/lib/user";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {UserTable} from "@/components/user";
import {withPolicyPage} from "@/utils/route.server";

export default async function UserManagePage() {
    return withPolicyPage(Policies.user.requireUpdate, async () => {
        const defaultPageSize = 15;
        const [initialData, states, authorities, t] = await Promise.all([
            getPaged({
                first: defaultPageSize,
                full: true
            }),
            getStates(),
            getAuthorities(),
            getTranslations()
        ]);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("User.heading")}</h2>
                </div>
                <UserTable
                    initialData={initialData}
                    states={states}
                    authorities={authorities}
                />
            </div>
        );
    });
}
