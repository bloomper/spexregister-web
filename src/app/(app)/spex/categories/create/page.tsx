import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {SpexCategoryTable} from "@/components/spex/category";
import {withPolicyPage} from "@/utils/route.server";
import {SpexCategoryCreateForm} from "./create.client";
import {getPaged} from "@/lib/spex/category";

export default async function SpexCategoryCreatePage() {
    return withPolicyPage(Policies.spexCategory.requireCreate, async () => {
        const defaultPageSize = 15;
        const initialData = await getPaged({
            first: defaultPageSize,
            full: true
        });
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Spex.Category.heading")}</h2>
                </div>
                <SpexCategoryTable
                    initialData={initialData}
                />
                <SpexCategoryCreateForm/>
            </div>
        );
    });
}
