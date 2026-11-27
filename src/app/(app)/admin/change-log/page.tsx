import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {getTranslations} from "next-intl/server";
import {getRevisionAuthors, getRevisionFeedPaged} from "@/lib/audit/audit.server";
import {ChangeLogTable} from "@/components/audit/change-log-table.client";
import {getSpexipedia} from "@/utils/applications.server";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * For administrators: every change in the register, newest first, filtered by type, author, source and period.
 */
export default async function ChangeLogPage() {
    return withPolicyPage(Policies.audit.requireRestore, async () => {
        const defaultPageSize = 15;
        const [initialData, authors, spexipedia, t] = await Promise.all([
            getRevisionFeedPaged({first: defaultPageSize}),
            getRevisionAuthors(),
            getSpexipedia(),
            getTranslations(),
        ]);

        return (
            <Page>
                <PageHeader title={t("Audit.title")}/>
                <p className="text-sm text-muted-foreground">{t("Audit.feedDescription")}</p>
                <ChangeLogTable initialData={initialData} authors={authors} spexipedia={spexipedia}/>
            </Page>
        );
    });
}
