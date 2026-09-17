"use client";

import {useEffect, useRef} from "react";
import ForceGraph3D, {ForceGraphMethods} from "react-force-graph-3d";
import * as THREE from "three";
import {GraphNodeType} from "@/gql/schema";
import {drawCaption, drawFallback, drawImage} from "@/components/graph/graph-node-art.client";

export type ForceNode = {
    id: string;
    label: string;
    caption: string;
    type: GraphNodeType;
    color: string;
    size: number;
    revival: boolean;
    imageUrl?: string | null;
    x?: number;
    y?: number;
    z?: number;
};

export type ForceLink = {
    source: string;
    target: string;
};

type ForceProps = {
    width: number;
    height: number;
    nodes: ForceNode[];
    links: ForceLink[];
    background: string;
    linkColor: string;
    captionInk: string;
    focusId: string | null;
    onNodeClick: (id: string) => void;
};

const textures = new Map<string, THREE.CanvasTexture>();

function textureFor(key: string, draw: () => HTMLCanvasElement) {
    const cached = textures.get(key);

    if (cached) {
        return cached;
    }

    const texture = new THREE.CanvasTexture(draw());

    textures.set(key, texture);

    return texture;
}

const CAPTION_SCREEN_HEIGHT = 0.03;

function discFor(node: ForceNode) {
    const key = `${node.type}:${node.color}:${node.revival}`;
    const material = new THREE.SpriteMaterial({
        map: textureFor(key, () => drawFallback(node.type, node.color, node.revival)),
        transparent: true,
        alphaTest: 0.5,
    });
    const sprite = new THREE.Sprite(material);

    sprite.scale.set(node.size, node.size, 1);

    if (!node.imageUrl) {
        return sprite;
    }

    const imageKey = `${node.imageUrl}:${node.color}:${node.revival}`;
    const cached = textures.get(imageKey);

    if (cached) {
        material.map = cached;

        return sprite;
    }

    const image = new Image();

    image.crossOrigin = "anonymous";
    image.onload = () => {
        const texture = new THREE.CanvasTexture(drawImage(image, node.color, node.revival));

        textures.set(imageKey, texture);
        material.map = texture;
        material.needsUpdate = true;
    };
    image.src = node.imageUrl;

    return sprite;
}

function captionFor(node: ForceNode, ink: string) {
    const key = `caption:${node.caption}:${node.color}:${ink}`;
    let aspect = 1;

    const texture = textureFor(key, () => {
        const drawn = drawCaption(node.caption, node.color, ink);

        aspect = drawn.aspect;

        return drawn.canvas;
    });

    if (texture.image instanceof HTMLCanvasElement) {
        aspect = texture.image.width / texture.image.height;
    }

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        sizeAttenuation: false,
    }));

    sprite.renderOrder = 10;

    sprite.scale.set(CAPTION_SCREEN_HEIGHT * aspect, CAPTION_SCREEN_HEIGHT, 1);
    sprite.position.set(0, -(node.size / 2 + 2), 0);

    return sprite;
}

function objectFor(node: ForceNode, ink: string) {
    const group = new THREE.Group();

    group.add(discFor(node));
    group.add(captionFor(node, ink));

    return group;
}

export default function GraphForce3D({
                                         width, height, nodes, links, background, linkColor, captionInk,
                                         focusId, onNodeClick,
                                     }: ForceProps) {
    const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
    const movedRef = useRef(false);

    useEffect(() => () => {
        for (const texture of textures.values()) {
            texture.dispose();
        }

        textures.clear();
    }, []);
    const signature = nodes.map((node) => node.id).join("|");
    const fittedRef = useRef("");

    useEffect(() => {
        movedRef.current = false;
    }, [signature]);

    const handleEngineStop = () => {
        if (movedRef.current || fittedRef.current === signature) {
            return;
        }

        fittedRef.current = signature;
        graphRef.current?.zoomToFit(600, 40);
    };


    useEffect(() => {
        const node = focusId ? nodes.find((candidate) => candidate.id === focusId) : undefined;

        if (!node || node.x === undefined || node.y === undefined || node.z === undefined) {
            return;
        }

        const distance = 120;
        const spread = Math.hypot(node.x, node.y, node.z) || 1;
        const ratio = 1 + distance / spread;

        graphRef.current?.cameraPosition(
            {x: node.x * ratio, y: node.y * ratio, z: node.z * ratio},
            {x: node.x, y: node.y, z: node.z},
            1200,
        );
    }, [focusId, nodes]);

    return (
        <div
            onWheelCapture={() => {
                movedRef.current = true;
            }}
            onPointerDownCapture={() => {
                movedRef.current = true;
            }}
        >
        <ForceGraph3D
            ref={graphRef}
            width={width}
            height={height}
            graphData={{nodes, links}}
            backgroundColor={background}
            linkColor={() => linkColor}
            linkOpacity={0.55}
            linkWidth={0.4}
            nodeLabel="label"
            nodeThreeObject={(node: object) => objectFor(node as ForceNode, captionInk)}
            onNodeClick={(node) => onNodeClick(String(node.id))}
            showNavInfo={false}
            enableNodeDrag
            onNodeDragEnd={(node) => {
                node.fx = node.x;
                node.fy = node.y;
                node.fz = node.z;
            }}
            d3VelocityDecay={0.3}
            cooldownTime={5000}
            onEngineStop={handleEngineStop}
        />
        </div>
    );
}
