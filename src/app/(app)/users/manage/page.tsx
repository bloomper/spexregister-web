import {getAuthorities, getPaged, getStates} from "@/lib/user";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {UserTable} from "@/components/user";
import {withPolicyPage} from "@/utils/route.server";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * For administrators: the users as a table, with their roles, state and spexare.
 */
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
            <Page>
                <PageHeader title={t("User.heading")}/>
                <UserTable
                    initialData={initialData}
                    states={states}
                    authorities={authorities}
                />
            </Page>
        );
    });
}
