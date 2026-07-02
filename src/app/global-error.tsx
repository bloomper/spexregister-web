"use client";

import {useEffect} from "react";

export default function GlobalError({error, reset}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    const buttonStyle: React.CSSProperties = {
        padding: "0.5rem 1rem",
        borderRadius: "0.5rem",
        border: "1px solid currentColor",
        background: "transparent",
        color: "inherit",
        font: "inherit",
        cursor: "pointer",
        textDecoration: "none",
    };

    return (
        <html lang="en" style={{colorScheme: "light dark"}}>
        <body
            style={{
                margin: 0,
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "system-ui, sans-serif",
                background: "Canvas",
                color: "CanvasText",
            }}
        >
        <div style={{maxWidth: "28rem", padding: "1.5rem", textAlign: "center"}}>
            <h1 style={{fontSize: "1.5rem", fontWeight: 600, margin: "0 0 0.5rem"}}>
                Something went wrong
            </h1>
            <p style={{fontSize: "0.875rem", opacity: 0.7, margin: "0 0 1.5rem"}}>
                An unexpected error occurred. Try again, or sign in to continue.
            </p>
            <div style={{display: "flex", gap: "0.5rem", justifyContent: "center"}}>
                <button type="button" onClick={() => reset()} style={buttonStyle}>
                    Try again
                </button>
                <a href="/api/auth/login" style={buttonStyle}>
                    Log in
                </a>
            </div>
        </div>
        </body>
        </html>
    );
}
