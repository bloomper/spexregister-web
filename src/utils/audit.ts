import {AuditedType} from "@/gql/schema";

const NAMESPACES: Record<AuditedType, string> = {
    [AuditedType.News]: "News",
    [AuditedType.Spex]: "Spex",
    [AuditedType.SpexDetails]: "Spex",
    [AuditedType.SpexCategory]: "Spex.Category",
    [AuditedType.Spexare]: "Spexare",
    [AuditedType.Activity]: "Spexare.Activity",
    [AuditedType.SpexActivity]: "Spexare.Activity.SpexActivity",
    [AuditedType.TaskActivity]: "Spexare.Activity.TaskActivity",
    [AuditedType.Actor]: "Spexare.Activity.TaskActivity.Actor",
    [AuditedType.Address]: "Spexare.Address",
    [AuditedType.Consent]: "Spexare.Consent",
    [AuditedType.Membership]: "Spexare.Membership",
    [AuditedType.Toggle]: "Spexare.Toggle",
    [AuditedType.Tag]: "Tag",
    [AuditedType.Task]: "Task",
    [AuditedType.TaskCategory]: "Task.Category",
    [AuditedType.User]: "User",
    [AuditedType.State]: "User",
    [AuditedType.Type]: "Audit.fields",
};

// The audited column holds the bytes while the form labels the rendered URL.
const ALIASES: Record<string, string> = {
    logo: "logoUrl",
    poster: "posterUrl",
    image: "imageUrl",
};

/**
 * Where each audited type is looked at. Only aggregate roots appear: children reach the screen
 * through their root, and `SPEX_DETAILS` / `STATE` / `TYPE` have no screen of their own.
 */
const ROUTES: Partial<Record<AuditedType, string>> = {
    [AuditedType.Spexare]: "/spexare",
    [AuditedType.News]: "/news/manage",
    [AuditedType.Spex]: "/spex/manage",
    [AuditedType.SpexCategory]: "/spex/categories/manage",
    [AuditedType.Task]: "/tasks/manage",
    [AuditedType.TaskCategory]: "/tasks/categories/manage",
    [AuditedType.Tag]: "/tags/manage",
    [AuditedType.User]: "/users/manage",
};

/** Which tab of the spexare view holds the type that actually changed. */
const SPEXARE_TABS: Partial<Record<AuditedType, string>> = {
    [AuditedType.Spexare]: "general",
    [AuditedType.Address]: "addresses",
    [AuditedType.Consent]: "consents",
    [AuditedType.Membership]: "memberships",
    [AuditedType.Toggle]: "toggles",
    [AuditedType.Activity]: "activities",
    [AuditedType.SpexActivity]: "activities",
    [AuditedType.TaskActivity]: "activities",
    [AuditedType.Actor]: "activities",
};

export const AUDIT_OPEN_PARAM = "open";
export const AUDIT_TAB_PARAM = "tab";

/**
 * A link straight to the record an audit event concerns. `target` is the aggregate root to open;
 * `changedType` is what actually changed within it, which picks the tab to land on.
 */
export function auditEntityHref(
    target: { type: AuditedType; id: string | number } | null | undefined,
    changedType?: AuditedType,
): string | null {
    const route = target ? ROUTES[target.type] : undefined;

    if (!target || !route) {
        return null;
    }

    const params = new URLSearchParams({[AUDIT_OPEN_PARAM]: String(target.id)});
    const tab = target.type === AuditedType.Spexare && changedType ? SPEXARE_TABS[changedType] : undefined;

    if (tab) {
        params.set(AUDIT_TAB_PARAM, tab);
    }

    return `${route}?${params.toString()}`;
}

type Translator = {
    (key: string): string;
    has: (key: string) => boolean;
};

export function auditBinaryUrl(type: AuditedType, entityId: string, revision: number, field: string): string {
    const params = new URLSearchParams();

    params.set("url", `/api/revisions/${type}/${entityId}/${revision}/binary/${field}`);

    return `/api/image-download-proxy?${params.toString()}`;
}

export function auditFieldValue(t: Translator, type: AuditedType, field: string, value: string): string {
    if (value !== "true" && value !== "false") {
        return value;
    }

    const states = `${NAMESPACES[type]}.${field}States.${value}`;

    if (t.has(states)) {
        return t(states);
    }

    return value === "true" ? t("Common.yes") : t("Common.no");
}

export function auditTypeLabel(t: Translator, type: AuditedType): string {
    const key = `Audit.types.${type}`;

    return t.has(key) ? t(key) : humanize(type);
}

export function auditFieldLabel(t: Translator, type: AuditedType, field: string): string {
    const name = ALIASES[field] ?? field;

    for (const key of [`${NAMESPACES[type]}.${name}`, `Audit.fields.${name}`]) {
        if (t.has(key)) {
            return t(key);
        }
    }

    // A field nobody has translated yet should still not surface as a raw identifier.
    return humanize(field);
}

function humanize(field: string): string {
    const words = field.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ").toLowerCase();

    return words.charAt(0).toUpperCase() + words.slice(1);
}
