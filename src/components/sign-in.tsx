'use client';

import {signIn} from '@/lib/sign-in';

export default function SignIn() {
    return (
        <form action={signIn}>
            <button type="submit">Sign in</button>
        </form>
    );
}
