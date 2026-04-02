import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {format, parseISO} from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
    if (!date) {
        return '';
    }
    try {
        return format(parseISO(date), "yyyy-MM-dd");
    } catch (e) {
        return '';
    }
}

export function formatDateTime(date: string) {
    if (!date) {
        return '';
    }
    try {
        return format(parseISO(date), "yyyy-MM-dd HH:mm");
    } catch (e) {
        return formatDate(date);
    }
}

export function getProxiedImageUrl(url?: string | null, lastModifiedAt?: string | null) {
    if (!url) {
        return "";
    }
    const params = new URLSearchParams();
    params.set("url", url);

    if (lastModifiedAt) {
        params.set("t", new Date(lastModifiedAt).getTime().toString());
    }

    return `/api/image-download-proxy?${params.toString()}`;
}

export function translateError<T extends { message?: string }>(t: (key: string) => string, error?: T) {
    if (!error?.message) {
        return error;
    }
    return {
        ...error,
        message: t(error.message)
    };
}
