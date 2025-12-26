import {NewsList} from "@/components/news";
import {Separator} from "@/components/ui/separator";
import {getTranslations} from "next-intl/server";
import {getPaged} from "@/lib/news";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {DataEmpty} from "@/components/data-empty";

export default async function HomePage() {
    const t = await getTranslations();
    const page = await getPaged({first: 6});
    const initialItems = page.edges.map(e => e.node);
    const hasNews = initialItems.length > 0;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl"/>
                <div className="bg-muted/50 aspect-video rounded-xl"/>
                <div className="bg-muted/50 aspect-video rounded-xl"/>
            </div>
            <div className="space-y-1 mt-4">
                <Separator className="my-4"/>
                <h2 className="text-2xl text-center font-semibold tracking-tight">
                    {t("Home.latestNews")}
                </h2>
            </div>
            {hasNews && (
                <>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <NewsList
                            initialItems={initialItems}
                            maxItems={6}
                        />
                    </div>
                    <div className="flex justify-center mt-4">
                        <Link
                            href="/news"
                            className={buttonVariants({variant: "outline", size: "sm"})}
                        >
                            {t("Home.showAllNews")}
                        </Link>
                    </div>
                </>
            )}
            {!hasNews && (
                <div className="mt-8">
                    <DataEmpty/>
                </div>
            )}
        </div>
    );
}
