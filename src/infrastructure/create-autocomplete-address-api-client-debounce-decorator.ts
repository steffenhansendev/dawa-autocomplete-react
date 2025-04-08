import {AutocompleteAddressApiClient} from "./AutocompleteAddressApiClient";
import {configuration} from "../configuration/configure";
import {AutocompleteAddressRequestDto} from "./dataforsyningen/AutocompleteAddressRequestDto";
import {Result} from "../shared/Result";
import {AutocompleteAddressResponseDto} from "./dataforsyningen/AutocompleteAddressResponseDto";

export function createAutocompleteAddressApiClientDebounceDecorator(decoratee: AutocompleteAddressApiClient): AutocompleteAddressApiClient {
    let _abortController: AbortController | null = null;
    let _id: number = 0;
    let _timeoutId: number = 0;

    function readAutocompleteAddresses(requestDto: AutocompleteAddressRequestDto): Promise<Result<AutocompleteAddressResponseDto[], Error>> {
        _abortController?.abort();
        _abortController = new AbortController();
        const abortController: AbortController = _abortController;
        const id: number = ++_id;
        clearTimeout(_timeoutId);
        return new Promise<Result<AutocompleteAddressResponseDto[], Error>>((resolve): void => {
            _timeoutId = setTimeout(async (): Promise<void> => {
                try {
                    const result: Result<AutocompleteAddressResponseDto[], Error> = await decoratee.readAutocompleteAddresses(requestDto, abortController);
                    if (id > _id) {
                        return;
                    }
                    resolve(result);
                } catch (e: unknown) {
                    if (abortController.signal.aborted) {
                        return;
                    }
                    throw e;
                }
            }, configuration.apiRequestDebounceMilliseconds);
        });
    }

    return {
        readAutocompleteAddresses
    }
}