import {AutocompleteAddressApiClient} from "./AutocompleteAddressApiClient";
import {AutocompleteAddressRequestDto} from "./dawa/AutocompleteAddressRequestDto";
import {AutocompleteAddressResponseDto} from "./dawa/AutocompleteAddressResponseDto";
import {mapSuccess, Result} from "../shared/Result";
import {ResultingCaretTextQueryNode} from "../core/text-node-search/types";
import {Address} from "../core/address/Address";
import {TextNodeTreeService} from "../core/text-node-search/TextNodeTreeService";
import {mapResDtoToNode} from "./map-res-dto-to-node";
import {createToReqDtoMapper, ToReqDtoMapper} from "./create-to-req-dto-mapper";

export function createAddressTextNodeTreeService(apiClient: AutocompleteAddressApiClient): TextNodeTreeService<Address> {
    const _toReqDtoMapper: ToReqDtoMapper = createToReqDtoMapper();

    async function getNodesByCaretText(value: string, caretIndexInValue: number, abortController?: AbortController): Promise<Result<ResultingCaretTextQueryNode<Address>[]>> {
        const reqDto: AutocompleteAddressRequestDto = _toReqDtoMapper.mapCaretTextToReqDto(value, caretIndexInValue);
        const resDtosResult: Result<AutocompleteAddressResponseDto[]> = await apiClient.readAutocompleteAddresses(reqDto, abortController);
        return _mapResDtosToNodes(resDtosResult);
    }

    async function getNodesByNode(node: ResultingCaretTextQueryNode<Address>): Promise<Result<ResultingCaretTextQueryNode<Address>[]>> {
        const reqDto: AutocompleteAddressRequestDto = _toReqDtoMapper.mapNodeToReqDto(node);
        const resDtosResult: Result<AutocompleteAddressResponseDto[]> = await apiClient.readAutocompleteAddresses(reqDto);
        return _mapResDtosToNodes(resDtosResult);
    }

    return {
        getNodesByCaretText,
        getNodesByNode
    }

    function _mapResDtosToNodes(resDtosResult: Result<AutocompleteAddressResponseDto[]>): Result<ResultingCaretTextQueryNode<Address>[]> {
        return mapSuccess(resDtosResult, (s: AutocompleteAddressResponseDto[]): ResultingCaretTextQueryNode<Address>[] =>
            s.map((dto: AutocompleteAddressResponseDto): ResultingCaretTextQueryNode<Address> => mapResDtoToNode(dto, getNodesByNode))
        );
    }
}