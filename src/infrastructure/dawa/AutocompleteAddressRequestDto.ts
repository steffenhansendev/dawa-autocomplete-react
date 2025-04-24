import {AutocompleteAddressEntityTypeDto} from "./AutocompleteAddressResponseDto";

export type AutocompleteAddressRequestDto = Readonly<_AutocompleteAddressRequestDto>;

interface _AutocompleteAddressRequestDto {
    value: string;
    caretIndexInValue: number;
    type?: AutocompleteAddressEntityTypeDto;
    scope?: AutocompleteAddressRequestDtoScope;
}

export type AutocompleteAddressRequestDtoScope = Readonly<_AutocompleteAddressRequestDtoScope>;

export interface _AutocompleteAddressRequestDtoScope {
    entranceAddressId?: string;
    leastSpecificity?: AutocompleteAddressEntityTypeDto;
    zipCodes: string[];
    municipalityCodes: string[];
}