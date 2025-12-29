import {NextRequest, NextResponse} from 'next/server';
import axios from "@/lib/axios.server";
import {isAxiosError} from 'axios';

export async function GET(request: NextRequest) {
    const imageUrl = request.nextUrl.searchParams.get('url');
    const ifModifiedSince = request.headers.get('If-Modified-Since');

    if (!imageUrl) {
        return NextResponse.json({error: 'Image URL is required'}, {status: 400});
    }

    try {
        const fullImageUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `${process.env.API_REST_BASE_URL}${imageUrl}`;

        const response = await axios.get(fullImageUrl, {
            responseType: 'arraybuffer',
            headers: ifModifiedSince ? {'If-Modified-Since': ifModifiedSince} : {},
            validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
        });

        if (response.status === 304) {
            return new NextResponse(null, {status: 304});
        }

        const imageBuffer = response.data;
        const contentType = response.headers['content-type'] || 'image/jpeg';
        const lastModified = response.headers['last-modified'];

        const responseHeaders: Record<string, string> = {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
        };

        if (lastModified) {
            responseHeaders['Last-Modified'] = lastModified;
        }

        return new NextResponse(imageBuffer, {
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Error proxying image download:', error);

        if (isAxiosError(error) && error.response) {
            return NextResponse.json(
                {error: 'Failed to fetch image'},
                {status: error.response.status}
            );
        }

        return NextResponse.json({error: 'Failed to proxy download'}, {status: 500});
    }
}