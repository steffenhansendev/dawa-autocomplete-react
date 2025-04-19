import {Result} from "./Result";

export type TreeNode<T> = {
    getChildren(): Promise<
        Result<TreeNode<T>[]>
    >;
    isRoot: boolean;
    isLeaf: boolean;
} & T;