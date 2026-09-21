import {Bucket} from "@/gql/schema";

export function bucketHref(bucket: Pick<Bucket, "facet" | "key">): string | null {
    if (!bucket.facet || !bucket.key) {
        return null;
    }
    const params = new URLSearchParams();
    params.set(`f.${bucket.facet}`, bucket.key);

    return `/spexare/search?${params.toString()}`;
}
