import {search} from "@/lib/spexare";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {UserRound} from "lucide-react";
import {getLocale} from "next-intl/server";
import {SpexareGrid} from "@/components/spexare";
import {DataEmpty} from "@/components/data-empty";
import {me} from "@/lib/user";
import {auth} from '@/auth';
import {isAdminOrEditor} from "@/utils/auth";
import {getCountries, getTypes} from "@/lib/settings";
import {getAll as getAllTags} from "@/lib/tag";
import {getAll as getAllTasks} from "@/lib/task";
import {getAll as getAllTaskCategories} from "@/lib/task/category";
import {getAll as getAllSpex} from "@/lib/spex";
import {getAll as getAllSpexCategories} from "@/lib/spex/category";

export default async function SpexareSearchPage({
                                                    searchParams,
                                                }: {
    searchParams: Promise<{ q?: string }>;
}) {
    return withPolicyPage(Policies.spexare.requireRead, async () => {
        const session = await auth();
        const roles = session?.roles || [];
        const isManager = isAdminOrEditor(roles);
        const {q = ""} = await searchParams;
        const locale = await getLocale();

        const [page, countries, types, tags, tasks, taskCategories, spex, spexCategories, currentUser] = await Promise.all([
            search({q}),
            getCountries(locale),
            getTypes(locale),
            getAllTags(),
            getAllTasks(),
            getAllTaskCategories(),
            getAllSpex(),
            getAllSpexCategories(),
            me(),
        ]);
        const initialItems = page.edges.map((e) => e.node);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
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
                            currentSpexareId={currentUser?.spexare?.id ?? null}
                            canManage={isManager}
                        />
                    ) : (
                        <DataEmpty icon={UserRound}/>
                    )}
                </div>
            </div>
        );
    });
}