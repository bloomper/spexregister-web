type EventData = Record<string, string | number | boolean>;

declare global {
    interface Window {
        umami?: { track: (event: string, data?: EventData) => void };
    }
}

// Never pass personal data: no names, personnummer, record ids or free text
/**
 * Tracks an event in Umami, when it is loaded. Never fails.
 */
export function track(event: string, data?: EventData) {
    try {
        window.umami?.track(event, data);
    } catch {
    }
}
