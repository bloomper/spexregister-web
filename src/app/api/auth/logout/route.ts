import {signOut} from '@/auth';

export const GET = async (req: Request) => {
    await signOut({
        redirect: true,
        redirectTo: process.env.AUTH_URL,
    });
};
