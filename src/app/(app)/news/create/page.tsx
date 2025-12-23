import {getNewsPaged} from "@/lib/news";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {NewsTable} from "@/components/news";
import {withPolicyPage} from "@/utils/route.server";
import {NewsCreateForm} from "@/app/(app)/news/create/create.client";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Plus} from "lucide-react";

export default async function NewsCreatePage() {
    return withPolicyPage(Policies.news.requireCreate, async () => {
        const defaultPageSize = 15;
        const initialData = await getNewsPaged({first: defaultPageSize, full: true});
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("News.title")}</h2>
                    <Button asChild size="sm">
                        <Link href="/news/create">
                            <Plus className="mr-1 h-4 w-4" />
                            {t("News.createTitle")}
                        </Link>
                    </Button>
                </div>
                <NewsTable initialData={initialData}/>
                <NewsCreateForm/>
            </div>
        );
    });
}
