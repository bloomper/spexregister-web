import Script from "next/script";
import {connection} from "next/server";

// Query strings are dropped: searches and filters may hold names and personnummer
export async function Umami() {
    await connection();

    const websiteId = process.env.UMAMI_WEBSITE_ID;

    if (!process.env.UMAMI_URL || !websiteId) {
        return null;
    }

    return (
        <Script
            src="/stats/script.js"
            data-website-id={websiteId}
            data-exclude-search="true"
            data-do-not-track="true"
            data-performance="true"
            data-fetch-credentials="same-origin"
            strategy="afterInteractive"
        />
    );
}
