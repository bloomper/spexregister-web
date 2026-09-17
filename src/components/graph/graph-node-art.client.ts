"use client";

import {GraphNodeType} from "@/gql/schema";

const GLYPH: Record<GraphNodeType, string> = {
    [GraphNodeType.Spexare]:
        '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    [GraphNodeType.Spex]:
        '<path d="M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3"/>'
        + '<path d="M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7"/>',
    [GraphNodeType.SpexCategory]:
        '<path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"/>'
        + '<rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="3.5"/>',
    [GraphNodeType.Task]:
        '<rect width="8" height="4" x="8" y="2" rx="1"/>'
        + '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>'
        + '<path d="M12 11h4"/><path d="M12 16h4"/>',
    [GraphNodeType.TaskCategory]:
        '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/>'
        + '<path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/>',
    [GraphNodeType.Tag]:
        '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>',
};

const DISC = 192;
const CENTRE = DISC / 2;
const RADIUS = DISC / 2;

const CAPTION_HEIGHT = 128;
const CAPTION_FONT = 84;
const CAPTION_PADDING = 24;

function canvas(width: number, height: number) {
    const element = document.createElement("canvas");

    element.width = width;
    element.height = height;

    return element;
}

function drawRings(context: CanvasRenderingContext2D, color: string, revival: boolean) {
    context.beginPath();
    context.arc(CENTRE, RADIUS, RADIUS - 5, 0, Math.PI * 2);
    context.strokeStyle = color;
    context.lineWidth = 8;
    context.stroke();

    if (!revival) {
        return;
    }

    context.beginPath();
    context.arc(CENTRE, RADIUS, RADIUS - 18, 0, Math.PI * 2);
    context.lineWidth = 5;
    context.stroke();
}

export function drawCaption(label: string, color: string, ink: string) {
    const text = label.length > 24 ? `${label.slice(0, 23)}…` : label;
    const font = `600 ${CAPTION_FONT}px system-ui, -apple-system, 'Segoe UI', sans-serif`;

    const measure = canvas(8, 8).getContext("2d");

    if (measure) {
        measure.font = font;
    }

    const width = Math.ceil((measure?.measureText(text).width ?? text.length * CAPTION_FONT * 0.6)) + CAPTION_PADDING * 2;
    const element = canvas(width, CAPTION_HEIGHT);
    const context = element.getContext("2d");

    if (!context) {
        return {canvas: element, aspect: width / CAPTION_HEIGHT};
    }

    context.font = font;
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.lineWidth = 14;
    context.lineJoin = "round";
    context.strokeStyle = color;
    context.strokeText(text, width / 2, CAPTION_HEIGHT / 2);
    context.fillStyle = ink;
    context.fillText(text, width / 2, CAPTION_HEIGHT / 2);

    return {canvas: element, aspect: width / CAPTION_HEIGHT};
}

export function drawFallback(type: GraphNodeType, color: string, revival: boolean) {
    const element = canvas(DISC, DISC);
    const context = element.getContext("2d");

    if (!context) {
        return element;
    }

    context.beginPath();
    context.arc(CENTRE, RADIUS, RADIUS - 5, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();

    const glyph = new Path2D(GLYPH[type]);
    const scale = DISC / 24 * 0.46;

    context.save();
    context.translate(CENTRE - (24 * scale) / 2, RADIUS - (24 * scale) / 2);
    context.scale(scale, scale);
    context.strokeStyle = "#ffffff";
    context.lineWidth = 1.7 / scale * 1.7;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke(glyph);
    context.restore();

    drawRings(context, color, revival);

    return element;
}

export function drawImage(image: HTMLImageElement, color: string, revival: boolean) {
    const element = canvas(DISC, DISC);
    const context = element.getContext("2d");

    if (!context) {
        return element;
    }

    const scale = Math.max(DISC / image.width, DISC / image.height);
    const width = image.width * scale;
    const height = image.height * scale;

    context.save();
    context.beginPath();
    context.arc(CENTRE, RADIUS, RADIUS - 5, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    context.drawImage(image, CENTRE - width / 2, RADIUS - height / 2, width, height);
    context.restore();

    drawRings(context, color, revival);

    return element;
}
