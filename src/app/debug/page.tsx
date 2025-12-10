import { auth } from '@/auth';
import {jwtDecode} from "jwt-decode";

export default async function DebugPage() {
    const session = await auth();

    if (!session) {
        return <div>Not authenticated</div>;
    }

    const accessToken = session.access_token as string;
    const decodedToken = jwtDecode(accessToken);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Decoded token</h1>
            <pre className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(decodedToken, null, 2)}
            </pre>
        </div>
    );
}