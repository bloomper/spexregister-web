import {Suspense} from 'react';
import {getClient} from '@/lib/urql.server';
import {SpexPoster} from "@/components/spex-poster.client";

const SpexPagedQuery = `
    query GetSpexPaged {
        spexPaged(first: 10) {
            edges {
                node {
                    id
                    year
                    title
                    revival
                    posterUrl
                }
                cursor
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;

async function SpexList() {
    const result = await getClient().query(SpexPagedQuery, {}).toPromise();

    console.log('Query result:', {
        error: result.error,
        data: result.data,
        hasData: !!result.data,
    });

    if (result.error) {
        console.error('Full error:', result.error);
        return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h2 className="mb-2 text-lg font-semibold text-red-900">Error</h2>
                <p className="text-red-700">{result.error.message}</p>
                {result.error.networkError && (
                    <details className="mt-2">
                        <summary className="cursor-pointer text-sm">Network Error Details</summary>
                        <pre className="mt-2 text-xs">{JSON.stringify(result.error.networkError, null, 2)}</pre>
                    </details>
                )}
            </div>
        );
    }

    if (!result.data?.spexPaged?.edges) {
        return (
            <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-gray-600">No data available</p>
            </div>
        );
    }

    const {edges, pageInfo} = result.data.spexPaged;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Spex List</h2>
                <div className="text-sm text-gray-600">
                    Showing {edges.length} spex{' '}
                    {pageInfo.hasNextPage && '(more available)'}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {edges.map((edge: any) => {
                    if (!edge?.node) return null;
                    const spex = edge.node;

                    return (
                        <div
                            key={spex.id}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                        >
                            {spex.posterUrl && (
                                <div className="mb-3">
                                    <SpexPoster
                                        posterUrl={spex.posterUrl}
                                        title={spex.title}
                                        spexId={spex.id}
                                    />
                                </div>
                            )}
                            <h3 className="text-lg font-semibold">{spex.title}</h3>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                <span>Year: {spex.year}</span>
                                {spex.revival && (
                                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                        Revival
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {pageInfo.hasNextPage && (
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        More items available. (Client-side pagination coming soon)
                    </p>
                </div>
            )}
        </div>
    );
}

export default function SpexPage() {
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Spex Page</h1>
            <Suspense
                fallback={
                    <div className="flex items-center justify-center p-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"/>
                    </div>
                }
            >
                <SpexList/>
            </Suspense>
        </main>
    );
}