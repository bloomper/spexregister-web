import {getPaged} from "@/lib/task";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {TaskTable} from "@/components/task";
import {withPolicyPage} from "@/utils/route.server";
import {getAll as getAllCategories} from "@/lib/task/category";

export default async function TaskManagePage() {
    return withPolicyPage(Policies.task.requireUpdate, async () => {
        const defaultPageSize = 15;
        const [initialData, categories] = await Promise.all([
            getPaged({
                first: defaultPageSize,
                full: true
            }),
            getAllCategories()
        ]);
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Task.heading")}</h2>
                </div>
                <TaskTable
                    initialData={initialData}
                    categories={categories}
                />
            </div>
        );
    });
}
