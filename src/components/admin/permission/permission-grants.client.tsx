"use client";

import {type ReactNode, useEffect, useMemo, useRef, useState, useTransition} from "react";
import {useLocale, useTranslations} from "next-intl";
import {format, parse} from "date-fns";
import {enUS, sv} from "react-day-picker/locale";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import {CalendarIcon, Check, ChevronsUpDown, Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Sheet, SheetClose, SheetFooter} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {useRefresh} from "@/hooks/use-refresh.client";
import {Calendar} from "@/components/ui/calendar";
import {useIsClient} from "@/hooks/use-is-client.client";
import {useDataTableActions} from "@/hooks/use-data-table-actions.client";
import {EditFormShell} from "@/components/edit-queue/edit-form-shell.client";
import {DataTable} from "@/components/data-table.client";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";
import {DataFilter} from "@/components/data-filter";
import {columnHelper} from "@/components/data-table-columns.client";
import type {DataTableColumnDef} from "@/components/data-table-features";
import {cn, formatDate} from "@/utils/utils";
import type {CursorPage} from "@/types/pagination";
import type {PermissionGrant} from "@/lib/permission/permission.server";
import {
    GRANTABLE_ROLES,
    PermissionGrantFormInput,
    permissionGrantFormSchema,
    PermissionGrantUpdateFormInput,
    permissionGrantUpdateFormSchema,
    PERMISSIONS,
    SCOPES
} from "@/lib/permission/schema";
import {
    bulkDeleteGrantsAction,
    createGrantAction,
    deleteGrantAction,
    getGrantsPageAction,
    searchSpexareAction,
    searchUsersAction,
    updateGrantAction
} from "@/app/(app)/admin/permissions/actions.server";

type Option = { id: string; label: string };

const GRANTEE_TYPES = ["USER", "ROLE"] as const;

interface PermissionGrantsProps {
    initialData: CursorPage<PermissionGrant>;
    spex: Option[];
    /** The roles with their names, as Spexregister's authorities */
    roles: Option[];
}

type Translate = ReturnType<typeof useTranslations<"PermissionGrant">>;

function roleName(roles: Option[], role: string) {
    return roles.find((option) => option.id === role)?.label ?? role;
}

function granteeOf(t: Translate, roles: Option[], grant: PermissionGrant) {
    if (grant.role) {
        return t("roleGrantee", {role: roleName(roles, grant.role)});
    }

    const spexare = grant.user?.spexare;

    return spexare ? `${spexare.firstName} ${spexare.lastName}` : grant.user?.email ?? "";
}

function scopeOf(t: Translate, grant: PermissionGrant) {
    if (grant.scope === "SPEXARE") {
        return t("scopes.SPEXARE_ONE", {name: `${grant.spexare?.firstName ?? ""} ${grant.spexare?.lastName ?? ""}`.trim()});
    }

    return t(grant.scope === "SPEX" ? "scopes.SPEX_ONE" : "scopes.SPEX_PARTICIPANTS_ONE", {
        name: grant.spex ? `${grant.spex.title} (${grant.spex.year})` : "",
    });
}

/** One equality term per chosen value, or none when every value is chosen */
function valuesFilter(field: string, chosen: Set<string>, all: readonly string[]) {
    if (chosen.size === all.length) {
        return null;
    }
    if (chosen.size === 0) {
        return `${field}:NULL`;
    }

    const terms = [...chosen].map((value) => `${field}:${value}`);

    return terms.length > 1 ? `(${terms.join(" OR ")})` : terms[0];
}

/**
 * The permission grants as a table, with adding, changing and removing them. A grant is to a user or a role, on a
 * spexare, a spex's participants or a spex, and may end on a date.
 */
export function PermissionGrants({initialData, spex, roles}: PermissionGrantsProps) {
    const t = useTranslations("PermissionGrant");
    const common = useTranslations("Common");
    const isClient = useIsClient();
    const refresh = useRefresh();
    const [creating, setCreating] = useState(false);
    const [permissions, setPermissions] = useState<Set<string>>(new Set(PERMISSIONS));
    const [scopes, setScopes] = useState<Set<string>>(new Set(SCOPES));
    const setFilterRef = useRef<((filter: string) => void) | null>(null);
    const lastFilterRef = useRef("");

    const {
        editItem, setEditItem,
        deleteItem, setDeleteItem,
        selectedRows, setSelectedRows,
        isBulkDeleting, setIsBulkDeleting,
        isPending,
        handleDelete,
        handleBulkDelete
    } = useDataTableActions<PermissionGrant>(deleteGrantAction, bulkDeleteGrantsAction);

    const columns = useMemo<DataTableColumnDef<PermissionGrant>[]>(() => [
        columnHelper.select(),
        {
            id: "grantee",
            header: () => t("grantee"),
            cell: ({row}) => <span className="font-medium">{granteeOf(t, roles, row.original)}</span>,
            enableSorting: false,
        },
        {
            id: "permission",
            accessorKey: "permission",
            header: () => t("permission"),
            cell: ({row}) => t(`permissions.${row.original.permission}`),
            enableSorting: false,
        },
        {
            id: "scope",
            header: () => t("scope"),
            cell: ({row}) => scopeOf(t, row.original),
            enableSorting: false,
            meta: {className: "hidden md:table-cell"},
        },
        {
            id: "validUntil",
            accessorKey: "validUntil",
            header: () => t("validUntil"),
            cell: ({row}) => (
                <>
                    {row.original.validUntil ? formatDate(row.original.validUntil) : t("noEnd")}
                    {row.original.expired &&
                        <Badge variant="secondary" className="ml-2">{t("expired")}</Badge>}
                </>
            ),
            enableSorting: false,
            meta: {className: "hidden lg:table-cell"},
        },
        ...columnHelper.audit<PermissionGrant>(),
        columnHelper.actions<PermissionGrant>(),
    ], [t, roles]);

    const filter = [valuesFilter("permission", permissions, PERMISSIONS), valuesFilter("scope", scopes, SCOPES)]
        .filter(Boolean)
        .join(" AND ");
    const isFilterActive = filter !== "";

    useEffect(() => {
        const timer = setTimeout(() => {
            if (setFilterRef.current && filter !== lastFilterRef.current) {
                lastFilterRef.current = filter;
                setFilterRef.current(filter);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [filter]);

    if (!isClient) {
        return <DataTableSkeleton columnCount={8} rowCount={15}/>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                initialSorting={[{id: "createdAt", desc: true}]}
                onRowClick={setEditItem}
                onSelectionChange={setSelectedRows}
                onFetch={getGrantsPageAction}
                meta={{
                    setEditItem,
                    setDeleteItem,
                    setFilter: (handler) => {
                        setFilterRef.current = handler;
                    }
                }}
            >
                <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <DataFilter
                            title={t("permission")}
                            selectedValues={permissions}
                            onSelect={setPermissions}
                            onClear={() => setPermissions(new Set(PERMISSIONS))}
                            options={PERMISSIONS.map((value) => ({label: t(`permissions.${value}`), value}))}
                        />
                        <DataFilter
                            title={t("scope")}
                            selectedValues={scopes}
                            onSelect={setScopes}
                            onClear={() => setScopes(new Set(SCOPES))}
                            options={SCOPES.map((value) => ({label: t(`scopes.${value}`), value}))}
                        />

                        {isFilterActive && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setPermissions(new Set(PERMISSIONS));
                                    setScopes(new Set(SCOPES));
                                }}
                                className="h-8 px-2 lg:px-3"
                            >
                                <X className="mr-2 h-4 w-4"/>
                                {common("reset")}
                            </Button>
                        )}

                        {selectedRows.length > 0 && (
                            <Button variant="destructive" size="sm" className="h-8"
                                    onClick={() => setIsBulkDeleting(true)}>
                                {common("delete")} ({selectedRows.length})
                            </Button>
                        )}
                    </div>

                    <Button size="sm" className="h-8 w-full lg:w-auto" onClick={() => setCreating(true)}>
                        <Plus className="mr-2 h-4 w-4"/>
                        {t("create")}
                    </Button>
                </div>
            </DataTable>

            <PermissionGrantDialog
                open={creating}
                onOpenChange={setCreating}
                spex={spex}
                roles={roles}
                onCreated={() => {
                    setCreating(false);
                    refresh();
                }}
            />

            <PermissionGrantEditSheet
                grant={editItem}
                grantee={editItem ? granteeOf(t, roles, editItem) : ""}
                scope={editItem ? scopeOf(t, editItem) : ""}
                onOpenChange={(open) => !open && setEditItem(null)}
                onSaved={() => {
                    setEditItem(null);
                    refresh();
                }}
            />

            <DataTableDeleteDialogs
                deleteItem={deleteItem}
                setDeleteItem={setDeleteItem}
                isBulkDeleting={isBulkDeleting}
                setIsBulkDeleting={setIsBulkDeleting}
                isPending={isPending}
                handleDelete={handleDelete}
                handleBulkDelete={handleBulkDelete}
            />
        </>
    );
}

interface PermissionGrantDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    spex: Option[];
    roles: Option[];
    onCreated: () => void;
}

function PermissionGrantDialog({open, onOpenChange, spex, roles, onCreated}: PermissionGrantDialogProps) {
    const t = useTranslations("PermissionGrant");
    const common = useTranslations("Common");
    const [isPending, startTransition] = useTransition();
    const [isSearching, startSearch] = useTransition();
    const [isSearchingUsers, startUserSearch] = useTransition();
    const [userOptions, setUserOptions] = useState<Option[]>([]);
    const [query, setQuery] = useState("");
    const [spexareOptions, setSpexareOptions] = useState<Option[]>([]);
    const {control, handleSubmit, reset, formState: {errors}} = useForm<PermissionGrantFormInput>({
        resolver: zodResolver(permissionGrantFormSchema),
        defaultValues: {granteeType: "USER", permission: "WRITE", scope: "SPEX_PARTICIPANTS"},
    });
    const granteeType = useWatch({control, name: "granteeType"});
    const scope = useWatch({control, name: "scope"});

    function searchSpexare(value: string) {
        setQuery(value);
        if (value.trim().length < 2) {
            setSpexareOptions([]);
            return;
        }
        startSearch(async () => {
            const options = await searchSpexareAction(value.trim());

            setSpexareOptions(options);
        });
    }

    function searchUsers(value: string) {
        startUserSearch(async () => {
            setUserOptions(await searchUsersAction(value.trim()));
        });
    }

    const onSubmit = handleSubmit((value) => {
        startTransition(async () => {
            try {
                await createGrantAction(value);
                toast.success(t("created"));
                reset();
                setQuery("");
                setSpexareOptions([]);
                setUserOptions([]);
                onCreated();
            } catch (error) {
                void error;
                toast.error(t("error"));
            }
        });
    });

    const errorOf = (message?: string) => message ?
        <FieldError>{t(message.replace("PermissionGrant.", ""))}</FieldError> : null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <EditFormShell title={t("create")}>
                <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <ScrollArea className="flex-1 border-t min-h-0">
                        <div className="space-y-4 px-6 py-6 pb-12">
                            <Field>
                                <FieldLabel>{t("granteeType")}</FieldLabel>
                                <Controller control={control} name="granteeType" render={({field}) => (
                                    <Select value={field.value} onValueChange={field.onChange}
                                            items={GRANTEE_TYPES.map((value) => ({
                                                value,
                                                label: t(`granteeTypes.${value}`)
                                            }))}>
                                        <SelectTrigger className="w-full"
                                                       aria-label={t("granteeType")}><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {GRANTEE_TYPES.map((value) => <SelectItem key={value}
                                                                                      value={value}>{t(`granteeTypes.${value}`)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}/>
                            </Field>

                            {granteeType === "USER" ? (
                                <Field>
                                    <FieldLabel>{t("user")}</FieldLabel>
                                    <Controller control={control} name="userId" render={({field}) => (
                                        <SearchSelect label={t("user")} value={field.value} onChange={field.onChange}
                                                      options={userOptions} searchPlaceholder={t("searchUser")}
                                                      onSearch={searchUsers} searching={isSearchingUsers}/>
                                    )}/>
                                    {errorOf(errors.userId?.message)}
                                </Field>
                            ) : (
                                <Field>
                                    <FieldLabel>{t("role")}</FieldLabel>
                                    <Controller control={control} name="role" render={({field}) => (
                                        <Select value={field.value ?? ""} onValueChange={field.onChange}
                                                items={GRANTABLE_ROLES.map((role) => ({
                                                    value: role,
                                                    label: roleName(roles, role)
                                                }))}>
                                            <SelectTrigger className="w-full" aria-label={t("role")}><SelectValue
                                                placeholder={t("choose")}/></SelectTrigger>
                                            <SelectContent>
                                                {GRANTABLE_ROLES.map((role) => <SelectItem key={role}
                                                                                           value={role}>{roleName(roles, role)}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    )}/>
                                    {errorOf(errors.role?.message)}
                                </Field>
                            )}

                            <Field>
                                <FieldLabel>{t("permission")}</FieldLabel>
                                <Controller control={control} name="permission" render={({field}) => (
                                    <Select value={field.value} onValueChange={field.onChange}
                                            items={PERMISSIONS.map((value) => ({
                                                value,
                                                label: t(`permissions.${value}`)
                                            }))}>
                                        <SelectTrigger className="w-full"
                                                       aria-label={t("permission")}><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {PERMISSIONS.map((permission) => (
                                                <SelectItem key={permission}
                                                            value={permission}>{t(`permissions.${permission}`)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}/>
                            </Field>

                            <Field>
                                <FieldLabel>{t("scope")}</FieldLabel>
                                <Controller control={control} name="scope" render={({field}) => (
                                    <Select value={field.value} onValueChange={field.onChange}
                                            items={SCOPES.map((value) => ({value, label: t(`scopes.${value}`)}))}>
                                        <SelectTrigger className="w-full"
                                                       aria-label={t("scope")}><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {SCOPES.map((value) => <SelectItem key={value}
                                                                               value={value}>{t(`scopes.${value}`)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                )}/>
                            </Field>

                            {scope === "SPEXARE" ? (
                                <Field>
                                    <FieldLabel>{t("spexare")}</FieldLabel>
                                    <Controller control={control} name="spexareId" render={({field}) => (
                                        <SearchSelect label={t("spexare")} value={field.value} onChange={field.onChange}
                                                      options={spexareOptions} searchPlaceholder={t("searchSpexare")}
                                                      onSearch={searchSpexare} searching={isSearching}
                                                      emptyText={query.trim().length < 2 ? t("searchMinLength") : undefined}/>
                                    )}/>
                                    {errorOf(errors.spexareId?.message)}
                                </Field>
                            ) : (
                                <Field>
                                    <FieldLabel>{t("spex")}</FieldLabel>
                                    <Controller control={control} name="spexId" render={({field}) => (
                                        <SearchSelect label={t("spex")} value={field.value} onChange={field.onChange}
                                                      options={spex} searchPlaceholder={t("searchSpex")}/>
                                    )}/>
                                    {errorOf(errors.spexId?.message)}
                                </Field>
                            )}

                            <Controller control={control} name="validUntil" render={({field}) => (
                                <ValidUntilField value={field.value} onChange={field.onChange}
                                                 error={errorOf(errors.validUntil?.message)}/>
                            )}/>

                        </div>
                    </ScrollArea>
                    <SheetFooter className="p-6 pt-4 border-t bg-muted/30 shrink-0 mt-auto">
                        <SheetClose render={<Button type="button" variant="outline" disabled={isPending}/>}>
                            {common("cancel")}
                        </SheetClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? common("saving") : common("save")}
                        </Button>
                    </SheetFooter>
                </form>
            </EditFormShell>
        </Sheet>
    );
}

interface SearchSelectProps {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    options: Option[];
    searchPlaceholder: string;
    /** Searches on the server as the user types; without it, the options are filtered here */
    onSearch?: (query: string) => void;
    searching?: boolean;
    emptyText?: string;
}

function SearchSelect({
                          label,
                          value,
                          onChange,
                          options,
                          searchPlaceholder,
                          onSearch,
                          searching,
                          emptyText
                      }: SearchSelectProps) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    // Server search replaces the options, so remember the chosen one to keep showing its label
    const [chosen, setChosen] = useState<Option | null>(null);
    const current = options.find((option) => option.id === value) ?? (chosen?.id === value ? chosen : null);

    return (
        <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={(next) => {
                // Each opening starts a new search, rather than showing the results of the last one
                if (next) {
                    setSearch("");
                    onSearch?.("");
                }
                setOpen(next);
            }}>
                <PopoverTrigger render={<Button type="button" variant="outline" role="combobox" aria-label={label}
                                                aria-expanded={open}
                                                className="flex-1 justify-between font-normal"/>}>
                    <span className={cn("truncate", !current && "text-muted-foreground")}>
                        {current?.label ?? t("PermissionGrant.choose")}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </PopoverTrigger>
                <PopoverContent className="w-(--anchor-width) p-0" align="start">
                    <Command shouldFilter={!onSearch}>
                        <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={(next) => {
                            setSearch(next);
                            onSearch?.(next);
                        }}/>
                        <CommandList>
                            {searching && <div
                                className="p-4 text-sm text-center text-muted-foreground">{t("Common.loading")}</div>}
                            {!searching && <CommandEmpty>{emptyText ?? t("Common.noDataFound")}</CommandEmpty>}
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.id}
                                        value={option.id}
                                        keywords={[option.label]}
                                        onSelect={() => {
                                            setChosen(option);
                                            onChange(option.id);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn("mr-2 h-4 w-4", option.id === value ? "opacity-100" : "opacity-0")}/>
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {current && (
                <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}
                        aria-label={t("PermissionGrant.clearChoice", {field: label})}>
                    <X className="h-4 w-4"/>
                </Button>
            )}
        </div>
    );
}

function ValidUntilField({value, onChange, error}: {
    value?: string;
    onChange: (value: string) => void;
    error: ReactNode;
}) {
    const t = useTranslations();
    const locale = useLocale() === "sv" ? sv : enUS;
    const today = new Date();
    const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;

    return (
        <Field>
            <FieldLabel htmlFor="permission-grant-valid-until">{t("PermissionGrant.validUntil")}</FieldLabel>
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger render={<Button id="permission-grant-valid-until" type="button" variant="outline"
                                                    className={cn("flex-1 justify-start text-left font-normal",
                                                        !value && "text-muted-foreground")}/>}>
                        <CalendarIcon className="mr-2 h-4 w-4"/>
                        {value ? formatDate(value) : <span>{t("Common.selectDate")}</span>}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            locale={locale}
                            captionLayout="dropdown"
                            startMonth={today}
                            endMonth={new Date(today.getFullYear() + 10, 11)}
                            disabled={{before: today}}
                            defaultMonth={selected}
                            formatters={{formatMonthDropdown: (date) => format(date, "MMM", {locale})}}
                            selected={selected}
                            onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        />
                    </PopoverContent>
                </Popover>
                {value && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}
                            aria-label={t("PermissionGrant.clearValidUntil")}>
                        <X className="h-4 w-4"/>
                    </Button>
                )}
            </div>
            {error}
        </Field>
    );
}

interface PermissionGrantEditSheetProps {
    grant: PermissionGrant | null;
    grantee: string;
    scope: string;
    onOpenChange: (open: boolean) => void;
    onSaved: () => void;
}

function PermissionGrantEditSheet({grant, grantee, scope, onOpenChange, onSaved}: PermissionGrantEditSheetProps) {
    const t = useTranslations("PermissionGrant");
    const common = useTranslations("Common");
    const [isPending, startTransition] = useTransition();
    const {control, handleSubmit, reset, formState: {errors}} = useForm<PermissionGrantUpdateFormInput>({
        resolver: zodResolver(permissionGrantUpdateFormSchema),
        values: grant ? {permission: grant.permission, validUntil: grant.validUntil ?? ""} : undefined,
    });

    const onSubmit = handleSubmit((value) => {
        if (!grant) {
            return;
        }
        startTransition(async () => {
            try {
                await updateGrantAction(grant.id, value);
                toast.success(common("updateSuccess"));
                reset();
                onSaved();
            } catch (error) {
                void error;
                toast.error(t("error"));
            }
        });
    });

    const errorOf = (message?: string) => message ?
        <FieldError>{t(message.replace("PermissionGrant.", ""))}</FieldError> : null;

    return (
        <Sheet open={!!grant} onOpenChange={onOpenChange}>
            <EditFormShell title={t("editHeading")}>
                <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <ScrollArea className="flex-1 border-t min-h-0">
                        <div className="space-y-4 px-6 py-6 pb-12">
                            <Field>
                                <FieldLabel>{t("grantee")}</FieldLabel>
                                <p className="text-sm">{grantee}</p>
                            </Field>
                            <Field>
                                <FieldLabel>{t("scope")}</FieldLabel>
                                <p className="text-sm">{scope}</p>
                            </Field>

                            <Field>
                                <FieldLabel>{t("permission")}</FieldLabel>
                                <Controller control={control} name="permission" render={({field}) => (
                                    <Select value={field.value} onValueChange={field.onChange}
                                            items={PERMISSIONS.map((value) => ({
                                                value,
                                                label: t(`permissions.${value}`)
                                            }))}>
                                        <SelectTrigger className="w-full"
                                                       aria-label={t("permission")}><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {PERMISSIONS.map((permission) => (
                                                <SelectItem key={permission}
                                                            value={permission}>{t(`permissions.${permission}`)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}/>
                            </Field>

                            <Controller control={control} name="validUntil" render={({field}) => (
                                <ValidUntilField value={field.value} onChange={field.onChange}
                                                 error={errorOf(errors.validUntil?.message)}/>
                            )}/>
                        </div>
                    </ScrollArea>
                    <SheetFooter className="p-6 pt-4 border-t bg-muted/30 shrink-0 mt-auto">
                        <SheetClose render={<Button type="button" variant="outline" disabled={isPending}/>}>
                            {common("close")}
                        </SheetClose>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? common("saving") : common("save")}
                        </Button>
                    </SheetFooter>
                </form>
            </EditFormShell>
        </Sheet>
    );
}
