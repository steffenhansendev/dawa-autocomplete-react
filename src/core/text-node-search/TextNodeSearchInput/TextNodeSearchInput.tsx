import React, {JSX, useEffect, useLayoutEffect, useRef, useState} from "react";
import TextNodeSearchInputDropdown from "./TextNodeSearchInputDropdown";
import {TextNodeTree} from "./TextNodeTree";
import {CaretTextQueryNode} from "../types";
import {configuration} from "../../../configuration/configure";
import {CaretTextQuery} from "../CaretTextQuery";
import useInputElementValue from "./useInputElementValue";

interface Props {
    placeholder: string;
    isAutoFocus: boolean;
    textNodeTree: TextNodeTree;
}

function TextNodeSearchInput({
                                 placeholder,
                                 isAutoFocus,
                                 textNodeTree: {
                                     options,
                                     currentNode,
                                     isSettingOptions,
                                     isDestinationFound,
                                     searchForNodes,
                                     goToNode,
                                     resetOptions,
                                     errorMessage
                                 }
                             }: Props): JSX.Element {
    const inputElementRef = useRef<HTMLInputElement>(null);
    const [isInputElementInFocus, setIsInputElementInFocus] = useState<boolean>(false);
    const [activeLiElementIndex, setActiveLiElementIndex] = useState(0);
    const isDelete = useRef<boolean>(false);
    const valueChangedIdRef = useRef<number>(-1);
    const isBlurredWithErrorRef = useRef<boolean>(false);
    const {inputElementValue, setInputByCaretText, setInputByValue} = useInputElementValue(inputElementRef);

    useLayoutEffect((): void => {
        if (!currentNode) {
            return;
        }
        if (isInputElementInFocus && !currentNode.isLeaf) {
            setInputByCaretText(currentNode?.query);
            return;
        }
        setInputByCaretText(currentNode.presentable);
    }, [currentNode, isInputElementInFocus]);

    useEffect((): void => {
        (async (): Promise<void> => {
            if (options.length === 1 && !isDelete.current) {
                await handleChoice(0);
            }
            isDelete.current = false;
        })();
    }, [options]);

    const handleValueChanged = async (value: string, caretIndexInValue: number): Promise<void> => {
        isDelete.current = value.length < inputElementValue.length;
        unsetActiveLiElementIndex();
        setInputByValue(value, caretIndexInValue);
        clearTimeout(valueChangedIdRef.current);
        valueChangedIdRef.current = setTimeout(async (): Promise<void> => {
            const indexOfMatch: number = options.findIndex((n: CaretTextQueryNode): boolean => n.isMatch(value));
            if (options[indexOfMatch]?.isLeaf) {
                await handleChoice(indexOfMatch);
                return;
            }
            await searchForNodes(value, caretIndexInValue);
        }, configuration.valueChangedDebounceMilliseconds);
    };

    const handleChoice = async (choiceIndex: number): Promise<void> => {
        unsetActiveLiElementIndex();
        const choice: CaretTextQueryNode = options[choiceIndex];
        await goToNode(choiceIndex);
        setInputByCaretText(choice.query);
        if (choice.isLeaf) {
            inputElementRef.current?.blur();
        }
    };

    const handleInputBlur = async (): Promise<void> => {
        setIsInputElementInFocus(false);
        if (errorMessage) {
            isBlurredWithErrorRef.current = true;
        }
        await resetOptions();
    };

    const handleInputFocus = async (): Promise<void> => {
        setIsInputElementInFocus(true);
        if (isBlurredWithErrorRef.current) {
            isBlurredWithErrorRef.current = false;
            if (isDestinationFound) {
                return;
            }
            if (currentNode) {
                await handleValueChanged(currentNode.query.value, currentNode.query.caretIndex);
                return;
            }
            await handleValueChanged(inputElementValue, inputElementValue.length);
            return;
        }
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
        switch (e.key) {
            case "ArrowDown": {
                e.preventDefault(); // Fixates caret
                const length: number = options.length;
                if (activeLiElementIndex < length - 1) {
                    const nextActiveLiElementIndex: number = activeLiElementIndex + 1;
                    setActiveLiElementIndex(nextActiveLiElementIndex);
                    const option: CaretTextQueryNode = options[nextActiveLiElementIndex];
                    setInputByCaretText(option.presentable);
                }
                break;
            }
            case "ArrowUp": {
                e.preventDefault(); // Fixates caret
                if (activeLiElementIndex > -1) {
                    const nextActiveLiElementIndex: number = activeLiElementIndex - 1;
                    setActiveLiElementIndex(nextActiveLiElementIndex);
                    if (nextActiveLiElementIndex === -1) {
                        if (!currentNode) {
                            return
                        }
                        setInputByCaretText(currentNode.query)
                    }
                    const option: CaretTextQueryNode = options[nextActiveLiElementIndex];
                    setInputByCaretText(option.presentable);
                }
                break;
            }
            case "Enter":
            case "Tab": {
                await handleChoice(activeLiElementIndex);
            }
        }
    };

    const unsetActiveLiElementIndex = (): void => {
        setActiveLiElementIndex(-1);
    }

    const isDroppedDown: boolean = (isInputElementInFocus && options.length > 0) || isSettingOptions;
    const styling = configuration.styling.textNodeSearchInput;

    const getInputElementClassNames = (): string => {
        let inputElementClassNames: string[] = styling.inputElementClassNames;
        if (isDestinationFound) {
            inputElementClassNames = inputElementClassNames.concat(styling.inputElementValidClassNames);
        }
        return inputElementClassNames.join(" ");
    };

    return (
        <div className={styling.divElementClassNames.join(" ")} aria-live={"polite"} role={"listbox"}>
            <input
                ref={inputElementRef}
                autoFocus={isAutoFocus}
                type="text"
                className={getInputElementClassNames()}
                value={errorMessage ?? inputElementValue}
                placeholder={placeholder}
                onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
                    await handleKeyDown(e);
                }}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
                    e.preventDefault();
                    await handleValueChanged(e.target.value, e.target.selectionStart ?? e.target.value.length);
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                disabled={!!errorMessage && !isDestinationFound}
                aria-placeholder={placeholder}
                aria-label={configuration.ariaLabel}
                aria-expanded={isDroppedDown}
            />
            {isDroppedDown &&
                <TextNodeSearchInputDropdown
                    options={options.map((o: CaretTextQueryNode): CaretTextQuery => o)}
                    activeLiElementIndex={activeLiElementIndex}
                    handleChoice={handleChoice}
                    isLoading={isSettingOptions}/>
            }
        </div>
    );
}

export default TextNodeSearchInput;