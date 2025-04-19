import {Result} from "../../shared/Result";
import {ResultingCaretTextQueryNode} from "./types";

export interface TextNodeTreeService<T> {
    getNodesByCaretText(value: string, caretIndexInValue: number, abortController?: AbortController): Promise<Result<ResultingCaretTextQueryNode<T>[]>>;

    getNodesByNode(node: ResultingCaretTextQueryNode<T>): Promise<Result<ResultingCaretTextQueryNode<T>[]>>;
}