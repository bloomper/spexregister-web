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
    const words = field.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();

    return words.charAt(0).toUpperCase() + words.slice(1);
}
