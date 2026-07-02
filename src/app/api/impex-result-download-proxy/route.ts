import {NextRequest, NextResponse} from "next/server";
import axios from "@/lib/axios.server";
import {isAxiosError} from "axios";

export async function GET(request: NextRequest) {
    const jobId = request.nextUrl.searchParams.get("id");

    if (!jobId) {
        return NextResponse.json({error: "Job ID is required"}, {status: 400});
    }

    try {
        const url = `${process.env.API_REST_BASE_URL}/api/jobs/${jobId}/results`;

        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });

        const buffer = response.data;
        const contentType = (response.headers["content-type"] as string | undefined) || "application/octet-stream";
        const contentDisposition =
            (response.headers["content-disposition"] as string | undefined) || `attachment; filename="result-${jobId}"`;

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": contentDisposition,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Error proxying impex result download:", error);
        if (isAxiosError(error) && error.response) {
            return NextResponse.json({error: "Failed to fetch impex result"}, {status: error.response.status});
        }
        return NextResponse.json({error: "Failed to proxy download"}, {status: 500});
    }
}
