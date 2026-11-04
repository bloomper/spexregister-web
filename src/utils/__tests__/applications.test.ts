import {describe, expect, it} from "vitest";
import {resolveApplications} from "@/utils/applications";

const env = {
    SPEXREGISTER_WEB_URL: "https://register.example.org",
    FGV_REVIVAL_WEB_URL: "https://revival.example.org/",
    SPEXFLIX_WEB_URL: "https://spexflix.example.org",
    SPEXIFY_WEB_URL: "https://spexify.example.org",
};

const user = {roles: ["USER"]};

describe("resolveApplications", () => {
    it("lists the current application first among the others the user can open, in a fixed order", () => {
        const claims = {resource_access: {"fgv-spexify": user, "spexregister": user, "fgv-revival": user}};

        expect(resolveApplications("spexflix", claims, env)).toEqual([
            {id: "spexregister", url: "https://register.example.org", current: false},
            {id: "revival", url: "https://revival.example.org", current: false},
            {id: "spexflix", url: "/", current: true},
            {id: "spexify", url: "https://spexify.example.org", current: false},
        ]);
    });

    it("leaves out an application whose USER role is not in the token", () => {
        const claims = {resource_access: {"fgv-revival": {roles: ["OBSERVER"]}, "fgv-spexify": {}}};

        expect(resolveApplications("spexregister", claims, env).map(a => a.id)).toEqual(["spexregister"]);
    });

    it("leaves out an application without an address", () => {
        const claims = {resource_access: {"fgv-revival": user, "fgv-spexflix": user}};

        expect(resolveApplications("spexregister", claims, {...env, FGV_REVIVAL_WEB_URL: " "}).map(a => a.id))
            .toEqual(["spexregister", "spexflix"]);
    });

    it("lists only the current application without claims", () => {
        expect(resolveApplications("revival", {}, env)).toEqual([{id: "revival", url: "/", current: true}]);
    });
});
