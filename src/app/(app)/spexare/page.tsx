import {SpexareGrid} from "@/components/spexare";
import {getPaged} from "@/lib/spexare";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {UserRound} from "lucide-react";
import {getCountries, getTypes} from "@/lib/settings";
import {getLocale} from "next-intl/server";
import {me} from "@/lib/user";
import {auth} from "@/auth";
import {isAdminOrEditor} from "@/utils/auth";
import {getAll as getAllTags} from "@/lib/tag";
import {getAll as getAllTasks} from "@/lib/task";
import {getAll as getAllTaskCategories} from "@/lib/task/category";
import {getAll as getAllSpex} from "@/lib/spex";
import {getAll as getAllSpexCategories} from "@/lib/spex/category";

export default async function SpexarePage() {
    return withPolicyPage(Policies.spexare.requireRead, async () => {
        const session = await auth();
        const roles = session?.roles || [];
        const canUpdate = isAdminOrEditor(roles);
        const locale = await getLocale();

        const [page, countries, types, tags, tasks, taskCategories, spex, spexCategories, currentUser] = await Promise.all([
            getPaged({first: 24, after: null}),
            getCountries(locale),
            getTypes(locale),
            getAllTags(),
            getAllTasks(),
            getAllTaskCategories(),
            getAllSpex(),
            getAllSpexCategories(),
            me(),
        ]);
        const initialItems = page.items;

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
                            currentSpexareId={currentUser?.spexare?.id ?? null}
                            canManage={canUpdate}
                        />
                    ) : (
                        <DataEmpty icon={UserRound}/>
                    )}
                </div>
            </div>
        );
    });
}
