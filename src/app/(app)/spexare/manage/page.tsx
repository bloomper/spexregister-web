import {getMine, getPaged} from "@/lib/spexare";
import {Policies} from "@/utils/policy.server";
import {getLocale, getTranslations} from "next-intl/server";
import {SpexareTable} from "@/components/spexare";
import {withPolicyPage} from "@/utils/route.server";
import {getCountries, getTypes} from "@/lib/settings";
import {getAll as getAllTags} from "@/lib/tag";
import {getAll as getAllTasks} from "@/lib/task";
import {getAll as getAllTaskCategories} from "@/lib/task/category";
import {getAll as getAllSpex} from "@/lib/spex";
import {getAll as getAllSpexCategories} from "@/lib/spex/category";
import {Page, PageHeader} from "@bloomper/fgv-web-ui/shell/page-header";

/**
 * All spexare, published or not, as a table for those who may change them.
 */
export default async function SpexareManagePage() {
    const locale = await getLocale();

    return withPolicyPage(Policies.spexare.requireUpdate, async () => {
        const defaultPageSize = 15;
        const [initialData, types, countries, tags, tasks, taskCategories, spex, spexCategories, mySpexare, t, canDelete] = await Promise.all([
            getPaged({
                first: defaultPageSize,
                filter: "(published:TRUE OR published:FALSE)",
                full: false
            }),
            getTypes(locale),
            getCountries(locale),
            getAllTags(),
            getAllTasks(),
            getAllTaskCategories(),
            getAllSpex(),
            getAllSpexCategories(),
            getMine(),
            getTranslations(),
            Policies.spexare.requireDelete()
        ]);

        return (
            <Page>
                <PageHeader title={t("Spexare.heading")}/>
                <SpexareTable
                    types={types}
                    countries={countries}
                    tags={tags}
                    tasks={tasks}
                    taskCategories={taskCategories}
                    spex={spex}
                    spexCategories={spexCategories}
                    initialData={initialData}
                    currentSpexareId={mySpexare?.id ?? null}
                    canDelete={canDelete.ok}
                />
            </Page>
        );
    });
}
