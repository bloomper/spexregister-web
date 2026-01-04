"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function AuthCheck({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.error === "RefreshTokenError") {
            signOut({ callbackUrl: "/" });
        }
    }, [session]);

    return <>{children}</>;
}