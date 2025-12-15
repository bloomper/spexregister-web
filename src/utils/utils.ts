import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string, locale: string) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!m) {
        return '';
    }

    const year = Number(m[1]);
    const monthIndex = Number(m[2]) - 1;
    const day = Number(m[3]);

    const d = new Date(Date.UTC(year, monthIndex, day));

    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(d);
}
