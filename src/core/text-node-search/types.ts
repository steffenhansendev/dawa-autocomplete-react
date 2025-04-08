import {TreeNode} from "../../shared/TreeNode";
import {CaretTextQuery} from "./CaretTextQuery";

export type ResultingCaretTextQueryNode<T> = TreeNode<ResultingCaretTextQuery<T>>;

export type ResultingCaretTextQuery<T> = CaretTextQuery & { result: T | null };

export type CaretTextQueryNode = Omit<TreeNode<CaretTextQuery>, "getChildren">;