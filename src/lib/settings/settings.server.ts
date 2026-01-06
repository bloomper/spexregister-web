import 'server-only';

import {Country, Type} from "@/gql/graphql";

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

async function fetchStatic<T>(query: string, locale: string): Promise<T> {
    const response = await fetch(process.env.API_GRAPHQL_ENDPOINT || '', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': locale,
        },
        body: JSON.stringify({query}),
    });

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    return result.data;
}

export async function getCountries(locale: string): Promise<Country[]> {
    "use cache";
    const data = await fetchStatic<{ countries: Country[] }>(CountriesQuery, locale);
    return data.countries ?? [];
}

export async function getTypes(locale: string): Promise<Type[]> {
    "use cache";
    const data = await fetchStatic<{ types: Type[] }>(TypesQuery, locale);
    return data.types ?? [];
}
