import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {ImpexTable} from "@/components/impex/impex-table.client";
import {withPolicyPage} from "@/utils/route.server";
import {jobs as getJobs} from "@/lib/impex";

export default async function ImpexManagePage() {
    return withPolicyPage(Policies.impex.requireRead, async () => {
        const t = await getTranslations();
        const jobs = await getJobs();

        const initialData = {
            items: jobs,
            pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                startCursor: null,
                endCursor: null
            }
        };

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold tracking-tight">{t("Impex.heading")}</h2>
                        <p className="text-sm text-muted-foreground">
                            {t("Impex.purgeHint")}
                        </p>
                    </div>
                </div>
                <ImpexTable initialData={initialData}/>
            </div>
        );
    });
}