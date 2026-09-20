"use client";

import {useEffect, useMemo, useState, useTransition} from "react";
import {useTranslations} from "next-intl";
import {Network, Search} from "lucide-react";
import {toast} from "sonner";

import {Country, GraphNode, GraphNodeType, Spex, SpexCategory, Tag, Task, TaskCategory} from "@/gql/schema";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {DataEmpty} from "@/components/data-empty";
import {useLazyFull} from "@/hooks/use-lazy-full.client";
import {SpexareViewDialog} from "@/components/spexare/spexare-view-dialog.client";
import {SpexViewDialog} from "@/components/spex/spex-view-dialog.client";
import {SpexCategoryViewDialog} from "@/components/spex/category/spex-category-view-dialog.client";
import {TaskViewDialog} from "@/components/task/task-view-dialog.client";
import {TaskCategoryViewDialog} from "@/components/task/category/task-category-view-dialog.client";
import {TagViewDialog} from "@/components/tag/tag-view-dialog.client";
import {GraphCanvas, NODE_COLOR} from "@/components/graph/graph-canvas.client";
import {GraphLegend} from "@/components/graph/graph-legend.client";
import {GraphNodeList} from "@/components/graph/graph-node-list.client";
import {LoadedNode, matchesTerm, PendingGroup, useGraphState} from "@/components/graph/use-graph-state.client";
import {getNeighbourhoodAction, getNeighboursAction, searchAction} from "@/app/(app)/spexare/explore/actions.server";
import {getAction as getSpexareAction} from "@/app/(app)/spexare/actions.server";
import {getAction as getSpexAction} from "@/app/(app)/spex/actions.server";
import {getAction as getSpexCategoryAction} from "@/app/(app)/spex/categories/actions.server";
import {getAction as getTaskAction} from "@/app/(app)/tasks/actions.server";
import {getAction as getTaskCategoryAction} from "@/app/(app)/tasks/categories/actions.server";
import {getAction as getTagAction} from "@/app/(app)/tags/actions.server";

const EXPAND_LIMIT = 25;

export function GraphExplorer({countries}: { countries: Country[] }) {
    const t = useTranslations();
    const {state, byId, absorb, absorbNodes, collapseNode, reset} = useGraphState();
    const [, startTransition] = useTransition();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<GraphNode[]>([]);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [openId, setOpenId] = useState<string | null>(null);
    const [focusId, setFocusId] = useState<string | null>(null);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        reset();
        setResults([]);
        setQuery("");
        setOpenId(null);
        setFocusId(null);
        setFilter("");
    }, [reset]);

    const open = openId ? byId.get(openId) ?? null : null;
    const openEntityId = open ? String(open.entityId) : null;

    const {full: spexareFull, isLoading: spexareLoading} = useLazyFull(
        open?.type === GraphNodeType.Spexare ? openEntityId : null, getSpexareAction);
    const {full: spexFull} = useLazyFull(
        open?.type === GraphNodeType.Spex ? openEntityId : null, getSpexAction);
    const {full: spexCategoryFull} = useLazyFull(
        open?.type === GraphNodeType.SpexCategory ? openEntityId : null, getSpexCategoryAction);
    const {full: taskFull} = useLazyFull(
        open?.type === GraphNodeType.Task ? openEntityId : null, getTaskAction);
    const {full: taskCategoryFull} = useLazyFull(
        open?.type === GraphNodeType.TaskCategory ? openEntityId : null, getTaskCategoryAction);
    const {full: tagFull} = useLazyFull(
        open?.type === GraphNodeType.Tag ? openEntityId : null, getTagAction);

    const dimmedIds = useMemo(() => {
        const term = filter.trim().toLowerCase();

        return term
            ? new Set(state.nodes.filter((node) => !matchesTerm(node, term)).map((node) => node.id))
            : new Set<string>();
    }, [state.nodes, filter]);

    const tooltips = useMemo(() => Object.fromEntries(state.nodes.map((node) => [
        node.id,
        node.sublabel
            ? `${node.label} · ${node.sublabel} (${t(`Explore.NodeType.${node.type}`)})`
            : `${node.label} (${t(`Explore.NodeType.${node.type}`)})`,
    ])), [state.nodes, t]);

    const runSearch = () => {
        startTransition(async () => {
            try {
                const found = await searchAction(query.trim());

                if (query.trim() === "" && found.length === 1) {
                    seed(found[0]);
                    return;
                }

                setResults(found);
            } catch {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const toggle = (id: string) => {
        setFocusId(id);

        const node = byId.get(id);

        if (node?.expanded) {
            collapseNode(id);

            return;
        }

        expand(id);
    };

    const expand = (id: string) => {
        const node = byId.get(id);

        if (!node || node.expanded) {
            return;
        }

        setBusyId(id);
        startTransition(async () => {
            try {
                const neighbourhood = await getNeighbourhoodAction(node.type, String(node.entityId), EXPAND_LIMIT);

                if (neighbourhood) {
                    absorb(neighbourhood);
                }
            } catch {
                toast.error(t("Common.errorOccurred"));
            } finally {
                setBusyId(null);
            }
        });
    };

    const seed = (node: GraphNode) => {
        setResults([]);
        setQuery("");
        startTransition(async () => {
            try {
                const neighbourhood = await getNeighbourhoodAction(node.type, String(node.entityId), EXPAND_LIMIT);

                if (neighbourhood) {
                    absorb(neighbourhood);
                }
            } catch {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const showMore = (group: PendingGroup) => {
        startTransition(async () => {
            try {
                const page = await getNeighboursAction({
                    type: group.type,
                    id: group.entityId,
                    edge: group.edge,
                    first: group.shown + EXPAND_LIMIT,
                    after: null,
                });
                const origin = byId.get(group.nodeId);

                if (origin) {
                    absorbNodes(origin as LoadedNode, group.edge, page.nodes.slice(group.shown));
                }
            } catch {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-0 flex-1 sm:max-w-sm">
                    <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        className="pl-8"
                        value={query}
                        placeholder={t("Explore.searchPlaceholder")}
                        aria-label={t("Explore.searchPlaceholder")}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                runSearch();
                            }
                        }}
                    />
                </div>
                <Button variant="outline" size="sm" className="h-9" onClick={runSearch}>
                    {t("Explore.search")}
                </Button>
                {state.nodes.length > 0 && (
                    <Button variant="ghost" size="sm" className="h-9" onClick={reset}>
                        {t("Explore.clear")}
                    </Button>
                )}
            </div>

            {results.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label={t("Explore.searchResults")}>
                    {results.map((node) => (
                        <li key={node.id}>
                            <Button variant="outline" size="sm" className="h-8" onClick={() => seed(node)}>
                                <span aria-hidden className="mr-2 size-2.5 rounded-sm"
                                      style={{backgroundColor: NODE_COLOR[node.type]}}/>
                                {node.label}
                                <span className="ml-2 text-xs text-muted-foreground">
                                    {t(`Explore.NodeType.${node.type}`)}
                                </span>
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            {state.nodes.length === 0 ? (
                <DataEmpty icon={Network} title={t("Explore.emptyHeading")} description={t("Explore.emptyDescription")}/>
            ) : (
                <div className="grid min-w-0 gap-4 lg:grid-cols-[2fr_1fr]">
                    <div className="flex min-w-0 flex-col gap-1">
                        <div className="h-[60vh] min-w-0">
                        <GraphCanvas
                            nodes={state.nodes}
                            edges={state.edges}
                            tooltips={tooltips}
                            dimmedIds={dimmedIds}
                            focusId={focusId}
                            onSelect={toggle}
                            onOpen={setOpenId}
                        />
                        </div>
                        <GraphLegend present={new Set(state.nodes.map((node) => node.type))}/>
                        {/* The library's own overlay is English-only, so it is switched off and
                            replaced with this. */}
                        <p className="text-[11px] text-muted-foreground">{t("Explore.navHint")}</p>
                    </div>
                    <GraphNodeList
                        nodes={state.nodes}
                        pending={state.pending}
                        busyId={busyId}
                        focusId={focusId}
                        filter={filter}
                        onFilterChange={setFilter}
                        onExpand={expand}
                        onCollapse={collapseNode}
                        onFocus={setFocusId}
                        onOpen={setOpenId}
                        onShowMore={showMore}
                    />
                </div>
            )}

            <SpexareViewDialog
                open={open?.type === GraphNodeType.Spexare}
                onClose={() => setOpenId(null)}
                summary={null}
                full={spexareFull}
                isLoading={spexareLoading}
                countries={countries}
                isMe={false}
            />
            <SpexViewDialog
                selected={open?.type === GraphNodeType.Spex ? (spexFull as Spex | null) : null}
                onClose={() => setOpenId(null)}
            />
            <SpexCategoryViewDialog
                selected={open?.type === GraphNodeType.SpexCategory ? (spexCategoryFull as SpexCategory | null) : null}
                onClose={() => setOpenId(null)}
            />
            <TaskViewDialog
                selected={open?.type === GraphNodeType.Task ? (taskFull as Task | null) : null}
                onClose={() => setOpenId(null)}
            />
            <TaskCategoryViewDialog
                selected={open?.type === GraphNodeType.TaskCategory ? (taskCategoryFull as TaskCategory | null) : null}
                onClose={() => setOpenId(null)}
            />
            <TagViewDialog
                selected={open?.type === GraphNodeType.Tag ? (tagFull as Tag | null) : null}
                onClose={() => setOpenId(null)}
            />
        </div>
    );
}
