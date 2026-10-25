import {NextRequest, NextResponse} from "next/server";
import axios from "@/lib/axios.server";
import {isAxiosError} from "axios";
import {resolveBackendUrl} from "@/utils/utils.server";

const SVG_CONTENT_TYPE = "image/svg+xml";
const IMAGE_CONTENT_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp", SVG_CONTENT_TYPE]);

/**
 * Fetches an image from the API with the user's token, so the browser can show it. Only addresses under the API's
 * `/api/` and image types are passed on, with a sandboxing content security policy. With a `t` parameter the image is
 * cached for good, as the parameter changes with the image.
 */
export async function GET(request: NextRequest) {
    const imageUrl = request.nextUrl.searchParams.get("url");
    const versioned = request.nextUrl.searchParams.has("t");
    const ifModifiedSince = request.headers.get("If-Modified-Since");

    if (!imageUrl) {
        return NextResponse.json({error: "Image URL is required"}, {status: 400});
    }

    const target = resolveBackendUrl(imageUrl, process.env.API_REST_BASE_URL);

    if (!target) {
        return NextResponse.json({error: "Image URL is not allowed"}, {status: 400});
    }

    try {
        const response = await axios.get(target.toString(), {
            responseType: "arraybuffer",
            maxRedirects: 0,
            headers: ifModifiedSince ? {"If-Modified-Since": ifModifiedSince} : {},
            validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
        });

        if (response.status === 304) {
            return new NextResponse(null, {status: 304});
        }

        const contentType = ((response.headers["content-type"] as string | undefined) ?? "")
            .split(";")[0]
            .trim()
            .toLowerCase();

        if (!IMAGE_CONTENT_TYPES.has(contentType)) {
            return NextResponse.json({error: "Unsupported image type"}, {status: 415});
        }

        const lastModified = response.headers["last-modified"] as string | undefined;

        const responseHeaders: Record<string, string> = {
            "Content-Type": contentType,
            "Content-Security-Policy": contentType === SVG_CONTENT_TYPE
                ? "default-src 'none'; style-src 'unsafe-inline'; sandbox"
                : "default-src 'none'; sandbox",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": versioned ? "private, max-age=31536000, immutable" : "private, no-cache",
        };

        if (lastModified) {
            responseHeaders["Last-Modified"] = lastModified;
        }

        return new NextResponse(response.data, {
            headers: responseHeaders,
        });
    } catch (error) {
        console.error("Error proxying image download:", error);

        if (isAxiosError(error) && error.response) {
            return NextResponse.json(
                {error: "Failed to fetch image"},
                {status: error.response.status}
            );
        }

        return NextResponse.json({error: "Failed to proxy download"}, {status: 500});
    }
}
