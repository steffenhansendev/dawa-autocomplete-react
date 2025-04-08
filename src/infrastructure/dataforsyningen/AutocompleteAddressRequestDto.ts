import {AutocompleteAddressEntityTypeDto} from "./AutocompleteAddressResponseDto";

export type AutocompleteAddressRequestDto = Readonly<_AutocompleteAddressRequestDto>;

interface _AutocompleteAddressRequestDto {
    value: string;
    caretIndexInValue: number;
    scope?: {
        type?: AutocompleteAddressEntityTypeDto;
        entranceAddressId?: string;
        leastSpecificity?: AutocompleteAddressEntityTypeDto;
        id?: string;
    }
}