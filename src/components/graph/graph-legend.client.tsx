"use client";

import {useTranslations} from "next-intl";
import {GraphNodeType} from "@/gql/schema";
import {NODE_COLOR} from "@/components/graph/graph-canvas.client";

const ORDER: GraphNodeType[] = [
    GraphNodeType.Spexare,
    GraphNodeType.Spex,
    GraphNodeType.SpexCategory,
    GraphNodeType.Task,
    GraphNodeType.TaskCategory,
    GraphNodeType.Tag,
];

export function GraphLegend({present}: { present: Set<GraphNodeType> }) {
    const t = useTranslations();

    return (
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {ORDER.filter((type) => present.has(type)).map((type) => (
                <li key={type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span aria-hidden className="size-2.5 rounded-full"
                          style={{backgroundColor: NODE_COLOR[type]}}/>
                    {t(`Explore.NodeType.${type}`)}
                </li>
            ))}
            <li className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span aria-hidden
                      className="size-2.5 rounded-full border-2"
                      style={{borderColor: NODE_COLOR[GraphNodeType.Spex]}}/>
                {t("Explore.revival")}
            </li>
        </ul>
    );
}
