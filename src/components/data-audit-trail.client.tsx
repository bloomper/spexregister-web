'use client';

import {useState, useTransition} from 'react';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible';
import {Button} from '@/components/ui/button';
import {ChevronDown, ChevronUp, History, Pencil, PlusCircle, Trash2} from 'lucide-react';
import {Event, EventType} from '@/gql/graphql';
import {useTranslations} from 'next-intl';
import {formatDateTime} from "@/utils/utils";

const EVENT_ICONS = {
    [EventType.Create]: <PlusCircle className="h-3 w-3 text-green-600/80"/>,
    [EventType.Update]: <Pencil className="h-3 w-3 text-blue-600/80"/>,
    [EventType.Remove]: <Trash2 className="h-3 w-3 text-destructive/80"/>,
};

interface AuditTrailProps {
    id: string;
    fetchAction: (id: string) => Promise<Event[]>;
}

export function AuditTrail({id, fetchAction}: AuditTrailProps) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [isPending, startTransition] = useTransition();
    const [hasLoaded, setHasLoaded] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && !hasLoaded) {
            startTransition(async () => {
                try {
                    const data = await fetchAction(id);
                    setEvents(data);
                    setHasLoaded(true);
                } catch (e) {
                    console.error("Failed to fetch audit trail", e);
                }
            });
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={handleOpenChange}
                     className="w-full rounded-lg border bg-muted/30 shadow-sm">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm"
                        className="flex w-full items-center justify-between px-3 py-2 h-auto hover:bg-muted/50 transition-colors">
                    <div
                        className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">
                        <History className="h-3.5 w-3.5 text-muted-foreground"/>
                        <span>{t('Common.history')}</span>
                    </div>
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground"/> :
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/>}
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="px-3 pb-3">
                <div className="relative pt-1 ml-1.5">
                    {isPending ? (
                        <div className="space-y-3 animate-pulse">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="h-3 w-3 rounded-full bg-muted/60"/>
                                    <div className="flex-1 space-y-1.5 py-0.5">
                                        <div className="h-2 w-16 bg-muted/60 rounded"/>
                                        <div className="h-2 w-24 bg-muted/40 rounded"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {!hasLoaded && !isPending && <div className="h-2"/>}
                            {hasLoaded && events.length === 0 && (
                                <div className="text-[11px] text-muted-foreground italic py-1">
                                    {t('Common.noDataFound')}
                                </div>
                            )}

                            {events.length > 0 && (
                                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border/60"/>
                            )}

                            <div className="space-y-3">
                                {events.map((event) => (
                                    <div key={event.id}
                                         className="relative flex items-start gap-3 text-[11px] text-muted-foreground">
                                        <div
                                            className="relative z-10 flex h-3 w-3 items-center justify-center bg-muted/30 ring-[3px] ring-muted/30">
                                            {EVENT_ICONS[event.eventType] || <History className="h-3 w-3"/>}
                                        </div>
                                        <div className="flex flex-1 flex-col gap-0.5 leading-tight">
                                            <div className="flex items-center justify-between">
                                            <span className="font-bold text-foreground/80 uppercase tracking-tight">
                                                {t(`Common.eventTypes.${event.eventType}`)}
                                            </span>
                                                <span className="text-[10px] opacity-80">
                                                {formatDateTime(event.createdAt)}
                                            </span>
                                            </div>
                                            <div className="text-foreground/60 italic">
                                                {event.createdBy || "-"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
