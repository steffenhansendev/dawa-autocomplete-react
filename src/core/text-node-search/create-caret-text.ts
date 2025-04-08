import {CaretText} from "./CaretText";

export function createCaretText(value: string, caretIndexInValue?: number): CaretText {
    return {
        value: value,
        caretIndex: caretIndexInValue ?? value.length,
        isMatch(value: string): boolean {
            return value.toLowerCase() === this.value.toLowerCase();
        }
    }
}