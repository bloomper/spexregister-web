"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {Info, Minus, Plus, Search, X} from "lucide-react";
import {GraphNodeType} from "@/gql/schema";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {NODE_COLOR} from "@/components/graph/graph-canvas.client";
import {LoadedNode, PendingGroup} from "@/components/graph/use-graph-state.client";

type NodeListProps = {
    nodes: LoadedNode[];
    pending: PendingGroup[];
    busyId: string | null;
    focusId: string | null;
    onExpand: (id: string) => void;
    onCollapse: (id: string) => void;
    onFocus: (id: string) => void;
    onOpen: (id: string) => void;
    onShowMore: (group: PendingGroup) => void;
};

const HAS_DIALOG: GraphNodeType[] = [GraphNodeType.Spexare, GraphNodeType.Spex, GraphNodeType.Task];

export function GraphNodeList({
                                  nodes, pending, busyId, focusId,
                                  onExpand, onCollapse, onFocus, onOpen, onShowMore,
                              }: NodeListProps) {
    const t = useTranslations();
    const [filter, setFilter] = useState("");
    const listRef = useRef<HTMLUListElement>(null);

    const ordered = useMemo(() => {
        const term = filter.trim().toLowerCase();

        return [...nodes]
            .filter((node) => !term
                || node.label.toLowerCase().includes(term)
                || (node.sublabel ?? "").toLowerCase().includes(term))
            .sort((a, b) => a.type.localeCompare(b.type) || a.label.localeCompare(b.label));
    }, [nodes, filter]);

    useEffect(() => {
        if (!focusId) {
            return;
        }

        listRef.current
            ?.querySelector(`[data-node-id="${CSS.escape(focusId)}"]`)
            ?.scrollIntoView({block: "nearest", behavior: "smooth"});
    }, [focusId]);

    if (nodes.length === 0) {
        return null;
    }

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <h3 className="text-sm font-semibold">{t("Explore.loadedNodes", {count: nodes.length})}</h3>
            <div className="relative">
                <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"/>
                <Input
                    className="h-8 pr-7 pl-7 text-sm"
                    value={filter}
                    placeholder={t("Explore.filterPlaceholder")}
                    aria-label={t("Explore.filterPlaceholder")}
                    onChange={(e) => setFilter(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            e.preventDefault();
                            setFilter("");
                        }
                    }}
                />
                {filter && (
                    <button
                        type="button"
                        className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                        aria-label={t("Explore.clearFilter")}
                        onClick={() => setFilter("")}
                    >
                        <X className="h-3.5 w-3.5"/>
                    </button>
                )}
            </div>
            {ordered.length === 0 && (
                <p className="px-1 py-2 text-sm text-muted-foreground">{t("Explore.noMatches")}</p>
            )}
            <ul ref={listRef} className="flex max-h-[60vh] min-w-0 flex-col gap-1 overflow-y-auto pr-1">
                {ordered.map((node) => {
                    const more = pending.filter((group) => group.nodeId === node.id);

                    return (
                        <li key={node.id}
                            data-node-id={node.id}
                            className={`flex min-w-0 flex-col gap-1 rounded-md border p-2 ${
                                focusId === node.id ? "border-primary bg-accent/40" : ""}`}>
                            <div className="flex min-w-0 items-center gap-2">
                                <span aria-hidden className="size-2.5 shrink-0 rounded-sm"
                                      style={{backgroundColor: NODE_COLOR[node.type]}}/>
                                <button
                                    type="button"
                                    className="min-w-0 flex-1 truncate text-left text-sm hover:underline"
                                    aria-label={t("Explore.focusLabel", {name: node.label})}
                                    onClick={() => onFocus(node.id)}
                                >
                                    <span className="font-medium">{node.label}</span>
                                    {node.sublabel && (
                                        <span className="ml-1.5 text-xs text-muted-foreground">{node.sublabel}</span>
                                    )}
                                    {node.revival && (
                                        <span className="ml-1.5 text-xs text-muted-foreground">
                                            ({t("Explore.revival")})
                                        </span>
                                    )}
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        {t(`Explore.NodeType.${node.type}`)}
                                    </span>
                                </button>
                                {node.expanded ? (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 shrink-0"
                                        aria-label={t("Explore.collapseLabel", {name: node.label})}
                                        onClick={() => onCollapse(node.id)}
                                    >
                                        <Minus className="h-3 w-3"/>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 shrink-0"
                                        disabled={busyId === node.id}
                                        aria-label={t("Explore.expandLabel", {name: node.label})}
                                        onClick={() => onExpand(node.id)}
                                    >
                                        <Plus className="h-3 w-3"/>
                                    </Button>
                                )}
                                {HAS_DIALOG.includes(node.type) && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 shrink-0"
                                        aria-label={t("Explore.detailsLabel", {name: node.label})}
                                        onClick={() => onOpen(node.id)}
                                    >
                                        <Info className="h-3 w-3"/>
                                    </Button>
                                )}
                            </div>
                            {more.map((group) => (
                                <Button
                                    key={group.edge}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 justify-start text-xs font-normal"
                                    onClick={() => onShowMore(group)}
                                >
                                    {t("Explore.showMore", {shown: group.shown, total: group.totalCount})}
                                </Button>
                            ))}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
