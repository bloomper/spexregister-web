import {NextResponse} from "next/server";
import {Policies} from "@/utils/policy.server";
import {withPolicy} from "@/utils/route.server";
import {getNewsPaged} from "@/lib/news";

export const GET = withPolicy(Policies.news.requireRead, async (request, _ctx, _authz) => {
    const { searchParams } = new URL(request.url);
    const first = searchParams.get("first") ? parseInt(searchParams.get("first")!) : undefined;
    const last = searchParams.get("last") ? parseInt(searchParams.get("last")!) : undefined;
    const after = searchParams.get("after");
    const before = searchParams.get("before");
    const full = searchParams.get("full") === "true"; // Check for the 'full' flag

    try {
        const data = await getNewsPaged({
            first,
            last,
            after,
            before,
            full
        });
        return NextResponse.json(data);
    } catch (err: any) {
        console.error("GET /api/news failed", {message: err?.message ?? String(err)});
        return NextResponse.json({error: "Failed to load news"}, {status: 500});
    }
});