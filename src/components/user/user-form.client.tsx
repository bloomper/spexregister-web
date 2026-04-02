"use client";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserFormInput, UserFormOutput, userFormSchema} from "@/lib/user/schema";
import {Authority, Spexare, State, User} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {
    addAuthoritiesAction,
    addSpexareAction,
    createAction,
    removeAuthoritiesAction,
    removeSpexareAction,
    searchSpexareAction,
    setStateAction,
    updateAction
} from "@/app/(app)/users/actions.server";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Field, FieldContent, FieldError, FieldLabel} from "@/components/ui/field";
import {cn, translateError} from "@/utils/utils";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Check, ChevronsUpDown, X} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Checkbox} from "@/components/ui/checkbox";

interface UserFormProps {
    item?: User;
    authorities: Authority[];
    states: State[];
    onSuccess: () => void;
}

export function UserForm({item, authorities, states, onSuccess}: UserFormProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();
    const [spexareResults, setSpexareResults] = useState<Spexare[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [spexareSearchOpen, setSpexareSearchOpen] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: {errors},
    } = useForm<UserFormInput, unknown, UserFormOutput>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            email: item?.email ?? "",
            stateId: item?.state?.id ?? "",
            authorityIds: item?.authorities?.map(a => a?.id).filter((id): id is string => !!id) ?? [],
            spexareId: item?.spexare?.id ?? null,
        },
    });

    const selectedSpexareId = watch("spexareId");

    const handleSpexareSearch = async (query: string) => {
        if (query.length < 2) {
            return;
        }
        setIsSearching(true);
        try {
            const results = await searchSpexareAction(query);
            setSpexareResults(results);
        } finally {
            setIsSearching(false);
        }
    };

    const onSubmit = handleSubmit((data) => {
        startTransition(async () => {
            try {
                let userId: string;

                if (item) {
                    if (data.email !== item.email) {
                        await updateAction(item.id, data);
                    }
                    userId = item.id;
                } else {
                    const result = await createAction(data);
                    userId = result.id;
                }

                const initialAuthIds = new Set(item?.authorities?.map(a => a?.id).filter((id): id is string => !!id) ?? []);
                const currentAuthIds = new Set(data.authorityIds);

                const toAdd = data.authorityIds.filter(id => !initialAuthIds.has(id));
                const toRemove = Array.from(initialAuthIds).filter(id => !currentAuthIds.has(id));

                const tasks = [];

                if (toAdd.length > 0) {
                    tasks.push(addAuthoritiesAction(userId, toAdd));
                }
                if (toRemove.length > 0) {
                    tasks.push(removeAuthoritiesAction(userId, toRemove));
                }

                if (data.stateId !== item?.state?.id) {
                    tasks.push(setStateAction(userId, data.stateId));
                }

                if (data.spexareId !== (item?.spexare?.id ?? null)) {
                    if (data.spexareId) {
                        tasks.push(addSpexareAction(userId, data.spexareId));
                    } else {
                        tasks.push(removeSpexareAction(userId));
                    }
                }

                await Promise.all(tasks);

                toast.success(item ? t("Common.updateSuccess") : t("Common.createSuccess"));
                onSuccess();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    });

    return (
        <SheetContent className="sm:max-w-[600px] flex flex-col gap-0 p-0 h-full">
            <SheetHeader className="p-6 pb-4 shrink-0">
                <SheetTitle>{item ? t("User.editHeading") : t("User.createHeading")}</SheetTitle>
            </SheetHeader>

            <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <ScrollArea className="flex-1 border-t min-h-0">
                    <div className="space-y-6 px-6 py-6 pb-12">
                        {item && (
                            <div className="space-y-1">
                                <FieldLabel>{t("User.externalId")}</FieldLabel>
                                <div className="text-sm font-mono text-muted-foreground break-all">
                                    {item.externalId}
                                </div>
                            </div>
                        )}

                        <Field data-invalid={!!errors.email}>
                            <FieldLabel>{t("User.email")}</FieldLabel>
                            <FieldContent>
                                <Input {...register("email")} disabled={isPending}/>
                                <FieldError errors={[translateError(t, errors.email)]}/>
                            </FieldContent>
                        </Field>

                        <Field data-invalid={!!errors.stateId}>
                            <FieldLabel>{t("User.state")}</FieldLabel>
                            <FieldContent>
                                <Controller
                                    control={control}
                                    name="stateId"
                                    render={({field}) => (
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("Common.select")}/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {states.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FieldError errors={[translateError(t, errors.stateId)]}/>
                            </FieldContent>
                        </Field>

                        <Field data-invalid={!!errors.authorityIds}>
                            <FieldLabel>{t("User.authorities")}</FieldLabel>
                            <FieldContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    {authorities.map((auth) => (
                                        <div key={auth.id} className="flex items-center space-x-2">
                                            <Controller
                                                control={control}
                                                name="authorityIds"
                                                render={({field}) => (
                                                    <Checkbox
                                                        id={`auth-${auth.id}`}
                                                        checked={field.value.includes(auth.id)}
                                                        onCheckedChange={(checked) => {
                                                            const current = new Set(field.value);
                                                            if (checked) current.add(auth.id);
                                                            else current.delete(auth.id);
                                                            field.onChange(Array.from(current));
                                                        }}
                                                        disabled={isPending}
                                                    />
                                                )}
                                            />
                                            <label htmlFor={`auth-${auth.id}`}
                                                   className="text-sm font-medium leading-none cursor-pointer">
                                                {auth.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <FieldError errors={[translateError(t, errors.authorityIds)]}/>
                            </FieldContent>
                        </Field>

                        <Field data-invalid={!!errors.spexareId}>
                            <FieldLabel>{t("User.spexareHeading")}</FieldLabel>
                            <FieldContent>
                                <div className="flex items-center gap-2">
                                    <Popover open={spexareSearchOpen} onOpenChange={setSpexareSearchOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="flex-1 justify-between font-normal text-left h-auto min-h-10 py-2"
                                                disabled={isPending}
                                            >
                                                <div className="truncate">
                                                    {selectedSpexareId
                                                        ? (spexareResults.find(s => s.id === selectedSpexareId) ?? item?.spexare)?.firstName + " " + (spexareResults.find(s => s.id === selectedSpexareId) ?? item?.spexare)?.lastName
                                                        : t("Common.select")}
                                                </div>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[350px] p-0" align="start">
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder={t("Common.searchPlaceholder")}
                                                    onValueChange={handleSpexareSearch}
                                                />
                                                <CommandList>
                                                    {isSearching && <div
                                                        className="p-4 text-sm text-center text-muted-foreground">{t("Common.loading")}</div>}
                                                    <CommandEmpty>{t("Common.noDataFound")}</CommandEmpty>
                                                    <CommandGroup>
                                                        {spexareResults.map((s) => (
                                                            <CommandItem
                                                                key={s.id}
                                                                value={s.id}
                                                                onSelect={() => {
                                                                    setValue("spexareId", s.id);
                                                                    setSpexareSearchOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn("mr-2 h-4 w-4", selectedSpexareId === s.id ? "opacity-100" : "opacity-0")}/>
                                                                <div className="flex flex-col">
                                                                    <span>{s.firstName} {s.lastName}</span>
                                                                    {s.nickName && <span
                                                                        className="text-xs text-muted-foreground italic">{s.nickName}</span>}
                                                                </div>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {selectedSpexareId && (
                                        <Button variant="ghost" size="icon" onClick={() => setValue("spexareId", null)}
                                                disabled={isPending}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    )}
                                </div>
                                <FieldError errors={[translateError(t, errors.spexareId)]}/>
                            </FieldContent>
                        </Field>
                    </div>
                </ScrollArea>

                <SheetFooter className="p-6 pt-4 border-t bg-muted/30 shrink-0 mt-auto">
                    <SheetClose asChild>
                        <Button type="button" variant="outline" disabled={isPending}>
                            {item ? t("Common.close") : t("Common.cancel")}
                        </Button>
                    </SheetClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? t("Common.saving") : t("Common.save")}
                    </Button>
                </SheetFooter>
            </form>
        </SheetContent>
    );
}
