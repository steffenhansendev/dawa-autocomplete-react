import {AutocompleteAddressApiClient} from "../AutocompleteAddressApiClient";
import {AutocompleteAddressResponseDto} from "./AutocompleteAddressResponseDto";
import {AutocompleteAddressRequestDto} from "./AutocompleteAddressRequestDto";
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
            "fuzzy": "",    // Not documented but always provided as such in Dataforsyningen's own client
            "per_side": MAX_RESULT_COUNT
        });
        if (reqDto.scope?.type) searchParameters.append("type", reqDto.scope.type);
        if (reqDto.scope?.entranceAddressId) searchParameters.append("adgangsaddresseid", reqDto.scope.entranceAddressId);
        if (reqDto.scope?.leastSpecificity) searchParameters.append("startfra", reqDto.scope.leastSpecificity);
        if (reqDto.scope?.id) searchParameters.append("id", reqDto.scope.id);
        return new URL(`${CONFIGURATION.uri}?${searchParameters.toString()}`, CONFIGURATION.host);
    }
}