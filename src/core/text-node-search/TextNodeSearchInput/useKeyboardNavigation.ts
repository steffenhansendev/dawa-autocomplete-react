import React, {useEffect, useState} from "react";

export interface KeyboardNavigation {
    readonly optionsIndex: number;
    readonly isNavigating: boolean;

    handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): Promise<void>;

    stop(): void;
}

function useKeyboardNavigation(length: number, confirm: (index: number) => Promise<void>, change: (index: number) => void) {
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        change(index);
    }, [index]);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
        switch (e.key) {
            case "ArrowDown": {
                e.preventDefault(); // Fixates caret
                if (index < length - 1) {
                    setIndex((prevState: number) => prevState + 1);
                }
                break;
            }
            case "ArrowUp": {
                e.preventDefault(); // Fixates caret
                if (index > -1) {
                    setIndex((prevState: number) => prevState - 1);
                }
                break;
            }
            case "Enter":
            case "Tab": {
                await confirm(index);
                break;
            }
        }
    };

    const stop = () => {
        setIndex(-1);
    };

    return {
        optionsIndex: index,
        isNavigating: index > -1,
        handleKeyDown,
        stop
    };
}

export default useKeyboardNavigation;