import {getPaged} from "@/lib/spexare";
import {Policies} from "@/utils/policy.server";
import {getLocale, getTranslations} from "next-intl/server";
import {SpexareTable} from "@/components/spexare";
import {withPolicyPage} from "@/utils/route.server";
import {SpexareCreateForm} from "./create.client";
import {getCountries, getTypes} from "@/lib/settings";
import {getAll as getAllTags} from "@/lib/tag";
import {getAll as getAllTasks} from "@/lib/task";
import {getAll as getAllTaskCategories} from "@/lib/task/category";
import {getAll as getAllSpex} from "@/lib/spex";
import {getAll as getAllSpexCategories} from "@/lib/spex/category";
import {me} from "@/lib/user";

export default async function SpexareCreatePage() {
    return withPolicyPage(Policies.spexare.requireCreate, async () => {
        const defaultPageSize = 15;
        const locale = await getLocale();

        const [initialData, types, countries, tags, tasks, taskCategories, spex, spexCategories, currentUser, t] = await Promise.all([
            getPaged({
                first: defaultPageSize,
                filter: "(published:TRUE OR published:FALSE)",
                full: true
            }),
            getTypes(locale),
            getCountries(locale),
            getAllTags(),
            getAllTasks(),
            getAllTaskCategories(),
            getAllSpex(),
            getAllSpexCategories(),
            me(),
            getTranslations()
        ]);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Spexare.heading")}</h2>
                </div>
                <SpexareTable
                    types={types}
                    countries={countries}
                    tags={tags}
                    tasks={tasks}
                    taskCategories={taskCategories}
                    spex={spex}
                    spexCategories={spexCategories}
                    initialData={initialData}
                    currentSpexareId={currentUser?.spexare?.id ?? null}
                />
                <SpexareCreateForm
                    types={types}
                    countries={countries}
                    tags={tags}
                    tasks={tasks}
                    taskCategories={taskCategories}
                    spex={spex}
                    spexCategories={spexCategories}
                />
            </div>
        );
    });
}
