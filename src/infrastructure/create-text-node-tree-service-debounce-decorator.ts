import {configuration} from "../configuration/configure";
import {cancelStaleRequest, Result} from "../shared/Result";
import {TextNodeTreeService} from "../core/text-node-search/TextNodeTreeService";
import {ResultingCaretTextQueryNode} from "../core/text-node-search/types";

export function createTextNodeTreeServiceDebounceDecorator<T>(decoratee: TextNodeTreeService<T>): TextNodeTreeService<T> {
    let _abortController: AbortController | null = null;
    let _id: number = 0;
    let _timeoutId: number = 0;
    let _resolve: ((value: Result<ResultingCaretTextQueryNode<T>[]>) => void) | null = null;

    function getNodesByCaretText(value: string, caretIndexInValue: number): Promise<Result<ResultingCaretTextQueryNode<T>[]>> {
        _abortController?.abort();
        _abortController = new AbortController();
        const abortController: AbortController = _abortController;
        const id: number = ++_id;
        clearTimeout(_timeoutId);
        if (_resolve) {
            _resolve(cancelStaleRequest());
            _resolve = null;
        }
        return new Promise<Result<ResultingCaretTextQueryNode<T>[]>>((resolve): void => {
            _timeoutId = setTimeout(async (): Promise<void> => {
                const result: Result<ResultingCaretTextQueryNode<T>[]> = await decoratee.getNodesByCaretText(value, caretIndexInValue, abortController);
                if (id < _id) {
                    resolve(cancelStaleRequest());
                    return;
                }
                resolve(result);
            }, configuration.apiRequestTypingDebounceMilliseconds);
            _resolve = resolve;
        });
    }

    return {
        getNodesByCaretText,
        getNodesByNode: decoratee.getNodesByNode
    }
}