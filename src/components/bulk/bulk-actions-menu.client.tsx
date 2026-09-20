"use client";

import {Fragment, useState} from "react";
import {useTranslations} from "next-intl";
import {ChevronDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SpexareBulkOperation} from "@/gql/schema";
import {BulkActionDialog, BulkActions} from "@/components/bulk/bulk-action-dialog.client";
import {bulkMenuIcon as MenuIcon, BulkOptions, bulkRegistry} from "@/components/bulk/registry.client";

interface BulkActionsMenuProps {
    options: BulkOptions;
    actions: BulkActions;
    selectedIds: string[];
    filter: string | null;
}

export function BulkActionsMenu({options, actions, selectedIds, filter}: BulkActionsMenuProps) {
    const t = useTranslations();
    const [operation, setOperation] = useState<SpexareBulkOperation | null>(null);

    if (selectedIds.length === 0 && !filter) {
        return null;
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8"/>}>
                    <MenuIcon className="mr-2 h-4 w-4"/>
                    {selectedIds.length > 0
                        ? t("Spexare.bulk.menuWithCount", {count: selectedIds.length})
                        : t("Spexare.bulk.menu")}
                    <ChevronDown className="ml-2 h-4 w-4"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    {bulkRegistry.map((def, index) => {
                        const Icon = def.icon;
                        const startsGroup = index > 0 && bulkRegistry[index - 1].group !== def.group;

                        return (
                            <Fragment key={def.operation}>
                                {startsGroup && <DropdownMenuSeparator/>}
                                <DropdownMenuItem onClick={() => setOperation(def.operation)}>
                                    <Icon className="mr-2 h-4 w-4"/>
                                    {t(`Spexare.bulk.operations.${def.operation}`)}
                                </DropdownMenuItem>
                            </Fragment>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <BulkActionDialog
                operation={operation}
                onClose={() => setOperation(null)}
                options={options}
                actions={actions}
                selectedIds={selectedIds}
                filter={filter}
            />
        </>
    );
}
