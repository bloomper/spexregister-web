import {NewsList} from "@/components/news";
import {Separator} from "@/components/ui/separator";
import {getTranslations} from "next-intl/server";
import {getNewsPaged} from "@/lib/news";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";

export default async function HomePage() {
    const t = await getTranslations();
    const page = await getNewsPaged({ first: 6 });
    const initialItems = page.edges.map(e => e.node);

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
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <NewsList
                    initialItems={initialItems}
                    maxItems={6}
                />
            </div>
            <div className="flex justify-center mt-4">
                <Link
                    href="/news"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                    {t("Home.showAllNews") || "Show all news"}
                </Link>
            </div>
        </div>
    );
}
