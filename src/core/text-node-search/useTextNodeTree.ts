import {MutableRefObject, useEffect, useRef, useState} from "react";
import {TextNodeTreeService} from "./TextNodeTreeService";
import {TextNodeTree} from "./TextNodeSearchInput/TextNodeTree";
import {ResultingCaretTextQuery, ResultingCaretTextQueryNode} from "./types";
import {Cancellation, map, Result} from "../../shared/Result";
import {TreeNode} from "../../shared/TreeNode";
import {configuration} from "../../configuration/configure";

const ERROR_TIMEOUT_SECONDS: number = 3;

export function useTextNodeTree<T>(service: TextNodeTreeService<T>, destinationResultObserver: (destinationResult: T | null) => void): TextNodeTree {
    const [options, setOptions] = useState<ResultingCaretTextQueryNode<T>[]>([]);
    const [currentNode, setCurrentNode] = useState<ResultingCaretTextQueryNode<T> | null>(null);
    const [destinationResult, setDestinationResult] = useState<T | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSettingOptions, setIsSettingOptions] = useState<boolean>(false);
    const setResultIdRef: MutableRefObject<number> = useRef<number>(-1);

    useEffect((): void => {
        destinationResultObserver(destinationResult);
    }, [destinationResult]);

    async function searchForNodes(value: string, caretIndexInValue: number): Promise<void> {
        if (value.length < 1) {
            _reset();
            return;
        }
        const promise: Promise<Result<ResultingCaretTextQueryNode<T>[]>> = service.getNodesByCaretText(value, caretIndexInValue);
        await _setResult(promise);
    }

    async function goToNode(index: number): Promise<void> {
        const node: ResultingCaretTextQueryNode<T> = options[index];
        if (!node) {
            return;
        }
        setCurrentNode(node);
        setDestinationResult(node.result);
        const promise: Promise<Result<ResultingCaretTextQueryNode<T>[]>> = node.getChildren();
        await _setResult(promise);
    }

    async function retry(value: string, caretIndexInValue: number): Promise<void> {
        if (destinationResult) {
            return;
        }
        let promise: Promise<Result<ResultingCaretTextQueryNode<T>[]>> | null = null;
        if (currentNode) {
            promise = currentNode.getChildren();
        } else {
            promise = service.getNodesByCaretText(value, caretIndexInValue);
        }
        await _setResult(promise);
    }

    async function resetOptionsToCurrentNodeChildren(): Promise<void> {
        if (!currentNode) {
            return;
        }
        const result: Promise<Result<ResultingCaretTextQueryNode<T>[]>> = currentNode.getChildren();
        await _setResult(result);
    }

    return {
        options,
        currentNode,
        isSettingOptions,
        isDestinationFound: !!destinationResult,
        searchForNodes,
        goToNode,
        resetOptionsToCurrentNodeChildren,
        errorMessage,
        retry
    }

    async function _setResult(resultPromise: Promise<Result<TreeNode<ResultingCaretTextQuery<T>>[]>>): Promise<void> {
        setResultIdRef.current = setTimeout((): void => {
            setIsSettingOptions(true);
        }, configuration.apiRequestLoadingIndicatorDebounceMilliseconds);
        const result: Result<TreeNode<ResultingCaretTextQueryNode<T>>[]> = await resultPromise;
        map(result,
            (s: TreeNode<ResultingCaretTextQueryNode<T>>[]): void => {
                setOptions(s);
                clearTimeout(setResultIdRef.current);
                setIsSettingOptions(false);
            },
            (f: Error): void => {
                console.error(f);
                setErrorMessage(configuration.errorMessageOnApiClientFailure);
                setTimeout((): void => {
                    setErrorMessage(null);
                }, ERROR_TIMEOUT_SECONDS * 1000);
                clearTimeout(setResultIdRef.current);
                setIsSettingOptions(false);
            },
            (c: Cancellation): void => {
                console.debug(c.reason);
            }
        );
    }

    function _reset(): void {
        setOptions([]);
        setCurrentNode(null);
        setDestinationResult(null);
        setErrorMessage(null);
        setResultIdRef.current = -1;
    }
}