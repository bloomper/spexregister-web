import {NextRequest, NextResponse} from 'next/server';
import axios from "@/lib/axios.server";
import {isAxiosError} from 'axios';

export async function GET(request: NextRequest) {
    const imageUrl = request.nextUrl.searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({error: 'Image URL is required'}, {status: 400});
    }

    try {
        const fullImageUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `${process.env.API_REST_BASE_URL}${imageUrl}`;

        const response = await axios.get(fullImageUrl, {
            responseType: 'arraybuffer',
        });

        const imageBuffer = response.data;
        const contentType = response.headers['content-type'] || 'image/jpeg';

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
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