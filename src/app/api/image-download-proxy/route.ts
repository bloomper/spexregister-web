import {NextRequest, NextResponse} from "next/server";
import axios from "@/lib/axios.server";
import {isAxiosError} from "axios";
import {resolveBackendUrl} from "@/utils/utils.server";

const IMAGE_CONTENT_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);

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

        // The backend echoes whatever type was stored with the file; anything but a raster image
        // (text/html, image/svg+xml) would execute on this origin.
        if (!IMAGE_CONTENT_TYPES.has(contentType)) {
            return NextResponse.json({error: "Unsupported image type"}, {status: 415});
        }

        const lastModified = response.headers["last-modified"] as string | undefined;

        const responseHeaders: Record<string, string> = {
            "Content-Type": contentType,
            "Content-Security-Policy": "default-src 'none'; sandbox",
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
