import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as login } from "@/app/api/auth/login/route";
import { GET as loginError } from "@/app/api/auth/login-error/route";

const redirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`redirect:${url}`);
  })
);
const signInSocial = vi.hoisted(() => vi.fn());
const store = vi.hoisted(() => ({ has: vi.fn(), set: vi.fn() }));

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("next/headers", () => ({ cookies: async () => store }));
vi.mock("@/auth", () => ({ auth: { api: { signInSocial } } }));

const request = (path: string, cookie = "") =>
  new NextRequest(`https://app.test${path}`, { headers: cookie ? { cookie } : {} });

describe("logging in", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("sends the user to Keycloak in their language and theme", async () => {
    signInSocial.mockResolvedValue({ url: "https://auth.test/authorize" });

    await expect(login(request("/api/auth/login", "locale=en; theme=dark"))).rejects.toThrow(
      "redirect:https://auth.test/authorize"
    );
    expect(signInSocial.mock.calls[0][0].body.additionalParams).toEqual({ ui_locales: "en", theme: "dark" });
  });

  it("fails loudly when Keycloak gives no address", async () => {
    signInSocial.mockResolvedValue({ url: undefined });

    await expect(login(request("/api/auth/login"))).rejects.toThrow("Keycloak did not return an authorization URL");
  });

  it("retries a state mismatch once, then shows the error page", async () => {
    store.has.mockReturnValue(false);
    await expect(loginError(request("/api/auth/login-error?error=state_mismatch"))).rejects.toThrow(
      "redirect:/api/auth/login"
    );
    expect(store.set).toHaveBeenCalledWith("login_retry", "1", expect.objectContaining({ secure: true, maxAge: 60 }));

    store.has.mockReturnValue(true);
    await expect(loginError(request("/api/auth/login-error?error=state_mismatch"))).rejects.toThrow(
      "redirect:/login-error"
    );
    expect(store.set).toHaveBeenLastCalledWith("login_retry", "", { path: "/api/auth", maxAge: 0 });
  });

  it("shows the error page at once for other errors", async () => {
    store.has.mockReturnValue(false);

    await expect(loginError(request("/api/auth/login-error?error=access_denied"))).rejects.toThrow(
      "redirect:/login-error"
    );
  });
  it("asks Keycloak silently, once a minute, whether the user is logged in elsewhere", async () => {
    signInSocial.mockResolvedValue({ url: "https://auth.test/authorize" });

    await expect(login(request("/api/auth/login?silent=1", "locale=en"))).rejects.toThrow(
      "redirect:https://auth.test/authorize"
    );
    const { body } = signInSocial.mock.calls[0][0];
    expect(body.additionalParams).toEqual({ ui_locales: "en", prompt: "none" });
    expect(body.errorCallbackURL).toBe("/api/auth/login-error?silent=1");
    expect(store.set).toHaveBeenCalledWith(
      "sso_checked",
      "1",
      expect.objectContaining({ path: "/", maxAge: 60, secure: true })
    );
  });

  it("shows Keycloak's login page when the user presses the button", async () => {
    signInSocial.mockResolvedValue({ url: "https://auth.test/authorize" });

    await expect(login(request("/api/auth/login"))).rejects.toThrow("redirect:");
    expect(signInSocial.mock.calls[0][0].body.additionalParams).not.toHaveProperty("prompt");
    expect(signInSocial.mock.calls[0][0].body).not.toHaveProperty("errorCallbackURL");
    expect(store.set).not.toHaveBeenCalled();
  });

  it("goes quietly to the start page when a silent login finds no session", async () => {
    await expect(loginError(request("/api/auth/login-error?silent=1&error=login_required"))).rejects.toThrow(
      /^redirect:\/$/
    );
    await expect(loginError(request("/api/auth/login-error?silent=1&error=interaction_required"))).rejects.toThrow(
      /^redirect:\/$/
    );
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("goes to the start page but logs it when a silent login fails otherwise", async () => {
    await expect(loginError(request("/api/auth/login-error?silent=1&error=server_error"))).rejects.toThrow(
      /^redirect:\/$/
    );
    expect(console.warn).toHaveBeenCalled();
  });

  it("shows the error page when a session is missing after the login button", async () => {
    store.has.mockReturnValue(false);

    await expect(loginError(request("/api/auth/login-error?error=login_required"))).rejects.toThrow(
      "redirect:/login-error"
    );
  });
});
