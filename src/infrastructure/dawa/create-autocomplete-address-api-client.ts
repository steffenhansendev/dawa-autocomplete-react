import {AutocompleteAddressApiClient} from "../AutocompleteAddressApiClient";
import {AutocompleteAddressResponseDto} from "./AutocompleteAddressResponseDto";
import {AutocompleteAddressRequestDto, AutocompleteAddressRequestDtoScope} from "./AutocompleteAddressRequestDto";
import {configuration} from "../../configuration/configure";
import {cancelStaleRequest, fail, Result, succeed} from "../../shared/Result";

export function createAutocompleteAddressApiClient(): AutocompleteAddressApiClient {
    const CONFIGURATION = configuration.autocompleteAddressApiClient;
    const MAX_RESULT_COUNT: string = CONFIGURATION.maxResultCount.toString();

    async function readAutocompleteAddresses(reqDto: AutocompleteAddressRequestDto, abortController?: AbortController): Promise<Result<AutocompleteAddressResponseDto[]>> {
        const url: URL = _createAutocompleteUrl(reqDto);
        try {
            const response: Response = await fetch(url, {signal: abortController?.signal});
            if (!response.ok) {
                return fail(new Error(`HTTP ${response.status}: ${response.statusText}.`));
            }
            try {
                const resDtos: AutocompleteAddressResponseDto[] = await response.json();
                return succeed(resDtos);
            } catch (e: unknown) {
                return fail(new Error(`Parsing the response as DTOs failed: ${e}.`));
            }
        } catch (e: unknown) {
            if (abortController?.signal.aborted) {
                return cancelStaleRequest();
            }
            return fail(new Error(`Fetch failed: ${e}.`));
        }
    }

    return {
        readAutocompleteAddresses
    }

    function _createAutocompleteUrl(reqDto: AutocompleteAddressRequestDto): URL {
        const searchParameters: URLSearchParams = new URLSearchParams({
            "q": reqDto.value,
            "caretpos": reqDto.caretIndexInValue.toString(),
            "fuzzy": "",    // Not documented but always provided as such in DAWA's own client
            "per_side": MAX_RESULT_COUNT
        });
        if (reqDto?.type) searchParameters.append("type", reqDto.type);
        _appendScope(searchParameters, reqDto.scope);
        return new URL(`${CONFIGURATION.uri}?${searchParameters.toString()}`, CONFIGURATION.host);
    }

    function _appendScope(searchParameters: URLSearchParams, scopeDto?: AutocompleteAddressRequestDtoScope): URLSearchParams {
        if (scopeDto) {
            if (scopeDto.entranceAddressId) searchParameters.append("adgangsaddresseid", scopeDto.entranceAddressId);
            if (scopeDto.leastSpecificity) searchParameters.append("startfra", scopeDto.leastSpecificity);
            if (scopeDto.zipCodes.length > 0) searchParameters.append("postnr", scopeDto.zipCodes.join("|"));
            if (scopeDto.municipalityCodes.length > 0) searchParameters.append("kommunekode", scopeDto.municipalityCodes.join("|"));
        }
        return searchParameters;
    }
}