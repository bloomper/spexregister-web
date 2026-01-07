import {SpexareGrid} from "@/components/spexare";
import {getPaged} from "@/lib/spexare";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {UserRound} from "lucide-react";
import {getCountries} from "@/lib/settings";
import {getLocale} from "next-intl/server";

export default async function SpexarePage() {
    return withPolicyPage(Policies.spexare.requireRead, async () => {
        const first = 24;

        const [page, countries] = await Promise.all([
            getPaged({first, after: null}),
            getLocale().then(locale => getCountries(locale)),
        ]);
        const initialItems = page.edges.map((e) => e.node);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
                        <SpexareGrid countries={countries} initialItems={initialItems} initialPageInfo={page.pageInfo}/>
                    ) : (
                        <DataEmpty icon={UserRound}/>
                    )}
                </div>
            </div>
        );
    });
}
