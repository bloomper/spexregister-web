import {getPaged} from "@/lib/task/category";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {TaskCategoryTable} from "@/components/task/category";
import {withPolicyPage} from "@/utils/route.server";

export default async function TaskCategoryManagePage() {
    return withPolicyPage(Policies.taskCategory.requireUpdate, async () => {
        const defaultPageSize = 15;
        const initialData = await getPaged({
            first: defaultPageSize,
            full: true
        });
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Task.Category.heading")}</h2>
                </div>
                <TaskCategoryTable
                    initialData={initialData}
                />
            </div>
        );
    });
}
