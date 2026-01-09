import * as React from "react";
import {Check, Funnel} from "lucide-react";
import {cn} from "@/utils/utils";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useTranslations} from "next-intl";
import {Input} from "@/components/ui/input";

interface DataFilterProps {
    title?: string
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
    selectedValues: Set<string>
    onSelect: (values: Set<string>) => void
    onClear?: () => void
}

export function DataFilter({
                               title,
                               options,
                               selectedValues,
                               onSelect,
                               onClear,
                           }: DataFilterProps) {
    const t = useTranslations();
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Popover onOpenChange={(open) => !open && setSearchTerm("")}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <Funnel className="mr-2 h-4 w-4"/>
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4"/>
                            <div className="flex space-x-1">
                                <span className="text-xs">
                                   {t("Common.selected", {count: selectedValues.size})}
                                </span>
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-[200px] max-w-[300px] p-0" align="start">
                <div className="flex flex-col p-1">
                    {options.length > 5 && (
                        <div className="px-2 py-2">
                            <Input
                                placeholder={t("Common.search")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-8 text-xs"
                                autoFocus
                            />
                        </div>
                    )}
                    {filteredOptions.map((option) => {
                        const isSelected = selectedValues.has(option.value)
                        return (
                            <Button
                                key={option.value}
                                variant="ghost"
                                size="sm"
                                className="justify-start font-normal h-auto py-1.5 px-2"
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
                                {option.icon && <option.icon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground"/>}
                                <span className="text-left wrap-break-word">{option.label}</span>
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
                                onClick={() => onClear ? onClear() : onSelect(new Set(options.map(o => o.value)))}
                            >
                                {t("Common.resetFilters")}
                            </Button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
