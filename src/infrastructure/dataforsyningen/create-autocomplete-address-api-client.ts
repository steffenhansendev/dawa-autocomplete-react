import {AutocompleteAddressApiClient} from "../AutocompleteAddressApiClient";
import {AutocompleteAddressResponseDto} from "./AutocompleteAddressResponseDto";
import {AutocompleteAddressRequestDto} from "./AutocompleteAddressRequestDto";
import {configuration} from "../../configuration/configure";
import {fail, Result, succeed} from "../../shared/Result";

export function createAutocompleteAddressApiClient(): AutocompleteAddressApiClient {
    const _config = configuration.autocompleteAddressApiClient;
    const _MAX_RESULT_COUNT: string = _config.maxResultCount.toString();

    async function readAutocompleteAddresses(reqDto: AutocompleteAddressRequestDto, abortController?: AbortController): Promise<Result<AutocompleteAddressResponseDto[], Error>> {
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
                throw e;
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
            "per_side": _MAX_RESULT_COUNT
        });
        if (reqDto.scope?.type) searchParameters.append("type", reqDto.scope.type);
        if (reqDto.scope?.entranceAddressId) searchParameters.append("adgangsaddresseid", reqDto.scope.entranceAddressId);
        if (reqDto.scope?.leastSpecificity) searchParameters.append("startfra", reqDto.scope.leastSpecificity);
        if (reqDto.scope?.id) searchParameters.append("id", reqDto.scope.id);
        return new URL(`${_config.uri}?${searchParameters.toString()}`, _config.host);
    }
}