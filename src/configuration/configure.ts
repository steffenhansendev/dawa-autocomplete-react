import configFile from "../../dawa-autocomplete-react.config.json";
import {Configuration} from "./Configuration";
import {DeepPartial} from "../shared/DeepPartial";

export let configuration: Configuration = null!

export function configure(override: DeepPartial<Configuration> | undefined): void {
    configuration = {
        placeholder: override?.placeholder ?? configFile.placeholder,
        isAutoFocus: override?.isAutoFocus ?? configFile.isAutofocus,
        errorMessageOnApiClientFailure: override?.errorMessageOnApiClientFailure ?? configFile.errorMessageOnApiClientFailure,
        valueChangedDebounceMilliseconds: override?.valueChangedDebounceMilliseconds ?? configFile.valueChangedDebounceMilliseconds,
        apiRequestDebounceMilliseconds: configFile.apiRequestDebounceMilliseconds,
        loadingMessageOnApiClientRequest: override?.loadingMessageOnApiClientRequest ?? configFile.loadingMessageOnApiClientRequest,
        loadingMessageOnApiClientRequestPendMilliseconds: override?.loadingMessageOnApiClientRequestPendMilliseconds ?? configFile.loadingMessageOnApiClientRequestPendMilliseconds,
        autocompleteAddressApiClient: {
            host: override?.autocompleteAddressApiClient?.host ?? configFile.autocompleteAddressApiHost,
            uri: override?.autocompleteAddressApiClient?.uri ?? configFile.autocompleteAddressApiUri,
            maxResultCount: override?.autocompleteAddressApiClient?.maxResultCount ?? configFile.autocompleteAddressApiMaxResultCount
        },
        styling: {
            textNodeSearchInput: {
                divElementClassNames: configFile.divElementClassNames.concat(
                    override?.styling?.textNodeSearchInput?.divElementClassNames ?? configFile.bootstrapDivElementClassNames
                ),
                inputElementClassNames: configFile.inputElementClassNames.concat(
                    override?.styling?.textNodeSearchInput?.inputElementClassNames ?? configFile.bootstrapInputElementClassNames
                ),
                inputElementValidClassNames: configFile.inputElementValidClassNames.concat(
                    override?.styling?.textNodeSearchInput?.inputElementValidClassNames ?? configFile.bootstrapInputElementValidClassNames
                )
            },
            textNodeSearchInputDropdown: {
                ulElementClassNames: configFile.ulElementClassNames.concat(
                    override?.styling?.textNodeSearchInputDropdown?.ulElementClassNames ?? configFile.bootstrapUlElementClassNames
                ),
                liElementsClassNames: configFile.liElementsClassNames.concat(
                    override?.styling?.textNodeSearchInputDropdown?.liElementsClassNames ?? configFile.bootstrapLiElementsClassNames
                ),
                liElementsActiveClassNames: configFile.liElementsActiveClassNames.concat(
                    override?.styling?.textNodeSearchInputDropdown?.liElementsActiveClassNames ?? configFile.bootstrapLiElementsActiveClassNames
                ),
                liElementsMouseOverClassNames: configFile.liElementsMouseOverClassNames.concat(
                    override?.styling?.textNodeSearchInputDropdown?.liElementsMouseOverClassNames ?? configFile.bootstrapLiElementsMouseOverClassNames
                )
            }
        },
        ariaLabel: override?.ariaLabel ?? configFile.ariaLabel
    };
}