"use client";

import type {ReactNode} from "react";
import {ClientSideOptionsProvider} from "@c15t/nextjs/client";


export function ConsentManagerClient({children}: {
    children: ReactNode;
}) {
    return (
        <ClientSideOptionsProvider
            scripts={[]}
            callbacks={{}}
        >
            {children}
        </ClientSideOptionsProvider>
    );
}
