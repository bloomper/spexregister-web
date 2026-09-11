"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";
import {AuditedType} from "@/gql/schema";
import {auditBinaryUrl} from "@/utils/audit";

/**
 * The audited binary as it was at one revision. Falls back to a plain "changed" when the bytes
 * cannot be rendered, which is the case for anything that is not an image.
 */
export function AuditBinaryThumbnail({type, entityId, revision, field}: {
    type: AuditedType;
    entityId: string;
    revision: number;
    field: string;
}) {
    const t = useTranslations();
    const [failed, setFailed] = useState(false);

    if (failed) {
        return <span className="italic">{t("Audit.binaryChanged")}</span>;
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={auditBinaryUrl(type, entityId, revision, field)}
            alt={t("Audit.binaryChanged")}
            className="inline-block h-8 w-8 rounded border border-border/60 object-cover align-middle"
            onError={() => setFailed(true)}
        />
    );
}
