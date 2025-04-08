import {RefObject, useLayoutEffect, useRef, useState} from "react";
import {CaretText} from "../CaretText";

function useInputElementValue(inputElementRef: RefObject<HTMLInputElement>) {
    const [inputElementValue, setInputElementValue] = useState<string>(""); //
    const pendingCaretIndexRef = useRef<number | null>(null);

    useLayoutEffect((): void => {
        if (!inputElementRef.current || !pendingCaretIndexRef.current) {
            return
        }
        inputElementRef.current.selectionStart = pendingCaretIndexRef.current;
        inputElementRef.current.selectionEnd = pendingCaretIndexRef.current;
    }, [inputElementValue]);

    const setInputByCaretText = (caretText: CaretText): void => {
        setInputByValue(caretText.value, caretText.caretIndex);
    }

    const setInputByValue = (value: string, caretIndex?: number): void => {
        setInputElementValue(value);
        if (!caretIndex) {
            return;
        }
        pendingCaretIndexRef.current = caretIndex;
    }

    return {
        inputElementValue,
        setInputByCaretText,
        setInputByValue
    }
}

export default useInputElementValue;