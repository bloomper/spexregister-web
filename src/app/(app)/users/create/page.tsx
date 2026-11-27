import {getAuthorities, getPaged, getStates} from "@/lib/user";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {UserTable} from "@/components/user";
import {withPolicyPage} from "@/utils/route.server";
import {UserCreateForm} from "./create.client";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * For administrators: the user table with the form to add a user.
 */
export default async function UserCreatePage() {
    return withPolicyPage(Policies.user.requireCreate, async () => {
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
                <UserCreateForm
                    states={states}
                    authorities={authorities}
                />
            </Page>
        );
    });
}
