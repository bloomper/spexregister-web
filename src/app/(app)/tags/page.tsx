import { TagGrid } from "@/components/tag";
import { getTranslations } from "next-intl/server";
import { getPaged } from "@/lib/tag";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { withPolicyPage } from "@/utils/route.server";
import { Policies } from "@/utils/policy.server";
import { Tag } from "lucide-react";
import { Page } from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * The tags as cards, scrolling on.
 */
export default async function TagPage() {
  return withPolicyPage(Policies.tag.requireRead, async () => {
    const [page, canUpdate] = await Promise.all([getPaged({ first: 24, after: null }), Policies.tag.requireUpdate()]);
    const initialItems = page.items;
    const t = await getTranslations();

    return (
      <Page>
        <h1 className="sr-only">{t("Tag.heading")}</h1>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {initialItems.length > 0 ? (
            <TagGrid
              initialItems={initialItems}
              initialPageInfo={page.pageInfo}
              canUpdate={canUpdate.ok}
            />
          ) : (
            <DataEmpty icon={Tag} />
          )}
        </div>
      </Page>
    );
  });
}
