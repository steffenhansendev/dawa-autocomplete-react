import {AutocompleteAddressResponseDto} from "./dataforsyningen/AutocompleteAddressResponseDto";
import {AutocompleteAddressRequestDto} from "./dataforsyningen/AutocompleteAddressRequestDto";

import {Result} from "../shared/Result";

export interface AutocompleteAddressApiClient {
    readAutocompleteAddresses(requestDto: AutocompleteAddressRequestDto, abortController?: AbortController): Promise<Result<AutocompleteAddressResponseDto[], Error>>
}