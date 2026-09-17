import {getLocale, getTranslations} from "next-intl/server";
import {GraphExplorer} from "@/components/graph/graph-explorer.client";
import {getCountries} from "@/lib/settings";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

export default async function GraphPage() {
    return withPolicyPage(Policies.spexare.requireRead, async () => {
        const locale = await getLocale();
        const [countries, t] = await Promise.all([getCountries(locale), getTranslations()]);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Explore.heading")}</h2>
                    <p className="text-sm text-muted-foreground">{t("Explore.description")}</p>
                </div>
                <GraphExplorer countries={countries}/>
            </div>
        );
    });
}
