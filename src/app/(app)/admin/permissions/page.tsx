import {getTranslations} from "next-intl/server";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {getGrantsPage} from "@/lib/permission";
import {SortDirection} from "@/gql/schema";
import {getAuthorities} from "@/lib/user";
import {getAll as getAllSpex} from "@/lib/spex";
import {PermissionGrants} from "@/components/admin/permission/permission-grants.client";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * For administrators: the permission grants, and adding one for a user or role on a spexare, a spex's participants or a
 * spex.
 */
export default async function PermissionsPage() {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations();
        const [grants, spex, authorities] = await Promise.all([
            getGrantsPage({first: 15, sort: ["createdAt"], direction: SortDirection.Desc}),
            getAllSpex(),
            getAuthorities(),
        ]);

        return (
            <Page>
                <PageHeader title={t("PermissionGrant.heading")}/>
                <p className="text-sm text-muted-foreground">{t("PermissionGrant.description")}</p>
                <p className="text-sm text-muted-foreground">{t("PermissionGrant.ownSpexareNote")}</p>
                <PermissionGrants
                    initialData={grants}
                    spex={spex.map((s) => ({id: s.id, label: `${s.title} (${s.year})`}))}
                    roles={authorities.map((authority) => ({id: authority.id, label: authority.label}))}
                />
            </Page>
        );
    });
}
