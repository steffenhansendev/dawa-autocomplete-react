import React, {MutableRefObject, ReactElement, useEffect, useRef, useState} from "react";
import TextNodeSearchInputDropdown from "./TextNodeSearchInputDropdown";
import {TextNodeTree} from "./TextNodeTree";
import {CaretTextQueryNode} from "../types";
import {configuration} from "../../../configuration/configure";
import {CaretTextQuery} from "../CaretTextQuery";
import useInputElementValue, {InputElementValue} from "./useInputElementValue";
import useKeyboardNavigation, {KeyboardNavigation} from "./useKeyboardNavigation";

const RE_BLUR_ON_FOCUS_THRESHOLD_MILLiSECONDS: number = 100;

interface Props {
    placeholder: string;
    isAutoFocus: boolean;
    textNodeTree: TextNodeTree;
}

function TextNodeSearchInput({
                                 placeholder,
                                 isAutoFocus,
                                 textNodeTree: {
                                     currentNode,
                                     errorMessage,
                                     goToNode,
                                     isDestinationFound,
                                     isSettingOptions,
                                     options,
                                     resetOptionsToCurrentNodeChildren,
                                     retry,
                                     searchForNodes
                                 }
                             }: Props): ReactElement {
    const inputElementRef: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
    const isDelete: MutableRefObject<boolean> = useRef<boolean>(false);
    const isBlurredWithErrorRef: MutableRefObject<boolean> = useRef<boolean>(false);
    const blurTimestampRef: MutableRefObject<number> = useRef<number>(-1);
    const [isInFocusTracker, setIsInFocusTracker] = useState<boolean>(false);
    const {
        inputElementValue,
        setInputByNode,
        setInputByValue,
    }: InputElementValue = useInputElementValue(inputElementRef);
    const keyboardNavigation: KeyboardNavigation = useKeyboardNavigation(options.length, goToNode, (index: number) => {
        setInputByNode({node: options[index], isKeyboardNavigation: true});
    });

    useEffect((): void => {
        keyboardNavigation.stop();
        setInputByNode({node: currentNode});
        if (currentNode?.isLeaf) {
            inputElementRef.current?.blur();
        }
    }, [currentNode]);

    useEffect(() => {
        if (!keyboardNavigation.isNavigating) {
            setInputByNode({node: currentNode});
        }
    }, [keyboardNavigation.isNavigating]);

    useEffect((): void => {
        (async (): Promise<void> => {
            const isAutomaticChoice: boolean = options.length === 1 && options[0].isLeaf && !isDelete.current;
            if (isAutomaticChoice) {
                await goToNode(0);
            }
            isDelete.current = false;
        })();
    }, [options]);

    const handleValueChanged = async (value: string, caretIndexInValue: number): Promise<void> => {
        isDelete.current = value.length < inputElementValue.length;
        keyboardNavigation.stop();
        const match: CaretTextQueryNode | undefined = options.find((n: CaretTextQueryNode): boolean => n.isMatch(value));
        if (match && !isDelete.current) {
            // Case correction
            setInputByNode({node: match});
        } else {
            setInputByValue(value, caretIndexInValue);
        }
        await searchForNodes(value, caretIndexInValue);
    };

    async function handleInputFocus(): Promise<void> {
        const blurTimestampDelta: number = Date.now() - blurTimestampRef.current;
        if (blurTimestampDelta < RE_BLUR_ON_FOCUS_THRESHOLD_MILLiSECONDS) {
            // Rejecting Mobile autofocus after blur
            inputElementRef.current?.blur();
            return;
        }
        setIsInFocusTracker(true);
        if (isBlurredWithErrorRef.current) {
            isBlurredWithErrorRef.current = false;
            if (isDestinationFound) {
                return;
            }
            await retry(inputElementValue, inputElementRef.current?.selectionStart ?? inputElementValue.length);
        }
        if (keyboardNavigation.isNavigating) {
            setInputByNode({node: options[keyboardNavigation.optionsIndex], isKeyboardNavigation: true});
            return;
        }
        setInputByNode({node: currentNode});
        await resetOptionsToCurrentNodeChildren();
    }

    async function handleInputBlur(): Promise<void> {
        setIsInFocusTracker(false);
        blurTimestampRef.current = Date.now();
        if (errorMessage) {
            isBlurredWithErrorRef.current = true;
        }
        setInputByNode({node: currentNode});
    }

    const isDroppedDown: boolean = !errorMessage && (isSettingOptions || isInFocusTracker && options.length > 0);

    const STYLING = configuration.styling.textNodeSearchInput;

    const getInputElementClassNames = (): string => {
        let inputElementClassNames: string[] = STYLING.inputElementClassNames;
        if (isDestinationFound) {
            inputElementClassNames = inputElementClassNames.concat(STYLING.inputElementValidClassNames);
        }
        return inputElementClassNames.join(" ");
    };

    return (
        <div className={STYLING.divElementClassNames.join(" ")} aria-live={"polite"} role={"listbox"}>
            <input
                ref={inputElementRef}
                autoFocus={isAutoFocus}
                autoCorrect={"off"}
                autoCapitalize={"off"}
                spellCheck={false}
                type="text"
                className={getInputElementClassNames()}
                value={errorMessage ?? inputElementValue}
                placeholder={placeholder}
                onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
                    await keyboardNavigation.handleKeyDown(e);
                }}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
                    await handleValueChanged(e.target.value, e.target.selectionStart ?? e.target.value.length);
                }}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                disabled={!!errorMessage && !isDestinationFound}
                aria-placeholder={placeholder}
                aria-label={configuration.ariaLabel}
                aria-expanded={isDroppedDown}
            />
            {isDroppedDown && <TextNodeSearchInputDropdown
                options={options.map((n: CaretTextQueryNode): CaretTextQuery => n)}
                activeLiElementIndex={keyboardNavigation.optionsIndex}
                handleChoice={goToNode}
                isLoading={isSettingOptions}/>
            }
        </div>
    );
}

export default TextNodeSearchInput;