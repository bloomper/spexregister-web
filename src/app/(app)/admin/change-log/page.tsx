import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {getTranslations} from "next-intl/server";
import {getRevisionAuthors, getRevisionFeedPaged} from "@/lib/audit/audit.server";
import {ChangeLogTable} from "@/components/audit/change-log-table.client";

export default async function ChangeLogPage() {
    return withPolicyPage(Policies.audit.requireRestore, async () => {
        const defaultPageSize = 15;
        const [initialData, authors, t] = await Promise.all([
            getRevisionFeedPaged({first: defaultPageSize}),
            getRevisionAuthors(),
            getTranslations(),
        ]);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Audit.title")}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{t("Audit.feedDescription")}</p>
                <ChangeLogTable initialData={initialData} authors={authors}/>
            </div>
        );
    });
}
