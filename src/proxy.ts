import {type NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";

const AUTH_BASE_PATH = "/api/auth";
const ACCOUNT_COOKIE = "account_data";

export async function proxy(request: NextRequest) {
    const response = NextResponse.next();

    const {pathname} = request.nextUrl;

    if (pathname === AUTH_BASE_PATH || pathname.startsWith(`${AUTH_BASE_PATH}/`)) {
        return response;
    }

    if (request.headers.get("next-router-prefetch") === "1") {
        return response;
    }

    const hasAccountCookie = request.cookies
        .getAll()
        .some(({name}) => name.includes(ACCOUNT_COOKIE));

    if (!hasAccountCookie) {
        return response;
    }

    try {
        const {headers} = await auth.api.getAccessToken({
            body: {useAccountCookie: true},
            headers: request.headers,
            returnHeaders: true,
        });
        const setCookies = headers.getSetCookie();

        if (setCookies.length === 0) {
            return response;
        }

        for (const setCookie of setCookies) {
            applySetCookie(request, setCookie);
        }

        const refreshed = NextResponse.next({request: {headers: request.headers}});

        for (const setCookie of setCookies) {
            refreshed.headers.append("set-cookie", setCookie);
        }

        return refreshed;
    } catch {
    }

    return response;
}

function applySetCookie(request: NextRequest, setCookie: string) {
    const [pair, ...attributes] = setCookie.split(";").map(part => part.trim());
    const separator = pair.indexOf("=");
    const name = pair.slice(0, separator);
    const value = pair.slice(separator + 1);
    const expired = value === "" || attributes.some(attribute => {
        const [key, attributeValue = ""] = attribute.split("=");

        return (key.toLowerCase() === "max-age" && Number(attributeValue) <= 0)
            || (key.toLowerCase() === "expires" && Date.parse(attributeValue) <= Date.now());
    });

    if (expired) {
        request.cookies.delete(name);
    } else {
        request.cookies.set(name, value);
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|static/).*)"],
};
