import {createAuthClient} from "better-auth/react";

/**
 * The Better Auth client of the browser.
 */
export const authClient = createAuthClient();

export const {useSession, signOut} = authClient;
