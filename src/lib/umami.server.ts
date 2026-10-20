import "server-only";

const CLIENT_IP_HEADERS = ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"];

export function umamiUrl(path: string) {
    const base = process.env.UMAMI_URL;

    return base ? `${base.replace(/\/$/, "")}${path}` : null;
}

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
