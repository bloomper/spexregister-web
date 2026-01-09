import {me} from "@/lib/user";
import {getLocale, getTranslations} from "next-intl/server";
import {getCountries, getTypes} from "@/lib/settings";
import {getAll as getAllTags} from "@/lib/tag";
import {getAll as getAllTasks} from "@/lib/task";
import {getAll as getAllTaskCategories} from "@/lib/task/category";
import {getAll as getAllSpex} from "@/lib/spex";
import {getAll as getAllSpexCategories} from "@/lib/spex/category";
import {SpexareForm} from "@/components/spexare/spexare-form.client";
import {redirect} from "next/navigation";
import {revalidateTag} from "next/cache";

export default async function MyProfilePage() {
    const user = await me();
    const item = user?.spexare;

    if (!item) {
        redirect("/");
    }

    const locale = await getLocale();
    const [types, countries, tags, tasks, taskCategories, spex, spexCategories, t] = await Promise.all([
        getTypes(locale),
        getCountries(locale),
        getAllTags(),
        getAllTasks(),
        getAllTaskCategories(),
        getAllSpex(),
        getAllSpexCategories(),
        getTranslations()
    ]);

    async function handleSuccess() {
        "use server";
        revalidateTag('me', 'max');
        redirect("/");
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 max-w-6xl mx-auto w-full">
            <div className="flex flex-col gap-1 mb-4">
                <h2 className="text-2xl font-bold tracking-tight">{t("Common.myProfile")}</h2>
            </div>
            <SpexareForm
                mode="page"
                item={item}
                types={types}
                countries={countries}
                tags={tags}
                tasks={tasks}
                taskCategories={taskCategories}
                spex={spex}
                spexCategories={spexCategories}
                onSuccess={handleSuccess}
            />
        </div>
    );
}