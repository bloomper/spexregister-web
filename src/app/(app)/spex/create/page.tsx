import {getPaged} from "@/lib/spex";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {SpexTable} from "@/components/spex";
import {withPolicyPage} from "@/utils/route.server";
import {SpexCreateForm} from "./create.client";
import {getAll as getAllCategories} from "@/lib/spex/category";

/**
 * For administrators: the spex table with the form to add a spex.
 */
export default async function SpexCreatePage() {
    return withPolicyPage(Policies.spex.requireCreate, async () => {
        const defaultPageSize = 15;
        const [initialData, categories, canDelete] = await Promise.all([
            getPaged({
                first: defaultPageSize,
                filter: "parent:NULL",
                full: true
            }),
            getAllCategories(),
            Policies.spex.requireDelete()
        ]);
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Spex.heading")}</h2>
                </div>
                <SpexTable
                    initialData={initialData}
                    categories={categories}
                    canDelete={canDelete.ok}
                />
                <SpexCreateForm
                    categories={categories}
                />
            </div>
        );
    });
}
