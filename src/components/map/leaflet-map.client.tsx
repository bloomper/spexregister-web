"use client";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {useEffect, useRef, useState} from "react";
import L from "leaflet";
import type {SpexareLocation} from "@/lib/map/map.server";
import {spexareLabel} from "@/components/map/spexare-label";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const SWEDEN: L.LatLngTuple = [62.0, 15.0];
const INITIAL_ZOOM = 5;
const MAX_ZOOM = 19;

type LeafletMapProps = {
    locations: SpexareLocation[];
    onOpen: (id: string) => void;
    attribution: string;
};

const markerIcon = L.divIcon({
    className: "",
    html: "<span class=\"block h-3.5 w-3.5 rounded-full border-2 border-white bg-primary shadow\"></span>",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

function tooltipFor(location: SpexareLocation): HTMLElement {
    const element = document.createElement("span");

    element.textContent = spexareLabel(location);
    return element;
}

/**
 * An OpenStreetMap map with one clustered marker per spexare. The first set of markers fits the view; later changes,
 * such as filtering, keep it where the user left it.
 */
export default function LeafletMap({locations, onOpen, attribution}: LeafletMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const fittedRef = useRef(false);
    const onOpenRef = useRef(onOpen);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        onOpenRef.current = onOpen;
    }, [onOpen]);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }
        let cancelled = false;
        const map = L.map(containerRef.current, {center: SWEDEN, zoom: INITIAL_ZOOM, maxZoom: MAX_ZOOM});

        L.tileLayer(TILE_URL, {
            maxZoom: MAX_ZOOM,
            attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">${attribution}</a>`,
        }).addTo(map);
        mapRef.current = map;

        (window as unknown as { L: typeof L }).L = L;
        import("leaflet.markercluster").then(() => {
            if (cancelled) {
                return;
            }
            const cluster = L.markerClusterGroup({chunkedLoading: true, showCoverageOnHover: false});

            map.addLayer(cluster);
            clusterRef.current = cluster;
            setReady(true);
        });

        return () => {
            cancelled = true;
            clusterRef.current = null;
            mapRef.current = null;
            fittedRef.current = false;
            setReady(false);
            map.remove();
        };
    }, [attribution]);

    useEffect(() => {
        const cluster = clusterRef.current;
        const map = mapRef.current;

        if (!ready || !cluster || !map) {
            return;
        }
        cluster.clearLayers();
        cluster.addLayers(locations.map(location => L.marker([location.latitude, location.longitude], {
            icon: markerIcon,
            keyboard: true,
            title: spexareLabel(location),
        })
            .bindTooltip(tooltipFor(location))
            .on("click", () => onOpenRef.current(location.id))));

        if (!fittedRef.current && locations.length > 0) {
            map.fitBounds(cluster.getBounds(), {padding: [24, 24], maxZoom: 12});
            fittedRef.current = true;
        }
    }, [ready, locations]);

    return <div ref={containerRef} className="isolate h-[70vh] w-full rounded-md border" data-testid="spexare-map"/>;
}
