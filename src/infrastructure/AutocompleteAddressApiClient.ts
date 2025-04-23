import {AutocompleteAddressResponseDto} from "./dawa/AutocompleteAddressResponseDto";
import {AutocompleteAddressRequestDto} from "./dawa/AutocompleteAddressRequestDto";

import {Result} from "../shared/Result";

export interface AutocompleteAddressApiClient {
    readAutocompleteAddresses(requestDto: AutocompleteAddressRequestDto, abortController?: AbortController): Promise<Result<AutocompleteAddressResponseDto[]>>
}