import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import json from "@eslint/json";
import css from "@eslint/css";
import {defineConfig, globalIgnores} from "eslint/config";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores(["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "package-lock.json"]),
    {files: ["**/*.json"], plugins: {json}, language: "json/json", extends: ["json/recommended"]},
    {files: ["**/*.css"], plugins: {css}, language: "css/css", extends: ["css/recommended"]},
]);
