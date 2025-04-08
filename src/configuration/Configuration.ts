export interface Configuration {
    readonly placeholder: string;
    readonly isAutoFocus: boolean;
    readonly errorMessageOnApiClientFailure: string;
    readonly loadingMessageOnApiClientRequest: string;
    readonly loadingMessageOnApiClientRequestPendMilliseconds: number;
    readonly valueChangedDebounceMilliseconds: number;
    readonly apiRequestDebounceMilliseconds: number;
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