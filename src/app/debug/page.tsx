import { auth } from '@/auth';

export default async function DebugPage() {
    const session = await auth();

    if (!session) {
        return <div>Not authenticated</div>;
    }

    const accessToken = session.accessToken as string;
    const parts = accessToken?.split('.');
    const decodedToken = parts?.[1]
        ? JSON.parse(Buffer.from(parts[1], 'base64').toString())
        : null;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Token Claims</h1>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(decodedToken, null, 2)}
            </pre>
        </div>
    );
}