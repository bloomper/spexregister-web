"use client";

import {useMemo, useState} from "react";
import dynamic from "next/dynamic";
import {useTranslations} from "next-intl";
import {MapPin, Search} from "lucide-react";
import type {Country} from "@/gql/schema";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {DataEmpty} from "@/components/data-empty";
import {SpexareViewDialog} from "@/components/spexare/spexare-view-dialog.client";
import {useLazyFull} from "@/hooks/use-lazy-full.client";
import type {SpexareLocation} from "@/lib/map/map.server";
import {spexareLabel} from "@/components/map/spexare-label";
import {getAction as getSpexareAction} from "@/app/(app)/spexare/actions.server";

const LeafletMap = dynamic(() => import("@/components/map/leaflet-map.client"), {
    ssr: false,
    loading: () => <Skeleton className="h-[70vh] w-full"/>,
});

type SpexareMapProps = {
    locations: SpexareLocation[];
    countries: Country[];
};

/**
 * The spexare on a map, clustered where they are close. A name filter narrows the markers, and clicking one opens the
 * spexare's details.
 */
export function SpexareMap({locations, countries}: SpexareMapProps) {
    const t = useTranslations("Map");
    const [filter, setFilter] = useState("");
    const [openId, setOpenId] = useState<string | null>(null);
    const {full, isLoading} = useLazyFull(openId, getSpexareAction);

    const shown = useMemo(() => {
        const term = filter.trim().toLowerCase();

        return term ? locations.filter(location => spexareLabel(location).toLowerCase().includes(term)) : locations;
    }, [locations, filter]);

    if (locations.length === 0) {
        return <DataEmpty title={t("emptyTitle")} description={t("emptyDescription")} icon={MapPin}/>;
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        value={filter}
                        onChange={event => setFilter(event.target.value)}
                        placeholder={t("filterPlaceholder")}
                        aria-label={t("filterPlaceholder")}
                        className="pl-8"
                    />
                </div>
                <span className="text-sm text-muted-foreground">
                    {t("count", {shown: shown.length, total: locations.length})}
                </span>
            </div>
            <LeafletMap locations={shown} onOpen={setOpenId} attribution={t("attribution")}/>
            <SpexareViewDialog
                open={openId !== null}
                onClose={() => setOpenId(null)}
                summary={null}
                full={full}
                isLoading={isLoading}
                countries={countries}
                isMe={false}
            />
        </div>
    );
}
