import {getLocale, getTranslations} from "next-intl/server";
import {SpexareMap} from "@/components/map/spexare-map.client";
import {getSpexareLocations} from "@/lib/map";
import {getCountries} from "@/lib/settings";
import {Policies} from "@/utils/policy.server";
import {withPolicyPage} from "@/utils/route.server";

/**
 * The spexare the user may see, on a map at their addresses.
 */
export default async function MapPage() {
    return withPolicyPage(Policies.spexare.requireRead, async () => {
        const locale = await getLocale();
        const [locations, countries, t] = await Promise.all([getSpexareLocations(), getCountries(locale), getTranslations()]);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Map.heading")}</h2>
                    <p className="text-sm text-muted-foreground">{t("Map.description")}</p>
                </div>
                <SpexareMap locations={locations} countries={countries}/>
            </div>
        );
    });
}
