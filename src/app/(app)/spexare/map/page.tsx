import {getLocale, getTranslations} from "next-intl/server";
import {SpexareMap} from "@/components/map/spexare-map.client";
import {getSpexareLocations} from "@/lib/map";
import {getCountries} from "@/lib/settings";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * The spexare the user may see, on a map at their addresses.
 */
export default async function MapPage() {
    return withPolicyPage(Policies.spexare.requireRead, async () => {
        const locale = await getLocale();
        const [locations, countries, t] = await Promise.all([getSpexareLocations(), getCountries(locale), getTranslations()]);

        return (
            <Page>
                <PageHeader title={t("Map.heading")} description={t("Map.description")}/>
                <SpexareMap locations={locations} countries={countries}/>
            </Page>
        );
    });
}
