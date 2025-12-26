import {getPaged} from "@/lib/spex";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {SpexTable} from "@/components/spex";
import {withPolicyPage} from "@/utils/route.server";

export default async function SpexManagePage() {
    return withPolicyPage(Policies.spex.requireUpdate, async () => {
        const defaultPageSize = 15;
        const initialData = await getPaged({
            first: defaultPageSize,
            filter: "parent:NULL",
            full: true
        });
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("Spex.heading")}</h2>
                </div>
                <SpexTable
                    initialData={initialData}
                />
            </div>
        );
    });
}
