import {getTranslations} from "next-intl/server";
import * as Analytics from "@/lib/analytics";
import {AnalyticsDashboard} from "@/components/analytics";
import {DataEmpty} from "@/components/data-empty";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {ChartNoAxesCombined} from "lucide-react";

export default async function AnalyticsPage() {
    return withPolicyPage(Policies.analytics.requireRead, async () => {
        const [data, t] = await Promise.all([
            Analytics.get(),
            getTranslations()
        ]);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Analytics.heading")}</h2>
                </div>
                {data ? <AnalyticsDashboard data={data}/> : <DataEmpty icon={ChartNoAxesCombined}/>}
            </div>
        );
    });
}
