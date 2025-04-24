export interface Configuration {
    readonly placeholder: string;
    readonly isAutoFocus: boolean;
    readonly zipCodesSelection: string[];
    readonly municipalityCodesSelection: string[];
    readonly errorMessageOnApiClientFailure: string;
    readonly loadingMessageOnApiClientRequest: string;
    readonly apiRequestLoadingIndicatorDebounceMilliseconds: number;
    readonly apiRequestTypingDebounceMilliseconds: number;
    readonly autocompleteAddressApiClient: {
        readonly host: string;
        readonly uri: string;
        readonly maxResultCount: number;
    };
    readonly styling: {
        readonly textNodeSearchInput: {
            readonly divElementClassNames: string[];
            readonly inputElementClassNames: string[];
            readonly inputElementValidClassNames: string[];
        };
        readonly textNodeSearchInputDropdown: {
            readonly ulElementClassNames: string[];
            readonly liElementsClassNames: string[];
            readonly liElementsActiveClassNames: string[];
            readonly liElementsMouseOverClassNames: string[];
        };
    };
    readonly ariaLabel: string
}