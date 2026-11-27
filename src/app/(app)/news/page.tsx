import { NewsGrid } from "@/components/news";
import { getTranslations } from "next-intl/server";
import { getPaged } from "@/lib/news";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { withPolicyPage } from "@/utils/route.server";
import { Policies } from "@/utils/policy.server";
import { Newspaper } from "lucide-react";
import { Page } from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * The news as cards, scrolling on.
 */
export default async function NewsPage() {
  return withPolicyPage(Policies.news.requireRead, async () => {
    const [page, canUpdate] = await Promise.all([getPaged({ first: 24, after: null }), Policies.news.requireUpdate()]);
    const initialItems = page.items;
    const t = await getTranslations();

    return (
      <Page>
        <h1 className="sr-only">{t("News.heading")}</h1>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {initialItems.length > 0 ? (
            <NewsGrid
              initialItems={initialItems}
              initialPageInfo={page.pageInfo}
              canUpdate={canUpdate.ok}
            />
          ) : (
            <DataEmpty icon={Newspaper} />
          )}
        </div>
      </Page>
    );
  });
}
