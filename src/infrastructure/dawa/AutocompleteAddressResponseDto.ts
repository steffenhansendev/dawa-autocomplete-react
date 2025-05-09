export type AutocompleteAddressResponseDto = Readonly<_AutocompleteAddressResponseDto>;

interface _AutocompleteAddressResponseDto {
    type: AutocompleteAddressTypeDto;
    tekst: string;
    caretpos: number;
    forslagstekst: string;
    data: DataDto;
    stormodtagerpostnr: boolean;
}

export type DataDto = Readonly<_DataDto>;

interface _DataDto {
    id?: string;
    status?: number;
    darstatus?: number;
    vejkode?: string;
    vejnavn?: string;
    adresseringsvejnavn?: string;
    husnr?: string;
    etage?: string;
    dør?: string;
    supplerendebynavn?: string;
    postnr?: string;
    postnrnavn?: string;
    kommunekode?: string;
    adgangsadresseid?: string; // only present if type = adresse
    x?: number;
    y?: number;
    href?: string;
    navn?: string;
}

export type AutocompleteAddressEntityTypeDto = "adgangsadresse" | "adresse";
export type AutocompleteAddressValueObjectTypeDto = "vejnavn";
export type AutocompleteAddressTypeDto = AutocompleteAddressValueObjectTypeDto & AutocompleteAddressEntityTypeDto;