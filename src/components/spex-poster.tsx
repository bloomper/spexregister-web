'use client';

import { useState } from 'react';

interface SpexPosterProps {
    posterUrl: string;
    title: string;
    spexId: string;
}

export function SpexPoster({ posterUrl, title, spexId }: SpexPosterProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const proxyImageUrl = `/api/proxy-image?url=${encodeURIComponent(posterUrl)}`;

    return (
        <div className="relative h-48 w-full overflow-hidden rounded bg-gray-100">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm text-gray-500">Failed to load poster</p>
                </div>
            )}

            {!error && (
                <img
                    src={proxyImageUrl}
                    alt={`${title} poster`}
                    className="h-full w-full object-cover"
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setError(true);
                    }}
                />
            )}
        </div>
    );
}