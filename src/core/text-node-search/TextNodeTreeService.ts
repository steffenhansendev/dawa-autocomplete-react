import {Result} from "../../shared/Result";
import {ResultingCaretTextQueryNode} from "./types";
import {Address} from "../address/Address";

export interface TextNodeTreeService<T> {
    getNodesByCaretText(value: string, caretIndexInValue: number): Promise<Result<ResultingCaretTextQueryNode<T>[], Error>>;

    getNodesByNode(node: ResultingCaretTextQueryNode<Address>): Promise<Result<ResultingCaretTextQueryNode<Address>[], Error>>;
}