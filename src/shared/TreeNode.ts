import {Result} from "./Result";

export type TreeNode<T> = {
    getChildren(): Promise<
        Result<TreeNode<T>[], Error>
    >;
    isRoot: boolean;
    isLeaf: boolean;
} & T;