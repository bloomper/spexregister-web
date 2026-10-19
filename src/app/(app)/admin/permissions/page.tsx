import {getTranslations} from "next-intl/server";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {getGrantsPage} from "@/lib/permission";
import {SortDirection} from "@/gql/schema";
import {getAuthorities, getPaged as getUsers} from "@/lib/user";
import {getAll as getAllSpex} from "@/lib/spex";
import {PermissionGrants} from "@/components/admin/permission/permission-grants.client";

export default async function PermissionsPage() {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations();
        const [grants, users, spex, authorities] = await Promise.all([
            getGrantsPage({first: 15, sort: ["createdAt"], direction: SortDirection.Desc}),
            getUsers({first: 500, after: null}),
            getAllSpex(),
            getAuthorities(),
        ]);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("PermissionGrant.heading")}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{t("PermissionGrant.description")}</p>
                <p className="text-sm text-muted-foreground">{t("PermissionGrant.ownSpexareNote")}</p>
                <PermissionGrants
                    initialData={grants}
                    users={users.items.map((user) => ({
                        id: user.id,
                        label: user.spexare ? `${user.spexare.firstName} ${user.spexare.lastName} (${user.email})` : user.email,
                    }))}
                    spex={spex.map((s) => ({id: s.id, label: `${s.title} (${s.year})`}))}
                    roles={authorities.map((authority) => ({id: authority.id, label: authority.label}))}
                />
            </div>
        );
    });
}
