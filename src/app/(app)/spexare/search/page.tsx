import {search} from "@/lib/spexare";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {UserRound} from "lucide-react";
import {getCountries} from "@/lib/settings";
import {getLocale} from "next-intl/server";
import {SpexareGrid} from "@/components/spexare";
import {DataEmpty} from "@/components/data-empty";
import {me} from "@/lib/user";

export default async function SpexareSearchPage({
                                                    searchParams,
                                                }: {
    searchParams: Promise<{ q?: string }>;
}) {
    return withPolicyPage(Policies.spexare.requireRead, async () => {
        const {q = ""} = await searchParams;
        const locale = await getLocale();

        const [page, countries, currentUser] = await Promise.all([
            search({q}),
            getCountries(locale),
            me(),
        ]);
        const initialItems = page.edges.map((e) => e.node);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
                        <SpexareGrid
                            countries={countries}
                            initialItems={initialItems}
                            initialPageInfo={page.pageInfo}
                            initialSearchQuery={q}
                            mode="search"
                            facets={page.facets}
                            currentSpexareId={currentUser?.spexare?.id ?? null}
                        />
                    ) : (
                        <DataEmpty icon={UserRound}/>
                    )}
                </div>
            </div>
        );
    });
}