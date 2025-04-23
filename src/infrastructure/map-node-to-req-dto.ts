import {Address} from "../core/address/Address";
import {AutocompleteAddressRequestDto} from "./dawa/AutocompleteAddressRequestDto";
import {AddressType} from "../core/address/AddressType";
import {AutocompleteAddressEntityTypeDto} from "./dawa/AutocompleteAddressResponseDto";
import {ResultingCaretTextQueryNode} from "../core/text-node-search/types";

export function mapNodeToReqDto(node: ResultingCaretTextQueryNode<Address>): AutocompleteAddressRequestDto {
    const reqDto: AutocompleteAddressRequestDto = {
        value: node.query.value,
        caretIndexInValue: node.query.caretIndex,
        scope: {type: mapAddressTypeToDto(AddressType.Address)}
    }
    switch (node.result?.type) {
        case undefined:
            reqDto.scope!.leastSpecificity = mapAddressTypeToDto(AddressType.Entrance);
            break;
        case AddressType.Entrance:
            reqDto.scope!.entranceAddressId = node.result.id;
            break;
        case AddressType.Address:
            reqDto.scope!.entranceAddressId = node.result.entranceAddressId!;
            break;
    }
    return reqDto;
}

function mapAddressTypeToDto(type: AddressType): AutocompleteAddressEntityTypeDto {
    switch (type) {
        case AddressType.Entrance:
            return "adgangsadresse"
        case AddressType.Address:
            return "adresse";
    }
}