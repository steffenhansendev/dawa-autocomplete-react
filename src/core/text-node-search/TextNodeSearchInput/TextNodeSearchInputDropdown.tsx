import React, {ReactElement} from "react";
import {CaretTextQuery} from "../CaretTextQuery";
import {configuration} from "../../../configuration/configure";
import EllipsisSpinnerSpans from "../../../shared/EllipsisSpinnerSpans";

const UL_ELEMENT_STYLE: React.CSSProperties = {width: "100%", cursor: "pointer", display: "block"};

interface Props {
    options: CaretTextQuery[];
    isLoading: boolean;
    activeLiElementIndex: number,
    handleChoice: (index: number) => Promise<void>;
}

function TextNodeSearchInputDropdown({
                                         options,
                                         isLoading,
                                         activeLiElementIndex,
                                         handleChoice
                                     }: Props): ReactElement {
    const STYLING = configuration.styling.textNodeSearchInputDropdown;
    const LI_ELEMENTS_CLASS_NAMES: string[] = STYLING.liElementsClassNames;

    const getLiElementClassNames = (i: number): string => {
        let liElementClassNames: string[] = LI_ELEMENTS_CLASS_NAMES;
        if (activeLiElementIndex === i) {
            liElementClassNames = liElementClassNames.concat(STYLING.liElementsActiveClassNames);
        }
        return liElementClassNames.join(" ");
    };

    const choose = async (e: React.MouseEvent<HTMLLIElement> | React.TouchEvent<HTMLLIElement>, i: number): Promise<void> => {
        e.preventDefault();
        await handleChoice(i);
        e.currentTarget?.classList.remove(...STYLING.liElementsMouseOverClassNames);
    }

    return (
        <ul
            // Rather than a list of <Option> elements, <li> and <ul> were chosen because:
            // Using <Option> will cause the dropdown to never show again whenever an option is chosen.
            // Using <Option> offers no way of distinguishing whether an option was chosen or the <Input>'s value was changed.
            className={STYLING.ulElementClassNames.join(" ")}
            style={UL_ELEMENT_STYLE}>
            {
                isLoading
                    ? <li className={LI_ELEMENTS_CLASS_NAMES.join(" ")}>
                        {configuration.loadingMessageOnApiClientRequest + " "}
                        <EllipsisSpinnerSpans dotCount={3} intervalInMilliseconds={150}/>
                    </li>
                    : options.map((option: CaretTextQuery, i: number): ReactElement => {
                        return <li
                            className={getLiElementClassNames(i)}
                            onMouseOver={(e: React.MouseEvent<HTMLLIElement>): void => {
                                e.currentTarget.classList.add(...STYLING.liElementsMouseOverClassNames);
                            }}
                            onMouseOut={(e: React.MouseEvent<HTMLLIElement>): void => {
                                e.currentTarget.classList.remove(...STYLING.liElementsMouseOverClassNames);
                            }}
                            onMouseDown={async (e: React.MouseEvent<HTMLLIElement>): Promise<void> => {
                                await choose(e, i);
                            }}
                            onTouchEnd={async (e: React.TouchEvent<HTMLLIElement>): Promise<void> => {
                                await choose(e, i);
                            }}
                            key={option.query.value}
                            aria-selected={activeLiElementIndex === i}
                            role={"option"}
                        >
                            {option.presentable.value}
                        </li>;
                    })}
        </ul>
    );
}


export default TextNodeSearchInputDropdown;