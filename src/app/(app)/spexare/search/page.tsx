import {getMine, search} from "@/lib/spexare";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {getLocale} from "next-intl/server";
import {SpexareGrid} from "@/components/spexare";
import {isAdminOrEditor} from "@/utils/auth";
import {parseFacetParams, toAggregationFilters} from "@/utils/utils";
import {getCountries, getTypes} from "@/lib/settings";
import {getAll as getAllTags} from "@/lib/tag";
import {getAll as getAllTasks} from "@/lib/task";
import {getAll as getAllTaskCategories} from "@/lib/task/category";
import {getAll as getAllSpex} from "@/lib/spex";
import {getAll as getAllSpexCategories} from "@/lib/spex/category";

export default async function SpexareSearchPage({
                                                    searchParams,
                                                }: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    return withPolicyPage(Policies.spexare.requireRead, async (authz) => {
        const isManager = isAdminOrEditor(authz.roles);
        const params = await searchParams;
        const q = typeof params.q === "string" ? params.q : "";
        const initialSelectedFacets = parseFacetParams(params);
        const locale = await getLocale();

        const [page, countries, types, tags, tasks, taskCategories, spex, spexCategories, mySpexare] = await Promise.all([
            search({q, first: 24, aggregationFilters: toAggregationFilters(initialSelectedFacets)}),
            getCountries(locale),
            getTypes(locale),
            getAllTags(),
            getAllTasks(),
            getAllTaskCategories(),
            getAllSpex(),
            getAllSpexCategories(),
            getMine(),
        ]);
        const initialItems = page.edges.map((e) => e.node);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Always rendered, even with no hits: the grid owns the query and facet
                        controls, so swapping it for a bare empty state would strand the user
                        with no way to widen a search that matched nothing. */}
                    <SpexareGrid
                        countries={countries}
                        types={types}
                        tags={tags}
                        tasks={tasks}
                        taskCategories={taskCategories}
                        spex={spex}
                        spexCategories={spexCategories}
                        initialItems={initialItems}
                        initialPageInfo={page.pageInfo}
                        initialSearchQuery={q}
                        mode="search"
                        facets={page.facets}
                        initialSelectedFacets={initialSelectedFacets}
                        currentSpexareId={mySpexare?.id ?? null}
                        canManage={isManager}
                    />
                </div>
            </div>
        );
    });
}