import {AutocompleteAddressApiClient} from "./AutocompleteAddressApiClient";
import {AutocompleteAddressRequestDto} from "./dataforsyningen/AutocompleteAddressRequestDto";
import {AutocompleteAddressResponseDto} from "./dataforsyningen/AutocompleteAddressResponseDto";
import {mapSuccess, Result} from "../shared/Result";
import {ResultingCaretTextQueryNode} from "../core/text-node-search/types";
import {Address} from "../core/address/Address";
import {TextNodeTreeService} from "../core/text-node-search/TextNodeTreeService";
import {mapNodeToReqDto} from "./map-node-to-req-dto";
import {mapResDtoToNode} from "./map-res-dto-to-node";

export function createTextNodeTreeService(apiClient: AutocompleteAddressApiClient): TextNodeTreeService<Address> {
    async function getNodesByCaretText(value: string, caretIndexInValue: number): Promise<Result<ResultingCaretTextQueryNode<Address>[], Error>> {
        const reqDto: AutocompleteAddressRequestDto = {value: value, caretIndexInValue: caretIndexInValue};
        const resDtosResult: Result<AutocompleteAddressResponseDto[], Error> = await apiClient.readAutocompleteAddresses(reqDto);
        return _mapResDtosToNodes(resDtosResult);
    }

    async function getNodesByNode(node: ResultingCaretTextQueryNode<Address>): Promise<Result<ResultingCaretTextQueryNode<Address>[], Error>> {
        const reqDto: AutocompleteAddressRequestDto = mapNodeToReqDto(node);
        const resDtosResult: Result<AutocompleteAddressResponseDto[], Error> = await apiClient.readAutocompleteAddresses(reqDto);
        return _mapResDtosToNodes(resDtosResult);
    }

    return {
        getNodesByCaretText,
        getNodesByNode
    }

    function _mapResDtosToNodes(resDtosResult: Result<AutocompleteAddressResponseDto[], Error>): Result<ResultingCaretTextQueryNode<Address>[], Error> {
        return mapSuccess(resDtosResult, (s: AutocompleteAddressResponseDto[]): ResultingCaretTextQueryNode<Address>[] =>
            s.map((dto: AutocompleteAddressResponseDto): ResultingCaretTextQueryNode<Address> => mapResDtoToNode(dto, getNodesByNode))
        );
    }
}