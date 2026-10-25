import {forwardedHeaders, umamiUrl} from "@/lib/umami.server";

// An Umami event is well under a kilobyte; anyone may post here, so nothing larger is forwarded
const MAX_BODY = 16 * 1024;

export async function POST(request: Request) {
    const url = umamiUrl("/api/send");

    if (!url) {
        return new Response(null, {status: 404});
    }
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY) {
        return new Response(null, {status: 413});
    }

    const body = await request.text();

    if (body.length > MAX_BODY) {
        return new Response(null, {status: 413});
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: forwardedHeaders(request),
            body,
            cache: "no-store",
        });

        return new Response(await response.text(), {
            status: response.status,
            headers: {"Content-Type": response.headers.get("content-type") ?? "application/json"},
        });
    } catch (error) {
        console.error("Error proxying Umami event:", error);

        return new Response(null, {status: 502});
    }
}
