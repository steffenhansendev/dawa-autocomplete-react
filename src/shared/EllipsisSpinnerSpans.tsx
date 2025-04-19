import React, {ReactElement, useEffect, useState} from "react";

interface Props {
    dotCount: number;
    intervalInMilliseconds: number
}

function EllipsisSpinnerSpans({dotCount = 3, intervalInMilliseconds = 250}: Props): ReactElement {
    const [visibleDotIndex, setVisibleDotIndex] = useState<number>(0);

    useEffect((): () => void => {
        const intervalId: number = window.setInterval((): void => {
            setVisibleDotIndex((prev: number): number => (prev + 1) % dotCount);
        }, intervalInMilliseconds);
        return (): void => clearInterval(intervalId);
    }, [dotCount, intervalInMilliseconds]);

    return (
        <div
            style={{display: "inline-block"}}
            role={"status"}
            aria-label={"Loading"}
        >
            {Array.from({length: dotCount}).map((_, i: number): ReactElement => {
                return <span
                    key={i}
                    style={i === visibleDotIndex ? {visibility: "visible"} : {visibility: "hidden"}}
                >
                    .
                </span>
            })
            }
        </div>
    );
}

export default EllipsisSpinnerSpans;