import {signOut} from '@/auth';

export const GET = async (req: Request) => {
    return await signOut({
        redirect: true,
        redirectTo: process.env.AUTH_URL,
    });
};
