import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {getTranslations} from "next-intl/server";
import {AdminTasks, SyncSources} from "@/components/admin";
import {getMaintenanceJobs, getSyncSources} from "@/lib/admin";

/**
 * For administrators: the scheduled maintenance jobs, which can also be run by hand, and the copy of Spexipedia's base
 * data.
 */
export default async function MaintenancePage() {
    return withPolicyPage(Policies.admin.requireAdmin, async () => {
        const [t, jobs, sources] = await Promise.all([getTranslations(), getMaintenanceJobs(), getSyncSources()]);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">{t("Admin.maintenance")}</h1>
                </div>
                <p className="text-sm text-muted-foreground">{t("Admin.description")}</p>
                <AdminTasks jobs={jobs}/>
                <h2 className="mt-4 text-xl font-semibold tracking-tight">{t("Admin.sync.heading")}</h2>
                <SyncSources sources={sources}/>
            </div>
        );
    });
}
