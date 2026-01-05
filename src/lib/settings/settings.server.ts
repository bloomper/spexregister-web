import 'server-only';

import {getClient} from '@/lib/urql.server';
import {Country, Type} from "@/gql/graphql";
import {getLocale} from "next-intl/server";

const CountryFields = `
    isoCode
    label
`;

const TypeFields = `
    id
    label
    type
`;

const CountriesQuery = /* GraphQL */ `
    query {
        countries {
            ${CountryFields}
        }
    }
`;

const TypesQuery = /* GraphQL */ `
    query {
        types {
            ${TypeFields}
        }
    }
`;

export async function getCountries(): Promise<Country[]> {
    "use cache";
    const locale = await getLocale();

    const result = await getClient()
        .query<{ countries: Country[] }>(CountriesQuery, {})
        .toPromise();

    if (result.error) {
        throw result.error;
    }
    return result.data?.countries ?? [];
}

export async function getTypes(): Promise<Type[]> {
    "use cache";
    const locale = await getLocale();

    const result = await getClient()
        .query<{ types: Type[] }>(TypesQuery, {})
        .toPromise();

    if (result.error) {
        throw result.error;
    }
    return result.data?.types ?? [];
}
