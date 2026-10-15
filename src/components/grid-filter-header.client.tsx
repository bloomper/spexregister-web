"use client";

import {X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

export function GridFilterHeader({title, placeholder, value, onChange}: {
    title: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="col-span-full mb-6 flex flex-col gap-4 border-b pb-6">
            <div>
                <h3 className="text-lg font-bold tracking-tight">{title}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-[300px]">
                    <Input
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-8 pr-8"
                    />
                    {value && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-8 w-8 hover:bg-transparent"
                            onClick={() => onChange("")}
                        >
                            <X className="h-3 w-3"/>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
