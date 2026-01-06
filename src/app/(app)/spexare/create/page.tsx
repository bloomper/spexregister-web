import {getPaged} from "@/lib/spexare";
import {Policies} from "@/utils/policy.server";
import {getLocale, getTranslations} from "next-intl/server";
import {SpexareTable} from "@/components/spexare";
import {withPolicyPage} from "@/utils/route.server";
import {SpexareCreateForm} from "./create.client";
import {getTypes} from "@/lib/settings";
import {getAll as getAllTags} from "@/lib/tag";

export default async function SpexareCreatePage() {
    return withPolicyPage(Policies.spexare.requireCreate, async () => {
        const defaultPageSize = 15;

        const [initialData, types, tags, t] = await Promise.all([
            getPaged({
                first: defaultPageSize,
                filter: "(published:TRUE OR published:FALSE)",
                full: true
            }),
            getLocale().then(locale => getTypes(locale)),
            getAllTags(),
            getTranslations()
        ]);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Spexare.heading")}</h2>
                </div>
                <SpexareTable
                    types={types}
                    tags={tags}
                    initialData={initialData}
                />
                <SpexareCreateForm
                    types={types}
                    tags={tags}
                />
            </div>
        );
    });
}
