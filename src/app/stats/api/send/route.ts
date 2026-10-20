import {forwardedHeaders, umamiUrl} from "@/lib/umami.server";

export async function POST(request: Request) {
    const url = umamiUrl("/api/send");

    if (!url) {
        return new Response(null, {status: 404});
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: forwardedHeaders(request),
            body: await request.text(),
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
