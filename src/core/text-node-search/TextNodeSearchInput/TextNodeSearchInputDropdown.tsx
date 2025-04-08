import React, {JSX} from "react";
import {CaretTextQuery} from "../CaretTextQuery";
import {configuration} from "../../../configuration/configure";
import EllipsisSpinnerSpans from "../../../shared/EllipsisSpinnerSpans";

const UL_ELEMENT_STYLE: React.CSSProperties = {width: "100%", cursor: "pointer", display: "block"};

interface Props {
    options: CaretTextQuery[];
    isLoading: boolean;
    activeLiElementIndex: number,
    handleChoice: (choiceIndex: number) => Promise<void>;
}

function TextNodeSearchInputDropdown({
                                         options,
                                         isLoading,
                                         activeLiElementIndex,
                                         handleChoice
                                     }: Props): JSX.Element {
    const styling = configuration.styling.textNodeSearchInputDropdown;
    const LI_ELEMENTS_CLASS_NAMES: string[] = styling.liElementsClassNames;

    const getLiElementClassNames = (i: number): string => {
        let liElementClassNames: string[] = LI_ELEMENTS_CLASS_NAMES;
        if (activeLiElementIndex === i) {
            liElementClassNames = liElementClassNames.concat(styling.liElementsActiveClassNames);
        }
        return liElementClassNames.join(" ");
    };

    return (
        <ul
            // Rather than a list of <Option> elements, <li> and <ul> were chosen because:
            // Using <Option> will cause the dropdown to never show again whenever an option is chosen.
            // Using <Option> offers no way of distinguishing whether an option was chosen or the <Input>'s value was changed.
            className={styling.ulElementClassNames.join(" ")}
            style={UL_ELEMENT_STYLE}>
            {
                isLoading
                    ? <li className={LI_ELEMENTS_CLASS_NAMES.join(" ")}>
                        {configuration.loadingMessageOnApiClientRequest + " "}
                        <EllipsisSpinnerSpans dotCount={3} intervalInMilliseconds={150}/>
                    </li>
                    : options.map((option: CaretTextQuery, i: number) => {
                        return <li
                            className={getLiElementClassNames(i)}
                            onMouseOver={(e): void => {
                                e.currentTarget.classList.add(...styling.liElementsMouseOverClassNames);
                            }}
                            onMouseOut={(e): void => {
                                e.currentTarget.classList.remove(...styling.liElementsMouseOverClassNames);
                            }}
                            onMouseDown={async (e) => {
                                e.preventDefault();
                                await handleChoice(i);
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
