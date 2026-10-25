const OPERATOR_WORDS = new Set(["and", "or"]);

/**
 * A server filter expression that finds each word of the text in any of the fields: every word must match, in one of
 * the fields. Wildcards, parentheses and the words AND and OR are dropped from the text.
 */
export function textFilter(fields: string[], query: string): string {
    const words = query
        .split(/\s+/)
        .map((word) => word.replace(/[*()]/g, ""))
        .filter((word) => word !== "" && !OPERATOR_WORDS.has(word.toLowerCase()));

    return words
        .map((word) => {
            const matches = fields.map((field) => `${field}:*${word}*`);
            return matches.length > 1 ? `(${matches.join(" OR ")})` : matches[0];
        })
        .join(" AND ");
}
