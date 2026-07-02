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
