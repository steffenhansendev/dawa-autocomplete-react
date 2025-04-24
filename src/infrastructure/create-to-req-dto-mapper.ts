import {Address} from "../core/address/Address";
import {AutocompleteAddressRequestDto, AutocompleteAddressRequestDtoScope} from "./dawa/AutocompleteAddressRequestDto";
import {AddressType} from "../core/address/AddressType";
import {ResultingCaretTextQueryNode} from "../core/text-node-search/types";
import {AutocompleteAddressEntityTypeDto} from "./dawa/AutocompleteAddressResponseDto";
import {configuration} from "../configuration/configure";

export interface ToReqDtoMapper {
    mapNodeToReqDto(node: ResultingCaretTextQueryNode<Address>): AutocompleteAddressRequestDto;

    mapCaretTextToReqDto(value: string, caretIndexInValue: number): AutocompleteAddressRequestDto;
}

export function createToReqDtoMapper(): ToReqDtoMapper {
    const _zipCodesSelection: string[] = configuration.zipCodesSelection;
    const _municipalityCodesSelection: string[] = configuration.municipalityCodesSelection;

    function mapNodeToReqDto(node: ResultingCaretTextQueryNode<Address>): AutocompleteAddressRequestDto {
        return {
            value: node.query.value,
            caretIndexInValue: node.query.caretIndex,
            type: _mapAddressTypeToDto(AddressType.Address),
            scope: _createAutocompleteAddressRequestScopeFromAddress(node.result)
        };
    }

    function mapCaretTextToReqDto(value: string, caretIndexInValue: number): AutocompleteAddressRequestDto {
        return {
            value: value,
            caretIndexInValue: caretIndexInValue,
            scope: {
                zipCodes: _zipCodesSelection,
                municipalityCodes: _municipalityCodesSelection
            }
        };
    }

    return {
        mapCaretTextToReqDto,
        mapNodeToReqDto
    }

    function _createAutocompleteAddressRequestScopeFromAddress(address: Address | null): AutocompleteAddressRequestDtoScope {
        let leastSpecificity: AutocompleteAddressEntityTypeDto | undefined;
        let entranceAddressId: string | undefined;
        switch (address?.type) {
            case undefined:
                leastSpecificity = _mapAddressTypeToDto(AddressType.Entrance);
                break;
            case AddressType.Entrance:
                entranceAddressId = address.id;
                break;
            case AddressType.Address:
                entranceAddressId = address.entranceAddressId!;
                break;
        }
        return {
            leastSpecificity: leastSpecificity,
            entranceAddressId: entranceAddressId,
            zipCodes: _zipCodesSelection,
            municipalityCodes: _municipalityCodesSelection
        };
    }

    function _mapAddressTypeToDto(type: AddressType): AutocompleteAddressEntityTypeDto {
        switch (type) {
            case AddressType.Entrance:
                return "adgangsadresse"
            case AddressType.Address:
                return "adresse";
        }
    }
}