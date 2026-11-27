import { getPaged } from "@/lib/tag";
import { Policies } from "@/utils/policy.server";
import { getTranslations } from "next-intl/server";
import { TagTable } from "@/components/tag";
import { withPolicyPage } from "@/utils/route.server";
import { TagCreateForm } from "./create.client";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * For editors: the tag table with the form to add a tag.
 */
export default async function TagCreatePage() {
  return withPolicyPage(Policies.tag.requireCreate, async () => {
    const defaultPageSize = 15;
    const initialData = await getPaged({
      first: defaultPageSize,
      full: true,
    });
    const t = await getTranslations();

    return (
      <Page>
        <PageHeader title={t("Tag.heading")} />
        <TagTable initialData={initialData} />
        <TagCreateForm />
      </Page>
    );
  });
}
