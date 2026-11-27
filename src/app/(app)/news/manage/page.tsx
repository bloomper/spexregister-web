import { getPaged } from "@/lib/news";
import { Policies } from "@/utils/policy.server";
import { getTranslations } from "next-intl/server";
import { NewsTable } from "@/components/news";
import { withPolicyPage } from "@/utils/route.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * For editors: all news, published or not, as a table.
 */
export default async function NewsManagePage() {
  return withPolicyPage(Policies.news.requireUpdate, async () => {
    const defaultPageSize = 15;
    const initialData = await getPaged({
      first: defaultPageSize,
      filter: "(published:TRUE OR published:FALSE)",
      full: true,
    });
    const t = await getTranslations();

    return (
      <Page>
        <PageHeader title={t("News.heading")} />
        <NewsTable initialData={initialData} />
      </Page>
    );
  });
}
