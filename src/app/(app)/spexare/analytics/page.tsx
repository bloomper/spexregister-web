import {getTranslations} from "next-intl/server";
import * as Analytics from "@/lib/analytics";
import {AnalyticsDashboard} from "@/components/analytics";
import {DataEmpty} from "@bloomper/fgv-web-ui/shell/data-empty";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {ChartNoAxesCombined} from "lucide-react";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * The statistics of the register, with data quality for editors and operations for administrators.
 */
export default async function AnalyticsPage() {
    return withPolicyPage(Policies.analytics.requireRead, async () => {
        const [data, t] = await Promise.all([
            Analytics.get(),
            getTranslations()
        ]);

        return (
            <Page>
                <PageHeader title={t("Analytics.heading")}/>
                {data ? <AnalyticsDashboard data={data}/> : <DataEmpty icon={ChartNoAxesCombined}/>}
            </Page>
        );
    });
}
