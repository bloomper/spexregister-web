import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import json from "@eslint/json";
import css from "@eslint/css";
import {tailwind4} from "tailwind-csstree";
import type {SyntaxConfig} from "@eslint/css-tree";
import {defineConfig, globalIgnores} from "eslint/config";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    {settings: {react: {version: "19.2.7"}}},
    globalIgnores([
        "node_modules/**",
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "package-lock.json",
        "src/components/ui/**",
        "src/gql/**",
    ]),
    {files: ["**/*.json"], plugins: {json}, language: "json/json", extends: ["json/recommended"]},
    {
        files: ["**/*.css"],
        plugins: {css},
        language: "css/css",
        languageOptions: {
            customSyntax: (defaultSyntax: SyntaxConfig) => {
                const base = tailwind4(defaultSyntax);
                return {
                    ...base,
                    atrules: {
                        ...base.atrules,
                        theme: {
                            ...base.atrules?.theme,
                            prelude: "<ident>"
                        }
                    }
                };
            },
            tolerant: true
        },
        extends: ["css/recommended"]
    },
]);
