"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import dynamic from "next/dynamic";
import {GraphEdge, GraphNodeType} from "@/gql/schema";
import {Skeleton} from "@/components/ui/skeleton";
import {getProxiedImageUrl} from "@/utils/utils";
import type {ForceNode} from "@/components/graph/graph-force-3d.client";
import {LoadedNode} from "@/components/graph/use-graph-state.client";

const GraphForce3D = dynamic(() => import("@/components/graph/graph-force-3d.client"), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full"/>,
});

export const NODE_COLOR: Record<GraphNodeType, string> = {
    [GraphNodeType.Spexare]: "var(--viz-series-1)",
    [GraphNodeType.Spex]: "var(--viz-series-3)",
    [GraphNodeType.SpexCategory]: "var(--viz-series-4)",
    [GraphNodeType.Task]: "var(--viz-series-5)",
    [GraphNodeType.TaskCategory]: "var(--viz-series-6)",
    [GraphNodeType.Tag]: "var(--viz-series-7)",
};

const NODE_SIZE: Record<GraphNodeType, number> = {
    [GraphNodeType.Spexare]: 12,
    [GraphNodeType.Spex]: 11,
    [GraphNodeType.SpexCategory]: 9,
    [GraphNodeType.Task]: 9,
    [GraphNodeType.TaskCategory]: 9,
    [GraphNodeType.Tag]: 9,
};

type CanvasProps = {
    nodes: LoadedNode[];
    edges: GraphEdge[];
    tooltips: Record<string, string>;
    focusId: string | null;
    onSelect: (id: string) => void;
    onOpen: (id: string) => void;
};

const DOUBLE_CLICK_MS = 350;

const nodeObjects = new Map<string, ForceNode>();

const SURFACE = {light: "#ffffff", dark: "#0c0a09"};
const LINK = {light: "#d9d7d2", dark: "#44403c"};
const INK = {light: "#0b0b0b", dark: "#ffffff"};

function useResolvedColors() {
    const [colors, setColors] = useState<Record<string, string>>({});

    useEffect(() => {
        const read = () => {
            const style = getComputedStyle(document.documentElement);
            const isDark = document.documentElement.classList.contains("dark");
            const next: Record<string, string> = {};

            for (const [type, variable] of Object.entries(NODE_COLOR)) {
                const name = variable.replace("var(", "").replace(")", "");

                next[type] = style.getPropertyValue(name).trim() || "#888888";
            }

            next.__surface = isDark ? SURFACE.dark : SURFACE.light;
            next.__link = isDark ? LINK.dark : LINK.light;
            next.__ink = isDark ? INK.dark : INK.light;
            setColors(next);
        };

        read();

        const observer = new MutationObserver(read);

        observer.observe(document.documentElement, {attributes: true, attributeFilter: ["class", "data-theme"]});

        return () => observer.disconnect();
    }, []);

    return colors;
}

export function GraphCanvas({nodes, edges, tooltips, focusId, onSelect, onOpen}: CanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastClickRef = useRef<{ id: string; at: number } | null>(null);
    const [size, setSize] = useState({width: 0, height: 0});
    const colors = useResolvedColors();

    useEffect(() => () => nodeObjects.clear(), []);

    const handleClick = (id: string) => {
        const last = lastClickRef.current;
        const now = Date.now();

        if (last && last.id === id && now - last.at < DOUBLE_CLICK_MS) {
            lastClickRef.current = null;
            onOpen(id);
            return;
        }

        lastClickRef.current = {id, at: now};
        onSelect(id);
    };

    useEffect(() => {
        const element = containerRef.current;

        if (!element) {
            return;
        }

        const observer = new ResizeObserver(([entry]) => {
            setSize({width: entry.contentRect.width, height: entry.contentRect.height});
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const data = useMemo(() => {
        const live = new Set(nodes.map((node) => node.id));

        for (const key of [...nodeObjects.keys()]) {
            if (!live.has(key)) {
                nodeObjects.delete(key);
            }
        }

        const forceNodes = nodes.map((node) => {
            const key = node.id;
            const next: ForceNode = nodeObjects.get(key) ?? {
                id: node.id,
                label: node.label,
                caption: node.label,
                type: node.type,
                color: colors[node.type] ?? "#888888",
                size: NODE_SIZE[node.type] ?? 8,
                revival: Boolean(node.revival),
            };

            next.label = tooltips[node.id] ?? node.label;
            next.caption = node.label;
            next.color = colors[node.type] ?? "#888888";
            next.revival = Boolean(node.revival);
            next.imageUrl = node.imageUrl ? getProxiedImageUrl(node.imageUrl) : null;
            nodeObjects.set(key, next);

            return next;
        });

        return {
            nodes: forceNodes,
            links: edges.map((edge) => ({source: edge.source, target: edge.target})),
        };
    }, [nodes, edges, colors, tooltips]);

    return (
        <div ref={containerRef} className="h-full w-full min-w-0 overflow-hidden rounded-lg">
            {size.width > 0 && (
                <GraphForce3D
                    width={size.width}
                    height={size.height}
                    nodes={data.nodes}
                    links={data.links}
                    background={colors.__surface || "#ffffff"}
                    linkColor={colors.__link || "#cccccc"}
                    captionInk={colors.__ink || "#0b0b0b"}
                    focusId={focusId}
                    onNodeClick={handleClick}
                />
            )}
        </div>
    );
}
