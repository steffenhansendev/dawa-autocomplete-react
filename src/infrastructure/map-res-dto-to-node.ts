import {
    AutocompleteAddressEntityTypeDto,
    AutocompleteAddressResponseDto
} from "./dawa/AutocompleteAddressResponseDto";
import {ResultingCaretTextQueryNode} from "../core/text-node-search/types";
import {Address} from "../core/address/Address";
import {CaretText} from "../core/text-node-search/CaretText";
import {createCaretText} from "../core/text-node-search/create-caret-text";
import {Result} from "../shared/Result";
import {createResultingCaretTextQueryNode} from "../core/text-node-search/create-resulting-caret-text-query-node";
import {createAddress} from "../core/address/create-address";
import {AddressType} from "../core/address/AddressType";

export function mapResDtoToNode(
    resDto: AutocompleteAddressResponseDto,
    getNodesByNode: (node: ResultingCaretTextQueryNode<Address>) => Promise<Result<ResultingCaretTextQueryNode<Address>[]>>
): ResultingCaretTextQueryNode<Address> {
    const isLeaf: boolean = resDto.type === "adresse";
    const isRoot: boolean = resDto.type === "vejnavn";
    const address: Address | null = mapResDtoToAddress(resDto);
    const query: CaretText = createCaretText(resDto.tekst, resDto.caretpos);
    const presentable: CaretText = createCaretText(resDto.forslagstekst);
    return createResultingCaretTextQueryNode(isRoot, isLeaf, getNodesByNode, query, presentable, address);
}

function mapResDtoToAddress(dto: AutocompleteAddressResponseDto): Address | null {
    if (!isAddress(dto)) {
        return null;
    }
    return createAddress(
        dto.data.id!,
        mapToAddressType(dto.type),
        dto.data.vejnavn!,
        dto.data.husnr!,
        dto.data.postnr!,
        dto.data.postnrnavn!,
        dto.data.etage,
        dto.data.dør,
        dto.data.vejkode,
        dto.data.adresseringsvejnavn,
        dto.data.supplerendebynavn,
        dto.data.kommunekode,
        dto.data.status,
        dto.data.darstatus,
        dto.data.adgangsadresseid,
        dto.data.y,
        dto.data.x,
        dto.data.href
    );
}

function isAddress(dto: AutocompleteAddressResponseDto): boolean {
    return !!dto.data.id &&
        !!dto.type &&
        dto.type !== "vejnavn" &&
        !!dto.data.vejnavn &&
        !!dto.data.husnr &&
        !!dto.data.postnr &&
        !!dto.data.postnrnavn;
}

function mapToAddressType(typeDto: AutocompleteAddressEntityTypeDto): AddressType {
    switch (typeDto) {
        case "adgangsadresse":
            return AddressType.Entrance;
        case "adresse":
            return AddressType.Address;
    }
}