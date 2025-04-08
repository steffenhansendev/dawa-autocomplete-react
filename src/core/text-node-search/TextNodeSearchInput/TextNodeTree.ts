import {CaretTextQueryNode} from "../types";

export interface TextNodeTree {
    readonly options: CaretTextQueryNode[];
    readonly currentNode: CaretTextQueryNode | null;
    readonly isSettingOptions: boolean;
    isDestinationFound: boolean;

    searchForNodes(value: string, caretIndexInValue: number): Promise<void>;

    goToNode(index: number): Promise<void>;

    resetOptions(): Promise<void>;

    readonly errorMessage: string | null;
}