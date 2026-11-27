import "server-only";

import { jwtDecode } from "jwt-decode";
import { getSessionContext } from "@/utils/auth.server";
import { type Application, resolveApplications } from "@bloomper/fgv-web-ui/shell/applications";
import type { AccessTokenClaims } from "@/types/auth";

/**
 * The applications the signed-in user can switch to from Spexregister. The addresses are read from the environment
 * at request time, so one image serves every environment; without a session only Spexregister itself is listed.
 */
export async function getApplications(): Promise<Application[]> {
  const { accessToken } = await getSessionContext();
  const claims = accessToken ? jwtDecode<AccessTokenClaims>(accessToken) : {};

  return resolveApplications("spexregister", claims, process.env);
}

/**
 * Spexipedia, where spex, revivals, categories and tasks are kept: its address, and whether the user may change base
 * data there (EDITOR on fgv-spexipedia, which Spexregister's tokens carry). Null when Spexipedia's address is not set.
 */
export async function getSpexipedia(): Promise<{ url: string; canEdit: boolean } | null> {
  const url = process.env.SPEXIPEDIA_WEB_URL?.trim().replace(/\/+$/, "");

  if (!url) {
    return null;
  }

  const { accessToken } = await getSessionContext();
  const claims = accessToken ? jwtDecode<AccessTokenClaims>(accessToken) : {};
  const roles = claims.resource_access?.["fgv-spexipedia"]?.roles ?? [];

  return { url, canEdit: roles.includes("EDITOR") || roles.includes("ADMIN") };
}

/**
 * Medlemskap, where FGV memberships are kept: its address, and whether the user may manage members there (BOARD on
 * fgv-membership, which Spexregister's tokens carry). Null when Medlemskap's address is not set.
 */
export async function getMedlemskap(): Promise<{ url: string; canManage: boolean } | null> {
  const url = process.env.MEMBERSHIP_WEB_URL?.trim().replace(/\/+$/, "");

  if (!url) {
    return null;
  }

  const { accessToken } = await getSessionContext();
  const claims = accessToken ? jwtDecode<AccessTokenClaims>(accessToken) : {};
  const roles = claims.resource_access?.["fgv-membership"]?.roles ?? [];

  return { url, canManage: roles.includes("BOARD") || roles.includes("TREASURER") || roles.includes("ADMIN") };
}
