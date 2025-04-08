import {CaretText} from "./CaretText";

export interface CaretTextQuery {
    readonly query: CaretText;
    readonly presentable: CaretText;

    isMatch(value: string): boolean;
}