import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {getTranslations} from "next-intl/server";
import {AdminTasks} from "@/components/admin";

export default async function AdminPage() {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Admin.heading")}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{t("Admin.description")}</p>
                <AdminTasks/>
            </div>
        );
    });
}
