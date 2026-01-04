import {getPaged} from "@/lib/tag";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {TagTable} from "@/components/tag";
import {withPolicyPage} from "@/utils/route.server";

export default async function TagManagePage() {
    return withPolicyPage(Policies.tag.requireUpdate, async () => {
        const defaultPageSize = 15;
        const initialData = await getPaged({
            first: defaultPageSize,
            full: true
        });
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Tag.heading")}</h2>
                </div>
                <TagTable
                    initialData={initialData}
                />
            </div>
        );
    });
}
