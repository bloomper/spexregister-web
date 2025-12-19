import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
    title?: string;
};

export function SE({title, ...props}: Props) {
    return (
        <svg
            viewBox="0 0 28 20"
            width="1em"
            height="1em"
            role="img"
            aria-hidden={title ? undefined : true}
            {...props}
        >
            {title ? <title>{title}</title> : null}
            <rect width="28" height="20" fill="#006AA7"/>
            <rect x="0" y="8" width="28" height="4" fill="#FECC00"/>
            <rect x="8" y="0" width="4" height="20" fill="#FECC00"/>
        </svg>
    );
}

export function US({title, ...props}: Props) {
    return (
        <svg
            viewBox="0 0 28 20"
            width="1em"
            height="1em"
            role="img"
            aria-hidden={title ? undefined : true}
            {...props}
        >
            {title ? <title>{title}</title> : null}

            <rect width="28" height="20" fill="#FFFFFF"/>

            {Array.from({length: 13}).map((_, i) => (
                <rect
                    key={i}
                    x="0"
                    y={(20 / 13) * i}
                    width="28"
                    height={20 / 13}
                    fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
                />
            ))}

            <rect x="0" y="0" width="11.2" height={(20 / 13) * 7} fill="#3C3B6E"/>

            {Array.from({length: 9}).flatMap((_, row) => {
                const starsInRow = row % 2 === 0 ? 6 : 5;
                const y = ((20 / 13) * 7) * (0.12 + (row * 0.86) / 8);
                return Array.from({length: starsInRow}).map((__, col) => {
                    const x =
                        11.2 * (row % 2 === 0 ? 0.12 : 0.20) +
                        (11.2 * (row % 2 === 0 ? 0.76 : 0.68) * col) / (starsInRow - 1);
                    return <circle key={`${row}-${col}`} cx={x} cy={y} r="0.35" fill="#FFFFFF"/>;
                });
            })}
        </svg>
    );
}