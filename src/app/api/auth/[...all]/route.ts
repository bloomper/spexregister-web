import {auth} from "@/auth";
import {toNextJsHandler} from "better-auth/next-js";

/**
 * Better Auth's own endpoints, such as the Keycloak callback.
 */
export const {GET, POST} = toNextJsHandler(auth);
