import type {SpexareLocation} from "@/lib/map/map.server";

/**
 * A spexare's name as shown on the map: first name, nickname in quotes, last name.
 */
export function spexareLabel(location: Pick<SpexareLocation, "firstName" | "lastName" | "nickName">): string {
    return [
        location.firstName,
        location.nickName ? `"${location.nickName}"` : null,
        location.lastName,
    ].filter(Boolean).join(" ");
}
