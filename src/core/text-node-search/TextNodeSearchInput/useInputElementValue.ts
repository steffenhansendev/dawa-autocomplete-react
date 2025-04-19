import {MutableRefObject, useLayoutEffect, useRef, useState} from "react";
import {CaretText} from "../CaretText";
import {CaretTextQueryNode} from "../types";

export interface InputElementValue {
    readonly inputElementValue: string;

    setInputByNode({node, isKeyboardNavigation}: {
        node: CaretTextQueryNode | null,
        isKeyboardNavigation?: boolean
    }): void;

    setInputByValue(value: string, caretIndex: number): void;
}

function useInputElementValue(inputElementRef: MutableRefObject<HTMLInputElement | null>): InputElementValue {
    const [inputElementValue, setInputElementValue] = useState<string>("");
    const pendingCaretIndexRef: MutableRefObject<number | null> = useRef<number | null>(null);

    // The element must exist before the caret can be set.
    useLayoutEffect((): void => {
        if (!inputElementRef.current || !pendingCaretIndexRef.current) {
            return
        }
        // Supporting mobile
        setTimeout(() => {
            if (!inputElementRef.current || !pendingCaretIndexRef.current) {
                return
            }
            inputElementRef.current.selectionStart = pendingCaretIndexRef.current;
            inputElementRef.current.selectionEnd = pendingCaretIndexRef.current;
        }, 0);
    }, [inputElementValue]);

    function setInputByNode({node, isKeyboardNavigation = false}: {
        node: CaretTextQueryNode | null,
        isKeyboardNavigation?: boolean
    }): void {
        if (!node) {
            return;
        }
        if (_isInputElementInFocus() && !isKeyboardNavigation) {
            setInputCaretText(node.query);
        } else {
            setInputCaretText(node.presentable);
        }
    }

    function setInputCaretText(caretText: CaretText): void {
        setInputByValue(caretText.value, caretText.caretIndex);
    }

    function setInputByValue(value: string, caretIndex: number): void {
        setInputElementValue(value);
        pendingCaretIndexRef.current = caretIndex;
    }

    return {
        inputElementValue,
        setInputByNode,
        setInputByValue
    }

    function _isInputElementInFocus(): boolean {
        return document?.activeElement === inputElementRef.current;
    }
}

export default useInputElementValue;