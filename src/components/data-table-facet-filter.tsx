import * as React from "react";
import {Check, PlusCircle} from "lucide-react";
import {cn} from "@/utils/utils";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useTranslations} from "next-intl";

interface DataTableFacetedFilterProps {
    title?: string
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
    selectedValues: Set<string>
    onSelect: (values: Set<string>) => void
}

export function DataTableFacetedFilter({
                                           title,
                                           options,
                                           selectedValues,
                                           onSelect,
                                       }: DataTableFacetedFilterProps) {
    const t = useTranslations();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4"/>
                            <div className="flex space-x-1">
                                {selectedValues.size > 2 ? (
                                    <span className="text-xs">{selectedValues.size} selected</span>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option) => (
                                            <span key={option.value}
                                                  className="bg-secondary text-secondary-foreground px-1 rounded text-xs">
                        {option.label}
                      </span>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <div className="flex flex-col p-1">
                    {options.map((option) => {
                        const isSelected = selectedValues.has(option.value)
                        return (
                            <Button
                                key={option.value}
                                variant="ghost"
                                size="sm"
                                className="justify-start font-normal"
                                onClick={() => {
                                    const next = new Set(selectedValues)
                                    if (isSelected) {
                                        next.delete(option.value)
                                    } else {
                                        next.add(option.value)
                                    }
                                    onSelect(next)
                                }}
                            >
                                <div className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                                )}>
                                    <Check className="h-4 w-4"/>
                                </div>
                                {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground"/>}
                                <span>{option.label}</span>
                            </Button>
                        )
                    })}
                    {selectedValues.size > 0 && (
                        <>
                            <Separator className="my-1"/>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="justify-center text-xs"
                                onClick={() => onSelect(new Set())}
                            >
                                {t("Common.clearFilters")}
                            </Button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
