import {NextResponse} from "next/server";
import {Policies} from "@/utils/policy.server";
import {withPolicy} from "@/utils/route.server";
import {getNewsPaged} from "@/lib/news";

export const GET = withPolicy(Policies.news.requireRead, async (request, _ctx, _authz) => {
    const url = new URL(request.url);
    const first = Math.min(Math.max(Number(url.searchParams.get('first') ?? 10) || 10, 1), 50);
    const after = url.searchParams.get('after');

    try {
        const page = await getNewsPaged({first, after: after || null});

        return NextResponse.json({
            edges: page.edges,
            pageInfo: page.pageInfo,
        });
    } catch (err: any) {
        console.error("GET /api/news failed", {message: err?.message ?? String(err)});
        return NextResponse.json({error: "Failed to load news"}, {status: 500});
    }
});