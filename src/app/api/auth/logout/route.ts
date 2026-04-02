import {signOut} from '@/auth';

export const GET = async () => {
    return await signOut({
        redirect: true,
        redirectTo: process.env.NEXT_PUBLIC_AUTH_URL,
    });
};
