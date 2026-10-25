import "server-only";

const CLIENT_IP_HEADERS = ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"];

/**
 * The address of a path on the Umami analytics server, or null when Umami is not configured.
 */
export function umamiUrl(path: string) {
    const base = process.env.UMAMI_URL;

    return base ? `${base.replace(/\/$/, "")}${path}` : null;
}

/**
 * The headers to pass on to Umami: the ones it reads, and the client's address from the first proxy header that has it.
 */
export function forwardedHeaders(request: Request) {
    const headers = new Headers();

    for (const name of ["content-type", "user-agent", "accept-language", "x-umami-cache"]) {
        const value = request.headers.get(name);

        if (value) {
            headers.set(name, value);
        }
    }

    const clientIp = CLIENT_IP_HEADERS.map(name => request.headers.get(name)).find(Boolean);

    if (clientIp) {
        headers.set("x-forwarded-for", clientIp);
    }

    return headers;
}
