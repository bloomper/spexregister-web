import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);

    if (!m) {
        return '';
    }

    const year = m[1];
    const month = m[2];
    const day = m[3];

    return `${year}-${month}-${day}`;
}

export function formatDateTime(date: string) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(date);

    if (!m) {
        return formatDate(date);
    }

    return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
}
