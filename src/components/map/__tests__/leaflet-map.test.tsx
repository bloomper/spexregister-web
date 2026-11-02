import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, waitFor} from "@testing-library/react";
import type {SpexareLocation} from "@/lib/map/map.server";

const leaflet = vi.hoisted(() => {
    const handlers: Array<() => void> = [];
    const markers: Array<{ latLng: [number, number]; options: Record<string, unknown>; tooltip?: HTMLElement }> = [];
    const cluster = {
        clearLayers: vi.fn(() => {
            markers.length = 0;
        }),
        addLayers: vi.fn(),
        getBounds: vi.fn(() => "bounds"),
    };
    const map = {
        addLayer: vi.fn(),
        fitBounds: vi.fn(),
        remove: vi.fn(),
    };
    const L = {
        map: vi.fn(() => map),
        tileLayer: vi.fn(() => ({addTo: vi.fn()})),
        divIcon: vi.fn(() => "icon"),
        markerClusterGroup: vi.fn(() => cluster),
        marker: vi.fn((latLng: [number, number], options: Record<string, unknown>) => {
            const entry: (typeof markers)[number] = {latLng, options};
            markers.push(entry);
            const marker = {
                bindTooltip: (element: HTMLElement) => {
                    entry.tooltip = element;
                    return marker;
                },
                on: (_event: string, handler: () => void) => {
                    handlers.push(handler);
                    return marker;
                },
            };
            return marker;
        }),
    };
    return {L, map, cluster, markers, handlers};
});

vi.mock("leaflet", () => ({default: leaflet.L}));
vi.mock("leaflet.markercluster", () => ({}));
vi.mock("leaflet/dist/leaflet.css", () => ({}));
vi.mock("leaflet.markercluster/dist/MarkerCluster.css", () => ({}));
vi.mock("leaflet.markercluster/dist/MarkerCluster.Default.css", () => ({}));

import LeafletMap from "@/components/map/leaflet-map.client";

const ada: SpexareLocation = {id: "1", firstName: "Ada", lastName: "<b>Lovelace</b>", nickName: null, latitude: 57.7, longitude: 11.9};
const grace: SpexareLocation = {id: "2", firstName: "Grace", lastName: "Hopper", nickName: null, latitude: 59.3, longitude: 18.0};

beforeEach(() => {
    vi.clearAllMocks();
    leaflet.markers.length = 0;
    leaflet.handlers.length = 0;
});

describe("LeafletMap", () => {
    it("adds a marker per location and fits the view once", async () => {
        const {rerender} = render(<LeafletMap locations={[ada, grace]} onOpen={vi.fn()} attribution="OSM"/>);

        await waitFor(() => expect(leaflet.cluster.addLayers).toHaveBeenCalled());
        expect(leaflet.markers.map(marker => marker.latLng)).toEqual([[57.7, 11.9], [59.3, 18.0]]);
        expect(leaflet.map.fitBounds).toHaveBeenCalledTimes(1);

        rerender(<LeafletMap locations={[grace]} onOpen={vi.fn()} attribution="OSM"/>);

        await waitFor(() => expect(leaflet.cluster.addLayers).toHaveBeenCalledTimes(2));
        expect(leaflet.markers.map(marker => marker.latLng)).toEqual([[59.3, 18.0]]);
        expect(leaflet.map.fitBounds).toHaveBeenCalledTimes(1);
    });

    it("shows names as text, never as markup", async () => {
        render(<LeafletMap locations={[ada]} onOpen={vi.fn()} attribution="OSM"/>);

        await waitFor(() => expect(leaflet.markers).toHaveLength(1));
        expect(leaflet.markers[0].tooltip?.textContent).toBe("Ada <b>Lovelace</b>");
        expect(leaflet.markers[0].tooltip?.querySelector("b")).toBeNull();
    });

    it("opens the clicked spexare with the latest callback", async () => {
        const first = vi.fn();
        const latest = vi.fn();
        const {rerender} = render(<LeafletMap locations={[ada]} onOpen={first} attribution="OSM"/>);

        await waitFor(() => expect(leaflet.handlers).toHaveLength(1));
        rerender(<LeafletMap locations={[ada]} onOpen={latest} attribution="OSM"/>);
        leaflet.handlers[0]();

        expect(latest).toHaveBeenCalledWith("1");
        expect(first).not.toHaveBeenCalled();
    });

    it("removes the map when unmounted", async () => {
        const {unmount} = render(<LeafletMap locations={[]} onOpen={vi.fn()} attribution="OSM"/>);

        await waitFor(() => expect(leaflet.map.addLayer).toHaveBeenCalled());
        unmount();

        expect(leaflet.map.remove).toHaveBeenCalled();
    });
});
