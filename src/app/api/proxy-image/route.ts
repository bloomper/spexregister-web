import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
    const session = await auth();

    const imageUrl = request.nextUrl.searchParams.get('url');

    if (!imageUrl) {
        return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    try {
        const fullImageUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `${process.env.API_REST_BASE_URL}${imageUrl}`;

        console.log('Fetching image:', fullImageUrl);

        const response = await fetch(fullImageUrl, {
            headers: {
                Authorization: session?.accessToken ? `Bearer ${session.accessToken}` : '',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch image' },
                { status: response.status }
            );
        }

        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error proxying image:', error);
        return NextResponse.json({ error: 'Failed to proxy image' }, { status: 500 });
    }
}