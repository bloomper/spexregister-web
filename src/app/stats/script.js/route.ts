import {connection} from "next/server";
import {umamiUrl} from "@/lib/umami.server";

export async function GET() {
    await connection();

    const url = umamiUrl("/script.js");

    if (!url) {
        return new Response(null, {status: 404});
    }

    try {
        const response = await fetch(url, {cache: "no-store"});

        if (!response.ok) {
            return new Response(null, {status: 502});
        }

        return new Response(await response.text(), {
            headers: {
                "Content-Type": "application/javascript; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
            },
        });
    } catch (error) {
        console.error("Error proxying Umami script:", error);

        return new Response(null, {status: 502});
    }
}
