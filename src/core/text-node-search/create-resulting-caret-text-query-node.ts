import {CaretText} from "./CaretText";
import {Result, succeed} from "../../shared/Result";
import {ResultingCaretTextQueryNode} from "./types";

export function createResultingCaretTextQueryNode<T>(
    isRoot: boolean,
    isLeaf: boolean,
    getChildren: (node: ResultingCaretTextQueryNode<T>) => Promise<Result<ResultingCaretTextQueryNode<T>[]>>,
    query: CaretText,
    presentable: CaretText,
    result: T | null
): ResultingCaretTextQueryNode<T> {
    let _children: Result<ResultingCaretTextQueryNode<T>[]> | null = null;
    return {
        isRoot: isRoot,
        isLeaf: isLeaf,
        async getChildren(): Promise<Result<ResultingCaretTextQueryNode<T>[]>> {
            if (this.isLeaf) {
                return succeed([]);
            }
            if (!_children || _children.type === "failure") {
                _children = await getChildren(this);
            }
            return _children;
        },

        query: query,
        presentable: presentable,
        isMatch(value: string): boolean {
            return presentable.isMatch(value) || query.isMatch(value);
        },

        result: result,
    }
}