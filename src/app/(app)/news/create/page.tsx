import { getPaged } from "@/lib/news";
import { Policies } from "@/utils/policy.server";
import { getTranslations } from "next-intl/server";
import { NewsTable } from "@/components/news";
import { withPolicyPage } from "@/utils/route.server";
import { NewsCreateForm } from "./create.client";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * For editors: the news table with the form to add a news item.
 */
export default async function NewsCreatePage() {
  return withPolicyPage(Policies.news.requireCreate, async () => {
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
        <NewsCreateForm />
      </Page>
    );
  });
}
