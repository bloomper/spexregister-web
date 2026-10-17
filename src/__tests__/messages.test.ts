import {readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";
import {describe, expect, it} from "vitest";
import sv from "../../messages/sv.json";
import en from "../../messages/en.json";

type Messages = { [key: string]: string | Messages };

const SRC = join(__dirname, "..");

function keysOf(messages: Messages, prefix = ""): string[] {
    return Object.entries(messages).flatMap(([key, value]) =>
        typeof value === "string" ? [`${prefix}${key}`] : keysOf(value, `${prefix}${key}.`));
}

function sourceFiles(dir: string): string[] {
    return readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            return entry.name === "__tests__" || entry.name === "gql" ? [] : sourceFiles(path);
        }
        return /\.tsx?$/.test(entry.name) ? [path] : [];
    });
}

function usedKeys() {
    return sourceFiles(SRC).flatMap((file) => {
        const source = readFileSync(file, "utf8");
        const namespaces = [...source.matchAll(/(?:useTranslations|getTranslations)\(\s*"([^"]+)"\s*\)/g)]
            .map((match) => match[1]);
        const translated = [...source.matchAll(/\bt\(\s*"([A-Za-z0-9_.]+)"/g)].map((match) => ({
            file: file.slice(SRC.length + 1),
            candidates: [match[1], ...namespaces.map((namespace) => `${namespace}.${match[1]}`)],
        }));
        const validation = file.endsWith("schema.ts")
            ? [...source.matchAll(/"([A-Z][A-Za-z]*(?:\.[A-Za-z0-9_]+)+)"/g)].map((match) => ({
                file: file.slice(SRC.length + 1),
                candidates: [match[1]],
            }))
            : [];
        return [...translated, ...validation];
    });
}

describe("messages", () => {
    const svKeys = new Set(keysOf(sv as Messages));
    const enKeys = new Set(keysOf(en as Messages));

    it("has the same keys in every locale", () => {
        expect([...svKeys].filter((key) => !enKeys.has(key))).toEqual([]);
        expect([...enKeys].filter((key) => !svKeys.has(key))).toEqual([]);
    });

    it("defines every key the source translates", () => {
        const missing = usedKeys()
            .filter(({candidates}) => !candidates.some((key) => svKeys.has(key) || isNamespace(sv as Messages, key)))
            .map(({file, candidates}) => `${file}: ${candidates[0]}`);

        expect([...new Set(missing)]).toEqual([]);
    });
});

function isNamespace(messages: Messages, key: string) {
    const value = key.split(".").reduce<string | Messages | undefined>(
        (node, part) => (typeof node === "object" ? node[part] : undefined), messages);
    return typeof value === "object";
}
