// @ts-nocheck -- @eslint/json and @eslint/css ship @eslint/core@1 rule types that don't
// match eslint@9's Plugin type (@eslint/core@0.17), so `defineConfig` reports a false
// TS2322 on the json/css plugin blocks. ESLint validates this config at runtime; drop this
// pragma once the toolchain is back on a single @eslint/core (e.g. after the eslint@10 upgrade).
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
    {
        files: ["**/*.{ts,tsx,mts}"],
        rules: {
            quotes: ["error", "double", {avoidEscape: true, allowTemplateLiterals: true}],
            "jsx-quotes": ["error", "prefer-double"],
        },
    },
    {
        files: ["src/app/global-error.tsx"],
        rules: {
            "@next/next/no-html-link-for-pages": "off",
        },
    },
    {
        // This config file carries a @ts-nocheck for the @eslint/json/@eslint/css plugin type
        // skew (see the header comment); allow it here only.
        files: ["eslint.config.mts"],
        rules: {
            "@typescript-eslint/ban-ts-comment": "off",
        },
    },
    globalIgnores([
        "node_modules/**",
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "package-lock.json",
        "src/components/ui/**",
        "src/gql/**",
        "coverage/**",
        "test-results/**",
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
