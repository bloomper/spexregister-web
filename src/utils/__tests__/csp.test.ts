import { describe, expect, it } from "vitest";
import { contentSecurityPolicy } from "@/utils/csp";

describe("contentSecurityPolicy", () => {
  it("keeps scripts, connections and frames to the application itself", () => {
    const policy = contentSecurityPolicy(false);

    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("connect-src 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).not.toContain("unsafe-eval");
  });

  it("allows eval only in development, which the dev server needs", () => {
    expect(contentSecurityPolicy(true)).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
  });
});
