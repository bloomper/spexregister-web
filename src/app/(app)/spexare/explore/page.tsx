import { getLocale, getTranslations } from "next-intl/server";
import { GraphExplorer } from "@/components/graph/graph-explorer.client";
import { getCountries } from "@/lib/settings";
import { Policies } from "@/utils/policy.server";
import { withPolicyPage } from "@/utils/route.server";
import { getSpexipedia } from "@/utils/applications.server";
import { Page, PageHeader } from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * The register as a graph to explore from a spexare, spex, task or tag.
 */
export default async function GraphPage() {
  return withPolicyPage(Policies.spexare.requireRead, async () => {
    const locale = await getLocale();
    const [countries, spexipedia, t] = await Promise.all([getCountries(locale), getSpexipedia(), getTranslations()]);

    return (
      <Page>
        <PageHeader
          title={t("Explore.heading")}
          description={t("Explore.description")}
        />
        <GraphExplorer
          countries={countries}
          spexipediaUrl={spexipedia?.url ?? null}
        />
      </Page>
    );
  });
}
