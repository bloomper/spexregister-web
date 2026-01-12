import {TaskGrid} from "@/components/task";
import {getPaged} from "@/lib/task";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {getAll as getAllCategories} from "@/lib/task/category";
import {ClipboardList} from "lucide-react";

export default async function TaskPage() {
    return withPolicyPage(Policies.task.requireRead, async () => {
        const [page, categories, canUpdate] = await Promise.all([
            getPaged({first: 24, after: null}),
            getAllCategories(),
            Policies.task.requireUpdate(),
        ]);

        const initialItems = page.items;

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
                        <TaskGrid
                            initialItems={initialItems}
                            initialPageInfo={page.pageInfo}
                            categories={categories}
                            canUpdate={canUpdate.ok}
                        />
                    ) : (
                        <DataEmpty icon={ClipboardList}/>
                    )}
                </div>
            </div>
        );
    });
}
