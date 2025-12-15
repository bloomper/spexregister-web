import {NewsList} from "@/components/news";
import {getNewsPaged} from "@/lib/news";

export default async function NewsPage() {
    const first = 24;

    const page = await getNewsPaged({first, after: null});
    const initialItems = page.edges.map((e) => e.node);

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <NewsList initialItems={initialItems} initialPageInfo={page.pageInfo}/>
            </div>
        </div>
    );
}