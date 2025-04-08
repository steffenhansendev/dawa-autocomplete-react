export interface CaretText {
    readonly value: string;
    readonly caretIndex: number;

    isMatch(value: string): boolean;
}