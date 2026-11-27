import { Policies } from "@/utils/policy.server";
import { getTranslations } from "next-intl/server";
import { ImpexTable } from "@/components/impex/impex-table.client";
import { withPolicyPage } from "@/utils/route.server";
import { jobs as getJobs } from "@/lib/impex";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * The user's own import and export jobs, their outcome and their files.
 */
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
        endCursor: null,
      },
      totalCount: jobs.length,
    };

    return (
      <Page>
        <PageHeader
          title={t("Impex.heading")}
          description={t("Impex.purgeHint")}
        />
        <ImpexTable initialData={initialData} />
      </Page>
    );
  });
}
