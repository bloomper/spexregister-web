import 'server-only';

import {print} from "graphql";
import type {TypedDocumentNode} from "@graphql-typed-document-node/core";
import {Country, Type} from "@/gql/schema";
import {graphql} from "@/gql";

const CountriesQuery = graphql(`
    query Countries {
        countries {
            isoCode
            label
        }
    }
`);

const TypesQuery = graphql(`
    query Types {
        types {
            id
            label
            type
        }
    }
`);

async function fetchStatic<TData>(query: TypedDocumentNode<TData, Record<string, never>>, locale: string): Promise<TData> {
    const response = await fetch(process.env.API_GRAPHQL_ENDPOINT || '', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': locale,
        },
        body: JSON.stringify({query: print(query)}),
    });

    const result = await response.json();

    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    return result.data;
}

export async function getCountries(locale: string): Promise<Country[]> {
    "use cache";
    const data = await fetchStatic(CountriesQuery, locale);
    return (data.countries ?? []) as Country[];
}

export async function getTypes(locale: string): Promise<Type[]> {
    "use cache";
    const data = await fetchStatic(TypesQuery, locale);
    return (data.types ?? []) as Type[];
}
