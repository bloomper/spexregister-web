'use client';

import {signIn} from '@/lib/sign-in.server';

export default function SignIn() {
    return (
        <form action={signIn}>
            <button type="submit">Sign in</button>
        </form>
    );
}
