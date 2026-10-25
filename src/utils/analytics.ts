import {Bucket} from "@/gql/schema";

/**
 * The spexare search narrowed to a statistics bucket, or null when the bucket has no facet to narrow by.
 */
export function bucketHref(bucket: Pick<Bucket, "facet" | "key">): string | null {
    if (!bucket.facet || !bucket.key) {
        return null;
    }
    const params = new URLSearchParams();
    params.set(`f.${bucket.facet}`, bucket.key);

    return `/spexare/search?${params.toString()}`;
}
